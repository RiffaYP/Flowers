// script.js
// klik untuk mulai -> bloom + petal fall + hearts + popup
const startBtn = document.getElementById('startBtn');
const overlay = document.getElementById('startOverlay');
const flowerWrap = document.getElementById('flowerWrap');
const scene = document.getElementById('scene');
const petalContainer = document.getElementById('petalContainer');
const hearts = document.getElementById('hearts');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
const againBtn = document.getElementById('again');

function spawnHearts(count=6){
  for(let i=0;i<count;i++){
    const el = document.createElement('div');
    el.className='heart';
    const size = 18 + Math.random()*28;
    el.style.width = size+'px';
    el.style.height = size+'px';
    const left = Math.random()*100;
    el.style.left = left + '%';
    el.style.bottom = -20 + 'px';
    el.style.animationDuration = 6 + Math.random()*6 + 's';
    el.style.opacity = 0;
    // simple heart SVG
    el.innerHTML = `
      <svg viewBox="0 0 32 29.6" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M23.6 0c-2.9 0-5 1.9-6 3.6C16.4 1.9 14.3 0 11.4 0 5.9 0 1.8 4.9 1.8 10.3c0 7.4 9 13.4 14.9 18.8 5.9-5.3 14.9-11.4 14.9-18.8C30 4.9 25.9 0 23.6 0z" fill="#ff7aa6"/>
      </svg>
    `;
    hearts.appendChild(el);
    // remove after animation
    setTimeout(()=> el.remove(), 12000);
  }
}

function bloomFlower(){
  // add extra petal nodes for better visual
  const flower = document.querySelector('.flower');
  if(!flower.querySelector('.petal')){
    for(let i=0;i<4;i++){
      const p = document.createElement('div');
      p.className='petal';
      p.style.transform = `translate(-50%,-50%) rotateZ(${120 + i*60}deg) translateZ(${i*6}px) rotateX(${8 - i}deg)`;
      flower.appendChild(p);
    }
  }
  flower.classList.add('bloom');
  flowerWrap.classList.add('tilt');
}

function spawnPetals(num=20){
  for(let i=0;i<num;i++){
    const el = document.createElement('div');
    el.className = 'petal-fall';
    // random initial position along top
    const left = Math.random()*100;
    el.style.left = left + 'vw';
    // random size
    const s = 10 + Math.random()*18;
    el.style.width = s + 'px';
    el.style.height = (s*1.3) + 'px';
    // duration and delay
    const dur = 5 + Math.random()*6;
    const delay = Math.random()*2;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = delay + 's';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    petalContainer.appendChild(el);
    // cleanup
    setTimeout(()=> el.remove(), (dur+delay+0.5)*1000);
  }
}

// show popup after a small delay
function showPopup(){
  setTimeout(()=> popup.classList.remove('hidden'), 1400);
}

// main start
function startExperience(){
  overlay.classList.add('hidden');
  overlay.style.display='none';
  // bloom
  bloomFlower();
  // spawn hearts periodically
  spawnHearts(8);
  const heartTimer = setInterval(()=> spawnHearts(4), 2200);
  // petals
  spawnPetals(26);
  const petalTimer = setInterval(()=> spawnPetals(10), 2800);

  // show popup later
  showPopup();

  // stop repeated spawns after a while
  setTimeout(()=> {
    clearInterval(heartTimer);
    clearInterval(petalTimer);
  }, 25000);
}

// popup controls
closePopup?.addEventListener('click', ()=> popup.classList.add('hidden'));
againBtn?.addEventListener('click', ()=> {
  popup.classList.add('hidden');
  // replay small bloom
  bloomFlower();
  spawnPetals(26);
});

// Start button click (also catches any tap)
startBtn.addEventListener('click', startExperience);
overlay.addEventListener('click', (e)=>{
  // if user taps outside button, still start
  if(e.target === overlay) startExperience();
});

// Accessibility: allow Enter on button
startBtn.addEventListener('keyup', (e)=> { if(e.key==='Enter') startExperience() });

// small polish: tilt on mouse move (desktop)
scene.addEventListener('mousemove', (e)=>{
  const rect = scene.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const dx = (e.clientX - cx) / rect.width;
  const dy = (e.clientY - cy) / rect.height;
  flowerWrap.style.transform = `rotateY(${dx*8}deg) rotateX(${dy*-6}deg)`;
});

scene.addEventListener('mouseleave', ()=> flowerWrap.style.transform = '');

function createFlower() {
    const container = document.getElementById("petalContainer");
    const totalPetals = 14;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    container.innerHTML = "";

    for (let i = 0; i < totalPetals; i++) {
        const petal = document.createElement("div");
        petal.classList.add("petal");

        const angle = (360 / totalPetals) * i;
        petal.style.transform = `
            rotate(${angle}deg) 
            translateY(-60px)
            scale(0.2) 
            rotateX(75deg)
        `;

        container.appendChild(petal);
    }
}
