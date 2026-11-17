"use strict";

const NS = "http://www.w3.org/2000/svg";

const startBtn     = document.getElementById("startBtn");
const overlay      = document.getElementById("startOverlay");
const popup        = document.getElementById("popup");
const closePopup   = document.getElementById("closePopup");
const again        = document.getElementById("again");
const svg          = document.getElementById("flower");
const petalsGroup  = document.getElementById("petals");
const coreGroup    = document.getElementById("coreGroup");
const stemEl       = svg.querySelector(".stem");
const leaves       = svg.querySelectorAll(".leaf");
const hearts       = document.getElementById("hearts");
const petalContainer = document.getElementById("petalContainer");

const CX = 200;
const CY = 196;

const OUTER = { count: 8, len: 1.0,  spread: 0.0, grad: "url(#petalGrad)" };
const INNER = { count: 6, len: 0.66, spread: 0.5, grad: "url(#petalGradInner)" };

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- BUILD ---------- */
function makePetal(cfg, index, delay){
  const step = 360 / cfg.count;
  const angle = index * step + cfg.spread * step;

  /* outer <g>: positioned + rotated around the bloom center */
  const g = document.createElementNS(NS, "g");
  g.setAttribute("transform", `translate(${CX} ${CY}) rotate(${angle})`);

  /* inner <g>: the element we scale. Path is drawn from (0,0) base,
     so transform-origin 0 0 = petal base = correct pivot. */
  const scaler = document.createElementNS(NS, "g");
  scaler.setAttribute("class", "petal");

  const use = document.createElementNS(NS, "use");
  use.setAttribute("href", "#petalShape");
  use.setAttribute("fill", cfg.grad);
  use.setAttribute("filter", "url(#softShadow)");

  scaler.appendChild(use);
  g.appendChild(scaler);
  petalsGroup.appendChild(g);

  scaler.style.opacity = "0";
  scaler.style.transform = `scale(${cfg.len * 0.25})`;
  return { el: scaler, cfg, delay };
}

function resetState(){
  petalsGroup.innerHTML = "";
  coreGroup.style.transition = "none";
  coreGroup.style.opacity = "0";
  stemEl.style.transition = "none";
  stemEl.style.transform = "scaleY(0)";
  leaves.forEach(lf => {
    lf.style.transition = "none";
    lf.style.transitionDelay = "0s";
    lf.style.opacity = "0";
  });
}

function buildFlower(){
  resetState();
  const items = [];

  for(let i = 0; i < OUTER.count; i++){
    items.push(makePetal(OUTER, i, 0.10 + i * 0.07));
  }
  for(let i = 0; i < INNER.count; i++){
    items.push(makePetal(INNER, i, 0.55 + i * 0.07));
  }

  if(reduceMotion){
    items.forEach(it => {
      it.el.style.opacity = "1";
      it.el.style.transform = `scale(${it.cfg.len})`;
    });
    stemEl.style.transform = "scaleY(1)";
    leaves.forEach(lf => lf.style.opacity = "1");
    coreGroup.style.opacity = "1";
    return;
  }

  /* stem grows first */
  requestAnimationFrame(() => {
    stemEl.style.transition = "transform .9s ease-out";
    stemEl.style.transform = "scaleY(1)";
    leaves.forEach((lf, i) => {
      lf.style.transition = "opacity .5s ease-out";
      lf.style.transitionDelay = (0.6 + i * 0.15) + "s";
      lf.style.opacity = "1";
    });
  });

  /* petals bloom one by one */
  requestAnimationFrame(() => {
    items.forEach(it => {
      it.el.style.transition = "opacity .5s ease-out, transform .9s cubic-bezier(.22,1,.36,1)";
      it.el.style.transitionDelay = it.delay + "s";
      it.el.style.opacity = "1";
      it.el.style.transform = `scale(${it.cfg.len})`;
    });
  });

  /* core last */
  setTimeout(() => {
    coreGroup.style.transition = "opacity .5s ease-out";
    coreGroup.style.opacity = "1";
  }, (0.85 + INNER.count * 0.07) * 1000);
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
    requestAnimationFrame(() => again.focus());
  }, 2600);
}

function replay(){
  popup.classList.add("hidden");
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
