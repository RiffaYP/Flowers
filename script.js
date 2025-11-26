:root{
  --pink1:#ff6b95;
  --pink2:#ff9fc4;
  --pink3:#ffd6e5;
  --bg:#0f1524;
}

body{
  margin:0;
  background:linear-gradient(#09101f, #0f1524);
  height:100vh;
  overflow:hidden;
  font-family:sans-serif;
  color:white;
}

/* Start overlay */
.overlay{
  position:fixed; inset:0;
  background:rgba(0,0,0,0.6);
  display:flex; align-items:center; justify-content:center;
  z-index:50;
}
.startBox{
  background:rgba(255,255,255,0.1);
  padding:22px;
  border-radius:14px;
  text-align:center;
  backdrop-filter:blur(5px);
}
.startBox button{
  padding:10px 18px;
  border:0;
  background:linear-gradient(90deg,#ff8db7,#ff6b95);
  border-radius:8px;
  color:white;
  cursor:pointer;
}

/* Stage */
#stage{
  display:flex; align-items:center; justify-content:center;
  height:100vh;
}

/* 3D FLOWER */
#flower{
  position:relative;
  width:200px; height:200px;
  transform-style:preserve-3d;
  transform:scale(.3) rotateX(70deg);
  opacity:0;
  transition:1.6s ease-out;
}

/* Center */
.center{
  position:absolute;
  left:50%; top:50%;
  transform:translate(-50%,-50%);
  width:40px; height:40px;
  background:radial-gradient(#fff3d0,#ffcc80);
  border-radius:50%;
  z-index:10;
}

/* Petals (auto generated) */
.petal{
  position:absolute;
  left:50%; top:50%;
  width:120px; height:70px;
  border-radius:70% 70% 40% 40%;
  background:linear-gradient(#ffd6e5,#ff8db7);
  transform-origin:0% 100%;
  opacity:0;
  animation:bloomPetal 1.2s forwards ease-out;
}

@keyframes bloomPetal{
  0%{opacity:0; transform:rotateX(75deg) scale(.1);}
  70%{opacity:1; transform:rotateX(25deg) scale(1.1);}
  100%{opacity:1; transform:rotateX(0deg) scale(1);}
}

/* Falling petals */
#petalContainer .fall{
  position:fixed;
  width:18px; height:28px;
  background:linear-gradient(#ffd6e5,#ff8db7);
  border-radius:60% 60% 40% 40%;
  animation:falling linear forwards;
  opacity:.9;
}

@keyframes falling {
  0% { transform:translateY(-10vh) rotate(0deg); opacity:1 }
  100%{ transform:translateY(110vh) rotate(260deg); opacity:0 }
}

/* Popup */
#popup{
  position:fixed; inset:0;
  display:flex; align-items:center; justify-content:center;
  z-index:60;
}
#popup.hidden{ display:none; }

.popup-card{
  background:white;
  color:black;
  padding:20px;
  border-radius:12px;
  width:min(320px,90%);
  text-align:center;
  position:relative;
}
.close{
  position:absolute;
  right:10px; top:10px;
  background:none; border:0;
  font-size:20px;
  cursor:pointer;
}
.primary{
  background:var(--pink1);
  padding:8px 14px;
  border:0;
  margin-top:10px;
  border-radius:8px;
  color:white;
  cursor:pointer;
}
