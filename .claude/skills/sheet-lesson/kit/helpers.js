/* ===== commun à toutes les leçons (kit, étalon l08 v2) ===== */
/* thème */
const btn=document.getElementById('themeBtn'),body=document.body;
function apply(w){body.classList.toggle('white',w);btn.textContent=w?'☾ Tableau noir':'☀ Tableau blanc';btn.setAttribute('aria-pressed',String(w));}
apply(!!(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches));
btn.onclick=()=>apply(!body.classList.contains('white'));
/* toc : une entrée par notion, étiquette comprise */
const toc=document.getElementById('toc');
document.querySelectorAll('.notion').forEach((s,i)=>{const li=document.createElement('li');const t=s.querySelector('h3').firstChild.textContent.trim();const k=s.classList.contains('culture')?' · culture':'';li.innerHTML=`<a href="#${s.id}">${i+1}. ${t}${k}</a>`;toc.appendChild(li);});
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){toc.querySelectorAll('li').forEach(l=>l.classList.remove('cur'));const a=toc.querySelector(`a[href="#${e.target.id}"]`);if(a)a.parentNode.classList.add('cur');}});},{rootMargin:'-20% 0px -70% 0px'});
document.querySelectorAll('.notion').forEach(s=>io.observe(s));
/* une ancre #nN ouvre la notion visée ; rien n'est replié par défaut hors des blocs */
/* chaîne verbalisée */
document.querySelectorAll('.verb .a').forEach(a=>a.addEventListener('click',()=>a.classList.remove('hid')));

/* ===== outils de dessin ===== */
function curve(P,f,a,b,cls,ymax){let d='';const n=240;for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;let y=f(x);if(!isFinite(y))continue;y=Math.min(y,ymax);d+=(d?' L':'M')+P.sx(x).toFixed(1)+' '+P.sy(y).toFixed(1);}SL.el('path',{d:d,class:'sl-fn '+cls,fill:'none'},P.dyn);}
function bar(P,x0,x1,y,cls){const a=P.sx(x0),b=P.sx(x1);SL.el('rect',{x:Math.min(a,b),y:P.sy(y),width:Math.max(1.5,Math.abs(b-a)),height:Math.max(0,P.sy(0)-P.sy(y)),class:cls||'sl-bar'},P.dyn);}
/* SL.plot trace l'axe vertical en x = 0 ; quand 0 porte une barre, on le ramène au bord gauche */
function leftAxis(P,x0){const ax=P.svg.querySelectorAll('line.sl-axis');if(ax[1]){ax[1].setAttribute('x1',P.sx(x0));ax[1].setAttribute('x2',P.sx(x0));}}
function rd(host,items){host.innerHTML=items.map(it=>`<div class="${it[2]||''}">${it[0]}<b>${it[1]}</b></div>`).join('');}
function buttons(host,names,cb){const bs=names.map((n,i)=>{const b=SL.h('button','tb',host,n);b.onclick=()=>{bs.forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');cb(i);};return b;});bs[0].onclick();return bs;}


/* ===== v2 : vignettes « voir l'idée », une par notion, juste sous l'idée ===== */
/* tween : animation 0 → 1 lissée ; runner : un jeton par figure, un nouveau clic tue l'animation en cours */
function runner(){let t={dead:true};return ()=>{t.dead=true;t={dead:false};return t;};}
function tween(ms,draw,tk,done){if(SL.reduced){draw(1);if(done)done();return;}const t0=performance.now();const st=t=>{if(tk&&tk.dead)return;let u=Math.min(1,(t-t0)/ms);u=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;draw(u);if(u<1)requestAnimationFrame(st);else if(done)done();};requestAnimationFrame(st);}
function loop(tk,step){if(SL.reduced){let g=0;while(step()!==false&&g++<1e5);return;}const f=()=>{if(tk.dead)return;if(step()!==false)requestAnimationFrame(f);};requestAnimationFrame(f);}
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function pick(r,v,p){let u=r(),a=0;for(let i=0;i<v.length;i++){a+=p[i];if(u<a)return v[i];}return v[v.length-1];}
function gauss(r){let u=0;while(u===0)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r());}
function fulcrum(P,x){const cx=P.sx(x),cy=P.sy(0);SL.el('path',{d:`M${cx.toFixed(1)} ${(cy+1).toFixed(1)} L${(cx-8).toFixed(1)} ${(cy+16).toFixed(1)} L${(cx+8).toFixed(1)} ${(cy+16).toFixed(1)} Z`,class:'sl-fulcrum'},P.dyn);}
function median(a){const s=a.slice().sort((x,y)=>x-y),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;}
function rect(P,x0,x1,y0,y1,cls,parent){const a=P.sx(x0),b=P.sx(x1),c=P.sy(y0),d=P.sy(y1);return SL.el('rect',{x:Math.min(a,b).toFixed(1),y:Math.min(c,d).toFixed(1),width:Math.abs(b-a).toFixed(1),height:Math.abs(d-c).toFixed(1),class:cls},parent||P.dyn);}
/* pile de pastilles : une par individu, regroupées par classe de largeur bw */
function stack(P,vals,bw,r,clsOf,centred){const bins=new Map();vals.forEach((v,i)=>{const b=centred?Math.round(v/bw):Math.floor(v/bw);if(!bins.has(b))bins.set(b,[]);bins.get(b).push(i);});
  const res=[];bins.forEach((ids,b)=>{const c=centred?b*bw:(b+0.5)*bw,cx=P.sx(c);res.push({c:c,ids:ids});ids.forEach((i,j)=>SL.el('circle',{cx:cx.toFixed(1),cy:(P.sy(0)-r-1-j*(2*r+1)).toFixed(1),r:r,class:'sl-dot '+clsOf(i)},P.dyn));});return res;}

