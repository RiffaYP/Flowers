"use strict";

const NS = "http://www.w3.org/2000/svg";

const svg         = document.getElementById("flower");
const petalsGroup = document.getElementById("petals");
const coreGroup   = document.getElementById("coreGroup");
const stemEl      = svg.querySelector(".stem");
const leaves      = svg.querySelectorAll(".leaf");

const CX = 200;
const CY = 196;

const OUTER = { count: 8, len: 1.0,  spread: 0.0, grad: "url(#petalGrad)" };
const INNER = { count: 6, len: 0.66, spread: 0.5, grad: "url(#petalGradInner)" };

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function makePetal(cfg, index, delay){
  const step = 360 / cfg.count;
  const angle = index * step + cfg.spread * step;

  const g = document.createElementNS(NS, "g");
  g.setAttribute("transform", `translate(${CX} ${CY}) rotate(${angle})`);

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

  requestAnimationFrame(() => {
    stemEl.style.transition = "transform .9s ease-out";
    stemEl.style.transform = "scaleY(1)";
    leaves.forEach((lf, i) => {
      lf.style.transition = "opacity .5s ease-out";
      lf.style.transitionDelay = (0.6 + i * 0.15) + "s";
      lf.style.opacity = "1";
    });
  });

  requestAnimationFrame(() => {
    items.forEach(it => {
      it.el.style.transition = "opacity .5s ease-out, transform .9s cubic-bezier(.22,1,.36,1)";
      it.el.style.transitionDelay = it.delay + "s";
      it.el.style.opacity = "1";
      it.el.style.transform = `scale(${it.cfg.len})`;
    });
  });

  setTimeout(() => {
    coreGroup.style.transition = "opacity .5s ease-out";
    coreGroup.style.opacity = "1";
  }, (0.85 + INNER.count * 0.07) * 1000);
}

/* Export for effects.js (loaded after) */
window.Flower = { buildFlower, reduceMotion };
