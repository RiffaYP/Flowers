const startBtn = document.getElementById("startBtn");
const overlay = document.getElementById("startOverlay");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const again = document.getElementById("again");

const flower = document.querySelector(".flower");
const flowerWrap = document.getElementById("flowerWrap");
const hearts = document.getElementById("hearts");
const petalContainer = document.getElementById("petalContainer");

const BASE_PETALS = 6;

function bloom(){
    for(let i=0;i<BASE_PETALS;i++){
        const p = document.createElement("div");
        p.classList.add("petal");
        p.style.setProperty("--angle", (i * (360 / BASE_PETALS)) + "deg");
        flower.appendChild(p);
    }
}

function fallingPetals(){
    for(let i=0;i<20;i++){
        const el = document.createElement("div");
        el.className = "petal-fall";
        el.style.left = (Math.random()*100) + "vw";
        const dur = 5 + Math.random()*5;
        el.style.animationDuration = dur + "s";
        petalContainer.appendChild(el);
        setTimeout(()=>el.remove(), dur*1000 + 500);
    }
}

function floatingHearts(){
    for(let i=0;i<6;i++){
        const h = document.createElement("div");
        h.className = "heart";
        h.style.left=(Math.random()*100)+"%";
        h.innerHTML=`❤️`;
        h.style.fontSize = (20 + Math.random()*20)+"px";
        hearts.appendChild(h);
        setTimeout(()=>h.remove(),6500);
    }
}

let started = false;
function startExperience(){
    if(started) return;
    started = true;
    overlay.remove();
    bloom();
    fallingPetals();
    floatingHearts();
    setTimeout(()=> popup.classList.remove("hidden"), 2000);
}

startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    startExperience();
});
overlay.addEventListener("click", startExperience);

closePopup.onclick = () => popup.classList.add("hidden");
again.onclick = () => {
    popup.classList.add("hidden");
    flower.querySelectorAll(".petal").forEach(p => p.remove());
    bloom();
    fallingPetals();
};
