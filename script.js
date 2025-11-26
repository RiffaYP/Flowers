const startBtn = document.getElementById("startBtn");
const overlay = document.getElementById("startOverlay");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const again = document.getElementById("again");

const flower = document.querySelector(".flower");
const flowerWrap = document.getElementById("flowerWrap");
const hearts = document.getElementById("hearts");
const petalContainer = document.getElementById("petalContainer");

function bloom(){
    for(let i=0;i<4;i++){
        const p = document.createElement("div");
        p.classList.add("petal");
        p.style.transform = `translate(-50%,-50%) rotateZ(${120 + i*60}deg)`;
        flower.appendChild(p);
    }
}

function fallingPetals(){
    for(let i=0;i<20;i++){
        const el = document.createElement("div");
        el.className = "petal-fall";
        el.style.left = (Math.random()*100) + "vw";
        el.style.animationDuration = (5 + Math.random()*5) + "s";
        petalContainer.appendChild(el);
        setTimeout(()=>el.remove(),7000);
    }
}

function floatingHearts(){
    for(let i=0;i<6;i++){
        const h = document.createElement("div");
        h.className = "heart";
        h.style.position="absolute";
        h.style.left=(Math.random()*100)+"%";
        h.style.bottom="-10px";
        h.innerHTML=`❤️`;
        h.style.fontSize = (20 + Math.random()*20)+"px";
        h.style.animation = "floatUp 6s linear forwards";
        hearts.appendChild(h);
        setTimeout(()=>h.remove(),7000);
    }
}

startBtn.onclick = () => startExperience();
overlay.onclick = () => startExperience();

function startExperience(){
    overlay.remove();
    bloom();
    fallingPetals();
    floatingHearts();
    setTimeout(()=> popup.classList.remove("hidden"), 2000);
}

closePopup.onclick = () => popup.classList.add("hidden");
again.onclick = () => {
    popup.classList.add("hidden");
    bloom();
    fallingPetals();
};
