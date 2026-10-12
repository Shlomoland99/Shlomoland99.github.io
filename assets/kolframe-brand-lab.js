(()=>{"use strict";
const root=document.getElementById("kf-lab");if(!root)return;
const canvas=root.querySelector("canvas"),ctx=canvas.getContext("2d"),reduce=matchMedia("(prefers-reduced-motion:reduce)");
const names=["KOL FRAME","קול פריים"];let w=0,h=0,dpr=1,active=0,spin=0,level=70,playing=true,theme=0,mode="orbit",last=0,raf=0;
const palettes=[["#d7b46a","#81aaff","#f7e1ab"],["#6cbbef","#b18bff","#eef7ff"],["#c3cedc","#ecb978","#ffffff"]];
function resize(){dpr=Math.min(devicePixelRatio||1,2);const r=canvas.getBoundingClientRect();w=Math.max(300,r.width);h=Math.max(250,r.height);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
const particles=Array.from({length:180},(_,i)=>({angle:i*2.399,r:Math.sqrt((i+1)/180),speed:.1+Math.random()*.4,size:Math.random()*2+0.5}));
function render(t){raf=requestAnimationFrame(render);if(document.hidden)return;const delta=Math.min(.05,(t-last)/1000||0);last=t;if(playing&&!reduce.matches)spin+=delta*(mode==="warp"?1.4:.25);
ctx.clearRect(0,0,w,h);const col=palettes[theme];const bg=ctx.createRadialGradient(w/2,h/2,5,w/2,h/2,w*.7);bg.addColorStop(0,"#173769");bg.addColorStop(.55,"#0b1532");bg.addColorStop(1,"#020610");ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
const centerX=w/2,centerY=h/2,rad=Math.min(w,h)*.36;
ctx.save();ctx.translate(centerX,centerY);
particles.forEach((p,i)=>{const a=p.angle+spin*p.speed,dist=p.r*rad*(1+(mode==="warp"?Math.sin(spin+i)*.12:0)),z=Math.sin(a*2+spin);ctx.beginPath();ctx.arc(Math.cos(a)*dist,Math.sin(a)*dist*.58,Math.max(.35,p.size*(1+z*.35))*level/70,0,7);ctx.fillStyle=i%3?col[1]:col[0];ctx.globalAlpha=.18+.5*(z+1)/2;ctx.fill()});ctx.globalAlpha=1;
const angle=spin*(mode==="orbit"?1:mode==="bullet"?-.6:.25);
const perspective=.8+.2*Math.cos(angle);
ctx.scale(perspective,1);
const font=Math.min(w/8.2,h/4.5,82);
ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="900 "+font+"px Arial, sans-serif";ctx.direction=active===1?"rtl":"ltr";
const text=names[active],met=ctx.measureText(text),factor=Math.min(1,(w*.82)/met.width);ctx.scale(factor,1);
for(let depth=12;depth>=1;depth--){ctx.fillStyle=depth%2?"#162c60":"#4c5066";ctx.fillText(text,depth*.8,-depth*.65)}
const gold=ctx.createLinearGradient(-met.width/2,-50,met.width/2,50);gold.addColorStop(0,col[0]);gold.addColorStop(.28,"#fff5dc");gold.addColorStop(.55,col[1]);gold.addColorStop(.75,col[2]);gold.addColorStop(1,col[0]);ctx.shadowColor=col[1];ctx.shadowBlur=19*level/70;ctx.fillStyle=gold;ctx.strokeStyle="#fff4d0";ctx.lineWidth=.9;ctx.strokeText(text,0,0);ctx.fillText(text,0,0);ctx.restore();
ctx.fillStyle="#c8d9fc";ctx.font="12px Arial";ctx.textAlign="center";ctx.fillText(active===0?"קול פריים":"KOL FRAME",centerX,h*.87);ctx.fillStyle=col[0];ctx.fillText("KOL FRAME  •  IMMERSIVE BRAND LAB",centerX,h*.94)
}
raf=requestAnimationFrame(render);
function setLang(index){active=index;root.querySelectorAll("[data-lang]").forEach(el=>el.setAttribute("aria-pressed",String(Number(el.dataset.lang)===index)))}
root.querySelectorAll("[data-lang]").forEach(el=>el.addEventListener("click",()=>setLang(Number(el.dataset.lang))));
root.querySelectorAll("[data-mode]").forEach(el=>el.addEventListener("click",()=>{mode=el.dataset.mode;root.querySelectorAll("[data-mode]").forEach(b=>b.setAttribute("aria-pressed",String(b===el)))}));
root.querySelectorAll("[data-theme]").forEach(el=>el.addEventListener("click",()=>{theme=Number(el.dataset.theme)}));
root.querySelector("#kf-intensity").addEventListener("input",e=>level=Number(e.target.value));
root.querySelector("#kf-toggle").addEventListener("click",e=>{playing=!playing;e.target.textContent=playing?"Pause / עצור":"Play / הפעל"});
root.querySelector("#kf-full").addEventListener("click",()=>root.requestFullscreen?.().catch(()=>{}));
window.addEventListener("pagehide",()=>{cancelAnimationFrame(raf);observer.disconnect()},{once:true});
})();