"use strict";

const startBtn     = document.getElementById("startBtn");
const overlay      = document.getElementById("startOverlay");
const popup        = document.getElementById("popup");
const closePopup   = document.getElementById("closePopup");
const again        = document.getElementById("again");
const petalsLayer  = document.querySelector(".petals");
const hearts       = document.getElementById("hearts");
const petalContainer = document.getElementById("petalContainer");

const OUTER_PETALS = 8;
const INNER_PETALS = 6;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- BUILD FLOWER (once) ---------- */
function buildFlower(){
  const outerStep = 360 / OUTER_PETALS;
  const innerStep = 360 / INNER_PETALS;

  for(let i = 0; i < OUTER_PETALS; i++){
    const p = document.createElement("div");
    p.className = "petal";
    p.style.setProperty("--angle", (i * outerStep) + "deg");
    p.style.setProperty("--delay", (0.15 + i * 0.06) + "s");
    petalsLayer.appendChild(p);
  }
  for(let i = 0; i < INNER_PETALS; i++){
    const p = document.createElement("div");
    p.className = "petal petal-inner";
    p.style.setProperty("--angle", (i * innerStep + innerStep / 2) + "deg");
    p.style.setProperty("--delay", (0.5 + i * 0.06) + "s");
    petalsLayer.appendChild(p);
  }
}

/* ---------- EFFECTS ---------- */
function fallingPetals(){
  if(reduceMotion) return;
  const count = window.innerWidth < 600 ? 12 : 22;
  for(let i = 0; i < count; i++){
    const el = document.createElement("div");
    el.className = "petal-fall";
    el.style.left = (Math.random() * 100) + "vw";
    const dur = 6 + Math.random() * 5;
    el.style.animationDuration = dur + "s";
    el.style.animationDelay = (Math.random() * 2) + "s";
    el.style.width = (10 + Math.random() * 8) + "px";
    petalContainer.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 2500);
  }
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

/* ---------- FLOW ---------- */
let started = false;
function startExperience(){
  if(started) return;
  started = true;
  overlay.remove();
  buildFlower();
  fallingPetals();
  floatingHearts();
  setTimeout(() => {
    popup.classList.remove("hidden");
    again.focus();
  }, 2200);
}

function replay(){
  popup.classList.add("hidden");
  petalsLayer.innerHTML = "";
  buildFlower();
  fallingPetals();
  floatingHearts();
}

startBtn.addEventListener("click", e => {
  e.stopPropagation();
  startExperience();
});
overlay.addEventListener("click", startExperience);

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});

again.addEventListener("click", replay);

document.addEventListener("keydown", e => {
  if(e.key === "Escape" && !popup.classList.contains("hidden")){
    popup.classList.add("hidden");
  }
});
