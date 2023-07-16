function updateX(value) {
  console.log("x :", value);
  varX = value;
}

function updateY(value) {
  console.log("y :", value);
  varY = value;
}

function updateZ(value) {
  console.log("z:", value);
  varZ = value;
}

function updateYRMul(value) {
  YRMul = value;
}

function setJewellery(value) {
  location.href = `/tryon.html?dir=${value}`;
}

function applyRingTrans() {
  gRayMarchScene.children[0].material.uniforms.ringTrans.value = ringTrans;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function applyTransVar() {
  gRayMarchScene.children[0].material.uniforms.transVar.value = transVar;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function resetTransVar() {
  gRayMarchScene.children[0].material.uniforms.transVar.value = 1;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function resetRingTrans() {
  gRayMarchScene.children[0].material.uniforms.ringTrans.value = 1.5;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function hideJewel() {
  showingJewel = 0;
  gRayMarchScene.children[0].material.uniforms.showingJewel.value = 0;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

function showJewel() {
  showingJewel = 1;
  gRayMarchScene.children[0].material.uniforms.showingJewel.value = 1;
  gRenderer.render(gRayMarchScene, gBlitCamera);
}

let showhandscreen = document.getElementById("showhandscreen");
let usermanual = document.getElementById("usermanual");

function hideHandScreen() {
  showhandscreen.style.display = "none";
}

// Method to enable or disable fullscreen view
const fullscreen = (mode = true, el = "body") =>
  mode
    ? document.querySelector(el).requestFullscreen()
    : document.exitFullscreen();

function resetMeshForVR() {
  cameraControls.moveTo(0.0, 0.0, 0.0, true);
  if (jewelType === "ring") {
    if (isIOS || isMobile) cameraControls.zoomTo(0.5, false);
    else cameraControls.zoomTo(0.75, false);
  } else {
    if (isIOS || isMobile) cameraControls.zoomTo(1, false);
    else cameraControls.zoomTo(1.25, false);
  }

  if (selectedJewel === "flowerbangle") {
    console.log(selectedJewel);
    cameraControls.azimuthAngle = THREE.MathUtils.degToRad(-125);
    cameraControls.polarAngle = THREE.MathUtils.degToRad(72);
  } else if (selectedJewel === "trivenibangle") {
    cameraControls.azimuthAngle = THREE.MathUtils.degToRad(100);
    cameraControls.polarAngle = THREE.MathUtils.degToRad(72);
  } else if (selectedJewel === "patternedring") {
    cameraControls.azimuthAngle = THREE.MathUtils.degToRad(-170);
    cameraControls.polarAngle = THREE.MathUtils.degToRad(90);
  } else if (selectedJewel === "trinetraring") {
    cameraControls.azimuthAngle = THREE.MathUtils.degToRad(-170);
    cameraControls.polarAngle = THREE.MathUtils.degToRad(83);
  } else if (selectedJewel === "floralring") {
    cameraControls.azimuthAngle = THREE.MathUtils.degToRad(-170);
    cameraControls.polarAngle = THREE.MathUtils.degToRad(90);
  }
  cameraControls.setFocalOffset(0.0, 0.0, 0.0);
  ZRAngle = 0;
  // flipping canvas
  if (jewelType === "ring" && !isDirectionalRing) {
    glamCanvas.style.transform = "rotateZ(" + 180 + "deg)";
  } else {
    glamCanvas.style.transform = "none";
  }
  showJewel();
}

function resetMesh() {
  cameraControls.moveTo(0.0, 0.0, 0.0, true);
  if (jewelType == "bangle") cameraControls.zoomTo(1, false);
  else cameraControls.zoomTo(0.5, false);

  if (jewelType === "ring") {
    cameraControls.azimuthAngle = THREE.MathUtils.degToRad(-180);
  } else {
    if (selectedJewel === "tribangle")
      cameraControls.azimuthAngle = THREE.MathUtils.degToRad(-90);
    else cameraControls.azimuthAngle = THREE.MathUtils.degToRad(-40);
  }
  cameraControls.polarAngle = basePhi;
  cameraControls.setFocalOffset(0.0, 0.0, 0.0);
  ZRAngle = 0;
  glamCanvas.style.transform = "none";
  hideJewel();
}

function startSession() {
  usermanual.style.display = "none";
}

function showManual() {
  let step1img = document.getElementById("step1img");
  let step2img = document.getElementById("step2img");
  let step3img = document.getElementById("step3img");

  step1img.src = `assets/${jewelType}step1.jpg`;
  step2img.src = `assets/${jewelType}step2.jpg`;
  step3img.src = `assets/${jewelType}step3.gif`;

  retrycamscreen.style.display = "none";
  usermanual.style.display = "flex";

  toggleVideo();
}

/**
 * Reports an error to the user by populating the error div with text.
 * @param {string} text
 */
function error(text) {
  const e = document.getElementById("error");
  e.textContent = text;
  e.style.display = "block";
}

/**
 * Creates a DOM element that belongs to the given CSS class.
 * @param {string} what
 * @param {string} classname
 * @return {!HTMLElement}
 */
function create(what, classname) {
  const e = /** @type {!HTMLElement} */ (document.createElement(what));
  if (classname) {
    e.className = classname;
  }
  return e;
}

/**
 * Formats the integer i as a string with "min" leading zeroes.
 * @param {number} i
 * @param {number} min
 * @return {string}
 */
function digits(i, min) {
  const s = "" + i;
  if (s.length >= min) {
    return s;
  } else {
    return ("00000" + s).substr(-min);
  }
}

/**
 * Resizes a DOM element to the given dimensions.
 * @param {!Element} element
 * @param {number} width
 * @param {number} height
 */
function setDims(element, width, height) {
  element.style.width = width.toFixed(2) + "px";
  element.style.height = height.toFixed(2) + "px";
}

/**
 * Adds event listeners to UI.
 */
function addHandlers() {
  const view = document.querySelector(".view");
  view.addEventListener("keypress", function (e) {
    if (e.keyCode === 32 || e.key === " " || e.key === "Spacebar") {
      if (gDisplayMode == DisplayModeType.DISPLAY_NORMAL) {
        gDisplayMode = DisplayModeType.DISPLAY_DIFFUSE;
      } else if (gDisplayMode == DisplayModeType.DISPLAY_DIFFUSE) {
        gDisplayMode = DisplayModeType.DISPLAY_FEATURES;
      } else if (gDisplayMode == DisplayModeType.DISPLAY_FEATURES) {
        gDisplayMode = DisplayModeType.DISPLAY_VIEW_DEPENDENT;
      } else if (gDisplayMode == DisplayModeType.DISPLAY_VIEW_DEPENDENT) {
        gDisplayMode = DisplayModeType.DISPLAY_COARSE_GRID;
      } else if (gDisplayMode == DisplayModeType.DISPLAY_COARSE_GRID) {
        gDisplayMode = DisplayModeType.DISPLAY_3D_ATLAS;
      } /* gDisplayModeType == DisplayModeType.DISPLAY_3D_ATLAS */ else {
        gDisplayMode = DisplayModeType.DISPLAY_NORMAL;
      }
      e.preventDefault();
    }
  });
}

function updateJewelname() {
  let updateNote = document.getElementById("updatenote");
  switch (selectedJewel) {
    case "flowerbangle":
      updateNote.innerText = "Flower Bangle";
      break;
    case "trivenibangle":
      updateNote.innerText = "Triveni Bangle";
      break;
    case "trinetraring":
      updateNote.innerText = "Trinetra Ring";
      break;
    case "patternedring":
      updateNote.innerText = "Patterned Ring";
      break;
    case "floralring":
      updateNote.innerText = "Floral Ring";
      break;
    default:
      updateNote.innerText = "Welcome to jAR4U";
      break;
  }
}

/**
 * Hides the Loading prompt.
 */
function hideLoading() {
  let loading = document.getElementById("Loading");
  loading.style.display = "none";

  let loadingContainer = document.getElementById("loading-container");
  loadingContainer.style.display = "none";

  updateJewelname();
  glamCanvas.style.display = "block";

  const desktopViewAR = document.getElementById("desktop-viewar");
  const mobileViewAR = document.getElementById("mobile-viewar");
  let viewARButton = isMobile || isIOS ? mobileViewAR : desktopViewAR;
  viewARButton.disabled = false;
  viewARButton.onclick = showManual;
  viewARButton.classList.remove("disabledbtn");
}

/**
 * Updates the loading progress HTML elements.
 */

let currentMessage = null;
let currentFunFact = null;
let lastUpdate = Date.now();

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function updateMessageAndFunFact() {
  const loadingMessages = [
    "Polishing precious jewels",
    "Stringing precious pearls",
    "Forging jewelry treasures",
    "Creating jewelry sparkle",
    "Designing the masterpiece",
    "Unearthing golden stones",
    "Weaving the golden thread",
    "Crafting artwork of stars",
    "Unlocking the jewelry box",
  ];

  const funFactsAndTips = [
    "Did you know? The Hope Diamond is one of the most famous gemstones, weighing 45.52 carats!",
    "Tip: To get the best AR experience, make sure you're in a well-lit room.",
    "Fact: Pearls are the only gemstones created by living creatures, like oysters and mussels.",
    "Tip: Make sure your device's camera lens is clean for the best AR jewelry viewing experience.",
    "Fact: The word 'jewelry' is derived from the Latin word 'jocale,' meaning 'plaything.'",
    "Tip: For a more accurate jewelry fit in the AR experience, hold your device steady and parallel to the surface.",
    "Fact: The largest diamond ever discovered, the Cullinan Diamond, weighed 3,106 carats!",
    "Tip: You can take screenshots of your favorite AR jewelry pieces to share with friends or for future reference.",
    "Fact: Rubies, sapphires, and emeralds are considered 'precious' gemstones, while all others are categorized as 'semi-precious.'",
    "Tip: For best AR experience, make sure that no major light source is behind you.",
  ];

  currentMessage = getRandomItem(loadingMessages);
  currentFunFact = getRandomItem(funFactsAndTips);

  lastUpdate = Date.now();
}

function updateLoadingProgress() {
  let funOrFact = document.getElementById("funorfact");

  let loadPercentage =
    gNumTextures > 0 ? (100 * gLoadedRGBATextures) / gNumTextures : "0";

  const num = parseFloat(loadPercentage);
  loadPercentage = num.toFixed(2).toString();

  if (loadPercentage.endsWith(".00")) {
    loadPercentage = parseInt(num).toString();
  }

  const timeSinceLastUpdate = Date.now() - lastUpdate;
  const updateInterval = 5000; // 5 seconds

  if (
    !currentMessage ||
    !currentFunFact ||
    timeSinceLastUpdate > updateInterval
  ) {
    updateMessageAndFunFact();
  }

  funOrFact.innerHTML = currentFunFact;

  const loadingContainer = document.getElementById("loading-container");
  loadingContainer.innerHTML = `
  <div role="progressbar" aria-valuenow="${loadPercentage}" aria-valuemin="0" aria-valuemax="100" style="--value: ${loadPercentage}"></div>            
  <p class="progresstext">${currentMessage}</p>
  `;
}

function showError(error, msg1, msg2, imgsrc) {
  const j4container = document.getElementById("j4container");
  const titleContainer = document.getElementById("tryon-title");
  const arToggleContainer = document.getElementById("ar-toggle-container");
  const viewerContainer = document.getElementById("viewer-container");
  const arBottomContainer = document.getElementById("ar-bottom-container");
  const reloadbtn = document.getElementById("reloadbtn");

  let errorBox = document.getElementById("error-box");
  let errormsg1 = document.getElementById("error-msg1");
  let errormsg2 = document.getElementById("error-msg2");
  let errorimg = document.getElementById("errorimg");

  if (errormsg1) errormsg1.innerText = msg1;
  if (errormsg2) errormsg2.innerText = msg2;
  if (errorimg) {
    if (imgsrc && imgsrc.length) errorimg.src = `assets/${imgsrc}`;
    else errorimg.style.display = "none";
  }

  const newWidth = (window.innerWidth * 85) / 100;
  const newHeight = (window.innerHeight * 85) / 100;
  setDims(errorBox, newWidth, newHeight);
  errorBox.style.display = "block";
  if (titleContainer) titleContainer.style.display = "block";
  if (j4container) j4container.style.display = "none";
  if (arToggleContainer) arToggleContainer.style.display = "none";
  if (viewerContainer) viewerContainer.style.display = "none";
  if (arBottomContainer) arBottomContainer.style.display = "none";
  reloadbtn.onclick = function () {
    location.reload();
  };

  console.error(error);
}

function generateQR(user_input) {
  let qr_container = document.querySelector(".qr-code-container");
  qr_container.style.display = "flex";

  let qr_code_element = document.querySelector(".qr-code");
  qr_code_element.style = "";

  var qrcode = new QRCode(qr_code_element, {
    text: `${user_input.value}`,
    width: 180, //128
    height: 180,
    colorDark: "#333333",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  // To Download QR Code

  // let download = document.createElement("button");
  // qr_code_element.appendChild(download);

  // let download_link = document.createElement("a");
  // download_link.setAttribute("download", "qr_code.png");
  // download_link.innerHTML = `Download <i class="fa-solid fa-download"></i>`;

  // download.appendChild(download_link);

  let qr_code_img = document.querySelector(".qr-code img");
  let qr_code_canvas = document.querySelector("canvas");

  if (qr_code_img.getAttribute("src") == null) {
    setTimeout(() => {
      download_link.setAttribute("href", `${qr_code_canvas.toDataURL()}`);
    }, 300);
  } else {
    setTimeout(() => {
      download_link.setAttribute("href", `${qr_code_img.getAttribute("src")}`);
    }, 300);
  }
}

/**
 * Checks whether the WebGL context is valid and the underlying hardware is
 * powerful enough. Otherwise displays a warning.
 * @return {boolean}
 */
function isRendererUnsupported() {
  let gl = document.getElementsByTagName("canvas")[1].getContext("webgl2");
  // console.log("renderer-webgl-context", gl);

  if (!gl) {
    showError(
      "jar4u Error: WebGL2 context not found.",
      "Looks like your browser doesn't support advanced AR.",
      "Please scan the QR code below or navigate to this link in your phone to try out the jewellery piece. !",
      ""
    );
    generateQR({
      value: window.location.href,
    });
    return true;
  }

  let debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (!debugInfo) {
    showError(
      "jar4u Error: Could not fetch renderer info.",
      "Looks like your browser doesn't support advanced AR.",
      "Please scan the QR code below or navigate to this link in your phone to try out the jewellery piece. !",
      ""
    );
    generateQR({
      value: window.location.href,
    });
    return true;
  }

  // let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  // if (!renderer || renderer.search("SwiftShader") >= 0 ||
  //     (renderer.search("ANGLE") >= 0 &&
  //      renderer.search("Intel") >= 0 &&
  //      (renderer.search("HD Graphics") >= 0 ||
  //       renderer.search("UHD Graphics") >= 0))) {
  // loading.innerHTML = "Error: Unsupported renderer: " + renderer +
  //   ". Are you running with hardware acceleration enabled?";
  //   return true;
  // }

  return false;
}

window.showError = showError;
