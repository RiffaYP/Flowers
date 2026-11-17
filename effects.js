"use strict";

/* ============================================================
   Surprise card — flowers by Riffa
   - personal message via ?to= & ?msg=
   - random phrases + "Surprise lagi"
   - Web Share API + clipboard fallback
   - canvas PNG export
   - pause effects when tab hidden
   ============================================================ */

const startBtn     = document.getElementById("startBtn");
const overlay      = document.getElementById("startOverlay");
const popup        = document.getElementById("popup");
const closePopup   = document.getElementById("closePopup");
const again        = document.getElementById("again");
const shareBtn     = document.getElementById("share");
const saveImg      = document.getElementById("saveImg");
const popupMsg     = document.getElementById("popupMsg");
const popupTitle   = document.getElementById("popupTitle");
const startGreeting= document.getElementById("startGreeting");
const hearts       = document.getElementById("hearts");
const petalContainer = document.getElementById("petalContainer");
const toastEl      = document.getElementById("toast");

const reduceMotion = window.Flower.reduceMotion;

const PHRASES = [
  "Semoga harimu penuh bunga dan senyuman.",
  "Kamu pantas mendapatkan semua hal indah hari ini.",
  "Sekuntum bunga untuk seseorang yang istimewa.",
  "Tetap bersinar, seperti bunga yang selalu mekar.",
  "Terima kasih sudah menjadi dirimu.",
  "Semoga senyummu tak pernah layu.",
  "Setiap kelopak membawa satu doa baik untukmu.",
  "Kamu lebih berharga dari seribu taman bunga."
];

/* ---------- personalization ---------- */
const params = new URLSearchParams(location.search);
const toName = (params.get("to") || "").trim().slice(0, 40);
const urlMsg = (params.get("msg") || "").trim().slice(0, 160);

function currentMessage(){
  if(urlMsg) return urlMsg;
  return PHRASES[Math.floor(Math.random() * PHRASES.length)];
}

function applyPersonalization(){
  if(toName){
    popupTitle.textContent = `Surprise untuk ${toName}`;
    startGreeting.textContent = `Untuk ${toName} — ketuk untuk memulai`;
  }
}
applyPersonalization();

/* ---------- toast ---------- */
let toastTimer;
function toast(text){
  toastEl.textContent = text;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

/* ---------- effects ---------- */
function makeFallingPetal(){
  const el = document.createElement("div");
  el.className = "petal-fall";
  el.style.left = (Math.random() * 100) + "vw";
  const dur = 6 + Math.random() * 5;
  el.style.animationDuration = dur + "s";
  el.style.animationDelay = (Math.random() * 2) + "s";
  el.style.width = (10 + Math.random() * 8) + "px";
  petalContainer.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 2500);
  return el;
}

function fallingPetals(){
  if(reduceMotion) return;
  const count = window.innerWidth < 600 ? 12 : 22;
  for(let i = 0; i < count; i++) makeFallingPetal();
}

function floatingHearts(){
  if(reduceMotion) return;
  for(let i = 0; i < 6; i++){
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = "\u2764\uFE0F";
    h.style.left = (5 + Math.random() * 90) + "%";
    h.style.fontSize = (18 + Math.random() * 22) + "px";
    h.style.animationDelay = (Math.random() * 3) + "s";
    hearts.appendChild(h);
    setTimeout(() => h.remove(), 11000);
  }
}

/* ---------- pause when tab hidden ---------- */
document.addEventListener("visibilitychange", () => {
  document.documentElement.classList.toggle("paused", document.hidden);
});

/* ---------- PNG card ---------- */
function drawCard(time){
  const W = 1080, H = 1080;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");

  const bg = ctx.createRadialGradient(W / 2, H * 0.35, 100, W / 2, H / 2, W * 0.75);
  bg.addColorStop(0, "#1b2540");
  bg.addColorStop(1, "#0f1724");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* draw the live SVG flower onto the canvas */
  const clone = document.getElementById("flower").cloneNode(true);
  clone.setAttribute("width", W);
  clone.setAttribute("height", W * 460 / 400);
  const svgStr = new XMLSerializer().serializeToString(clone);
  const img = new Image();
  const svgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);

  img.onload = () => {
    const drawW = 760;
    const drawH = drawW * 460 / 400;
    ctx.drawImage(img, (W - drawW) / 2, 60, drawW, drawH);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 46px system-ui, sans-serif";
    ctx.fillText(toName ? `Untuk ${toName}` : "Untuk kamu", W / 2, H - 200);

    ctx.fillStyle = "#ffd0e0";
    ctx.font = "34px system-ui, sans-serif";
    wrapText(ctx, time, W / 2, H - 130, W - 160, 44);

    ctx.fillStyle = "rgba(255,255,255,.4)";
    ctx.font = "24px system-ui, sans-serif";
    ctx.fillText("🌷 Flowers", W / 2, H - 40);

    c.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "flowers-card.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast("Kartu tersimpan 🎉");
    }, "image/png");
  };
  img.onerror = () => toast("Gagal membuat gambar");
  img.src = svgUrl;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for(const w of words){
    const test = line ? line + " " + w : w;
    if(ctx.measureText(test).width > maxWidth && line){
      lines.push(line);
      line = w;
    } else line = test;
  }
  if(line) lines.push(line);
  const startY = y - (lines.length - 1) * lineHeight / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
}

/* ---------- share ---------- */
function shareUrl(){
  return location.origin + location.pathname +
    (toName ? `?to=${encodeURIComponent(toName)}` : "");
}

async function shareCard(){
  const text = currentMessage();
  try{
    if(navigator.share){
      await navigator.share({
        title: toName ? `Bunga untuk ${toName}` : "Bunga untukmu",
        text: text,
        url: shareUrl()
      });
    } else {
      await navigator.clipboard.writeText(`${text}\n${shareUrl()}`);
      toast("Tautan disalin");
    }
  }catch(err){
    if(err && err.name === "AbortError") return;
    try{
      await navigator.clipboard.writeText(`${text}\n${shareUrl()}`);
      toast("Tautan disalin");
    }catch{ toast("Gagal membagikan"); }
  }
}

/* ---------- flow ---------- */
let started = false;

function showPopup(){
  popupMsg.textContent = currentMessage();
  popup.classList.remove("hidden");
  requestAnimationFrame(() => again.focus());
}

function startExperience(){
  if(started) return;
  started = true;
  overlay.remove();
  window.Flower.buildFlower();
  fallingPetals();
  floatingHearts();
  setTimeout(showPopup, 2600);
}

function replay(){
  popup.classList.add("hidden");
  window.Flower.buildFlower();
  fallingPetals();
  floatingHearts();
  setTimeout(showPopup, 2600);
}

startBtn.addEventListener("click", e => {
  e.stopPropagation();
  startExperience();
});
overlay.addEventListener("click", startExperience);

closePopup.addEventListener("click", () => popup.classList.add("hidden"));
again.addEventListener("click", replay);
shareBtn.addEventListener("click", shareCard);
saveImg.addEventListener("click", () => drawCard(currentMessage()));

document.addEventListener("keydown", e => {
  if(e.key === "Escape" && !popup.classList.contains("hidden")){
    popup.classList.add("hidden");
  }
});
