let imageData = [];

let originalData = [];

let currentScale = 1;

const gallery =
  document.getElementById("gallery");

/**
 * 加载 images.json
 */

async function loadImages(){

  try{

    const response =
      await fetch("./images.json");

    const files =
      await response.json();

    imageData =
      files.map(parseFile);

    originalData =
      [...imageData];

    renderGallery(imageData);

  }catch(err){

    gallery.innerHTML = `

      <div class="empty">

        图片加载失败

      </div>
    `;

    console.error(err);
  }
}

/**
 * 解析文件名
 * 平台_标题_作者_日期.webp
 */

function parseFile(file){

  const name =
    file.replace(".webp","");

  const parts =
    name.split("_");

  return{

    file,

    path:
      "./Images/" + file,

    platform:
      parts[0] || "未知平台",

    title:
      parts[1] || "未知标题",

    author:
      parts[2] || "未知作者",

    date:
      parts[3] || "未知日期"
  };
}

/**
 * 渲染画廊
 */

function renderGallery(data){

  gallery.innerHTML = "";

  if(!data.length){

    gallery.innerHTML = `

      <div class="empty">

        没有图片

      </div>
    `;

    return;
  }

  data.forEach((item,index)=>{

    const card =
      document.createElement("div");

    card.className = "card";

    card.style.animationDelay =
      `${index * .05}s`;

    card.innerHTML = `

      <div class="image-wrapper">

        <img
          src="${item.path}"
          loading="lazy"
          alt="${item.title}"
        >

      </div>

      <div class="info">

        <div class="tag-group">

            <div class="platform">
                ${item.platform}
            </div>

            <div class="cc-license">
                CC BY-NC-ND
            </div>

        </div>

        <div class="title">
          ${item.title}
        </div>

        <div class="meta">

          <div>
            作者：${item.author}
          </div>

          <div>
            日期：${item.date}
          </div>

        </div>

        <button
          class="copy-btn"
        >
          复制图片地址
        </button>

      </div>
    `;

    const img =
      card.querySelector("img");

    img.onclick =
      ()=>openViewer(item.path);

    const copyBtn =
      card.querySelector(".copy-btn");

    copyBtn.onclick =
      (e)=>copyImageUrl(
        item.path,
        e.target
      );

    gallery.appendChild(card);
  });
}

/**
 * 复制图片URL
 */

async function copyImageUrl(path,btn){

  try{

    const fullUrl =
      new URL(
        path,
        window.location.href
      ).href;

    await navigator
      .clipboard
      .writeText(fullUrl);

    const oldText =
      btn.innerText;

    btn.innerText =
      "已复制";

    btn.classList.add("copied");

    setTimeout(()=>{

      btn.innerText =
        oldText;

      btn.classList.remove(
        "copied"
      );

    },1200);

  }catch(err){

    console.error(err);
  }
}

/**
 * 排序
 */

function sortByDate(){

  imageData.sort((a,b)=>
    new Date(b.date)
    -
    new Date(a.date)
  );

  renderGallery(imageData);
}

function sortByPlatform(){

  imageData.sort((a,b)=>
    a.platform.localeCompare(
      b.platform
    )
  );

  renderGallery(imageData);
}

function resetGallery(){

  imageData =
    [...originalData];

  renderGallery(imageData);
}

/**
 * 图片查看器
 */

function openViewer(src){

  const viewer =
    document.getElementById(
      "viewer"
    );

  const viewerImage =
    document.getElementById(
      "viewerImage"
    );

  viewer.style.display =
    "flex";

  viewerImage.src = src;

  currentScale = 1;

  updateZoom();
}

function closeViewer(){

  document.getElementById(
    "viewer"
  ).style.display = "none";
}

function zoomIn(){

  currentScale += .2;

  updateZoom();
}

function zoomOut(){

  currentScale =
    Math.max(
      .2,
      currentScale - .2
    );

  updateZoom();
}

function resetZoom(){

  currentScale = 1;

  updateZoom();
}

function updateZoom(){

  document.getElementById(
    "viewerImage"
  ).style.transform =
    `scale(${currentScale})`;
}

/**
 * ESC关闭
 */

document.addEventListener(
  "keydown",
  e=>{

    if(e.key==="Escape")
      closeViewer();
  }
);

/**
 * 点击背景关闭
 */

document
  .getElementById("viewer")
  .addEventListener(
    "click",
    e=>{

      if(e.target.id==="viewer")
        closeViewer();
    }
  );

/**
 * 初始化
 */

loadImages();