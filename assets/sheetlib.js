/* sheetlib.js — primitives d'animation pour les sheets (chains, walkthroughs, bridges, coding).
   Zéro dépendance. Tout ce qui est dessiné porte une classe (jamais de fill inline) : le thème gère les couleurs.
   API : SL.fmt, SL.reduced, SL.plot, SL.slider, SL.repeat, SL.descent, SL.trace, SL.plane, SL.stepper */
(function(){
const SL={};
const NS='http://www.w3.org/2000/svg';
SL.reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
SL.fmt=function(x,d){ if(d===undefined){const a=Math.abs(x);d=a>=100?0:a>=10?1:a>=1?2:3;} let s=Number(x).toFixed(d); if(s.indexOf('.')>=0)s=s.replace(/0+$/,'').replace(/\.$/,''); return s.replace('.',',').replace(/^-0$/,'0'); };
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs||{})e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
function h(tag,cls,parent,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;if(parent)parent.appendChild(e);return e;}
SL.el=el; SL.h=h;

/* ---------- plot : fonctions, points, marques, cordes ---------- */
SL.plot=function(host,o){
  const W=o.w||560,H=o.h||300,m={l:44,r:14,t:16,b:34};
  const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,class:'sl-plot'},host);
  const x0=o.x[0],x1=o.x[1],y0=o.y[0],y1=o.y[1];
  const sx=x=>m.l+(x-x0)/(x1-x0)*(W-m.l-m.r), sy=y=>H-m.b-(y-y0)/(y1-y0)*(H-m.t-m.b);
  const g=el('g',{class:'sl-grid'},svg);
  (o.xt||[]).forEach(t=>{el('line',{x1:sx(t),x2:sx(t),y1:m.t,y2:H-m.b},g);el('text',{x:sx(t),y:H-m.b+16,'text-anchor':'middle',class:'sl-tick'},svg).textContent=SL.fmt(t);});
  (o.yt||[]).forEach(t=>{el('line',{x1:m.l,x2:W-m.r,y1:sy(t),y2:sy(t)},g);el('text',{x:m.l-6,y:sy(t)+4,'text-anchor':'end',class:'sl-tick'},svg).textContent=SL.fmt(t);});
  el('line',{x1:m.l,x2:W-m.r,y1:sy(Math.max(y0,0)),y2:sy(Math.max(y0,0)),class:'sl-axis'},svg);
  el('line',{x1:sx(Math.max(x0,0)),x2:sx(Math.max(x0,0)),y1:m.t,y2:H-m.b,class:'sl-axis'},svg);
  if(o.xl)el('text',{x:W-m.r,y:H-6,'text-anchor':'end',class:'sl-lbl'},svg).textContent=o.xl;
  if(o.yl)el('text',{x:m.l+4,y:m.t+10,class:'sl-lbl'},svg).textContent=o.yl;
  if(!document.getElementById('sl-ah')){const defs=el('defs',{},svg);const mk=el('marker',{id:'sl-ah',viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'},defs);el('path',{d:'M0 0 L10 5 L0 10 z',class:'sl-ahead'},mk);}
  const layer=el('g',{},svg), dyn=el('g',{},svg);
  const P={svg,sx,sy,layer,dyn,W,H};
  P.fn=function(f,cls,n){n=n||160;let d='';for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n;const y=f(x);if(!isFinite(y))continue;const yy=Math.min(Math.max(y,y0-(y1-y0)),y1+(y1-y0));d+=(d?' L':'M')+sx(x).toFixed(1)+' '+sy(yy).toFixed(1);}return el('path',{d,class:'sl-fn '+(cls||''),fill:'none'},layer);};
  P.label=function(x,y,t,cls,anchor){const e=el('text',{x:sx(x),y:sy(y),class:'sl-lbl '+(cls||''),'text-anchor':anchor||'start'},layer);e.textContent=t;return e;};
  P.clear=function(){while(dyn.firstChild)dyn.removeChild(dyn.firstChild);};
  P.dot=function(x,y,cls,r){return el('circle',{cx:sx(x),cy:sy(y),r:r||5,class:'sl-dot '+(cls||'')},dyn);};
  P.seg=function(xa,ya,xb,yb,cls){return el('line',{x1:sx(xa),y1:sy(ya),x2:sx(xb),y2:sy(yb),class:'sl-seg '+(cls||'')},dyn);};
  P.vline=function(x,cls){return el('line',{x1:sx(x),x2:sx(x),y1:m.t,y2:H-m.b,class:'sl-seg '+(cls||'')},dyn);};
  P.text=function(x,y,t,cls,anchor){const e=el('text',{x:sx(x),y:sy(y),class:'sl-lbl '+(cls||''),'text-anchor':anchor||'start'},dyn);e.textContent=t;return e;};
  P.arrow=function(xa,ya,xb,yb,cls){return el('line',{x1:sx(xa),y1:sy(ya),x2:sx(xb),y2:sy(yb),class:'sl-seg sl-arrow '+(cls||''),'marker-end':'url(#sl-ah)'},dyn);};
  (o.fns||[]).forEach(f=>{P.fn(f.f,f.cls);if(f.label)P.label(f.at?f.at[0]:x1,f.at?f.at[1]:f.f(x1),f.label,f.cls,'end');});
  return P;
};

/* ---------- slider : paramètre → callback ---------- */
SL.slider=function(host,o,cb){
  const wrap=h('label','sl-slider',host);
  h('span','sl-slab',wrap,o.label||'');
  const inp=h('input','',wrap);inp.type='range';inp.min=o.min;inp.max=o.max;inp.step=o.step||'any';inp.value=o.value;
  const val=h('output','sl-sval',wrap,'');
  const fmt=o.fmt||(v=>SL.fmt(v));
  function fire(){const v=parseFloat(inp.value);val.textContent=fmt(v);cb(v);}
  inp.addEventListener('input',fire);fire();
  return {get:()=>parseFloat(inp.value),set:v=>{inp.value=v;fire();},input:inp};
};

/* ---------- repeat : tirages répétés → histogramme (l'objet aléatoire) ---------- */
SL.repeat=function(host,o){
  // o.draw() renvoie une statistique ; o.bins=[min,max,k] ; o.marks=[{x,label,cls}] ; o.counts=[1,50,500]
  const ctl=h('div','sl-ctl',host);
  const stats=[];
  const P=SL.plot(h('div','',host),{x:[o.bins[0],o.bins[1]],y:[0,1],w:o.w||560,h:o.h||240,xt:o.xt||[],xl:o.xl||'',yl:o.yl||'fréquence'});
  const out=h('p','sl-readout',host,'');
  const k=o.bins[2],bw=(o.bins[1]-o.bins[0])/k;
  function render(){
    const c=new Array(k).fill(0);stats.forEach(s=>{const i=Math.min(k-1,Math.max(0,Math.floor((s-o.bins[0])/bw)));c[i]++;});
    const mx=Math.max(1,...c);P.clear();
    c.forEach((n,i)=>{if(!n)return;const x=o.bins[0]+i*bw;el('rect',{x:P.sx(x)+1,y:P.sy(n/mx),width:Math.max(1,P.sx(x+bw)-P.sx(x)-2),height:P.sy(0)-P.sy(n/mx),class:'sl-bar'},P.dyn);});
    (o.marks||[]).forEach(mk=>{P.vline(mk.x,mk.cls||'');P.text(mk.x,0.97,mk.label,mk.cls||'','middle');});
    if(stats.length){const mean=stats.reduce((a,b)=>a+b,0)/stats.length;const sd=Math.sqrt(stats.reduce((a,b)=>a+(b-mean)**2,0)/Math.max(1,stats.length-1));P.vline(mean,'sl-mean');out.textContent=(o.readout||((n,m,s)=>`${n} tirages · moyenne ${SL.fmt(m)} · écart-type ${SL.fmt(s)}`))(stats.length,mean,sd);}
    else out.textContent=o.empty||'Aucun tirage encore.';
  }
  (o.counts||[1,50,500]).forEach(n=>{const b=h('button','tb',ctl,`tirer ${n}`);b.onclick=()=>{let i=0;const step=()=>{const batch=SL.reduced?n:Math.max(1,Math.ceil(n/25));for(let j=0;j<batch&&i<n;j++,i++)stats.push(o.draw());render();if(i<n)requestAnimationFrame(step);};step();};});
  const r=h('button','tb',ctl,'effacer');r.onclick=()=>{stats.length=0;render();};
  render();return {stats,render,plot:P};
};

/* ---------- descent : descente de gradient 1D sur f, pas visibles ---------- */
SL.descent=function(host,o){
  const P=SL.plot(h('div','',host),{x:o.x,y:o.y,w:o.w||560,h:o.h||260,xt:o.xt||[],yt:o.yt||[],xl:o.xl||'θ',yl:o.yl||'L(θ)'});
  P.fn(o.f,o.cls||'sl-c1');
  const out=h('p','sl-readout',host,'');
  function run(lr,steps,x0){P.clear();let x=x0,prev=null;for(let i=0;i<=steps;i++){const y=o.f(x);if(prev)P.seg(prev[0],prev[1],x,y,'sl-path');P.dot(x,y,i===steps?'sl-c3':'sl-c2',i===steps?6:4);prev=[x,y];const g=o.df(x);x=x-lr*g;if(!isFinite(x)||Math.abs(x)>1e6){out.textContent='divergence : le pas dépasse la largeur du bol';return;}}out.textContent=`après ${steps} pas : θ = ${SL.fmt(prev[0],3)}, L = ${SL.fmt(prev[1],4)}`;}
  return {run,plot:P};
};

/* ---------- trace : pointeurs sur un tableau (coding) ---------- */
SL.trace=function(host,o){
  // o.arr, o.frames=[{ptr:{g:0,d:3}, mark:[i,...], win:[g,d], note:'', inv:''}]
  const box=h('div','sl-trace',host);const row=h('div','sl-cells',box);
  const cells=o.arr.map((v,i)=>{const c=h('div','sl-cell',row);h('b','',c,String(v));h('i','',c,String(i));return c;});
  const ptrs=h('div','sl-ptrs',box);const note=h('p','sl-note',box,'');const inv=h('p','sl-inv',box,'');
  const ctl=h('div','sl-ctl',box);let k=0;
  function show(){const f=o.frames[k];cells.forEach((c,i)=>{c.className='sl-cell'+((f.mark||[]).includes(i)?' on':'')+((f.win&&i>=f.win[0]&&i<f.win[1])?' win':'');});
    ptrs.innerHTML='';Object.entries(f.ptr||{}).forEach(([name,i])=>{const p=h('span','sl-ptr',ptrs,name);p.style.setProperty('--i',i);});
    note.textContent=(k+1)+'/'+o.frames.length+' · '+(f.note||'');inv.textContent=f.inv||'';}
  const prev=h('button','tb',ctl,'‹ pas');prev.onclick=()=>{k=Math.max(0,k-1);show();};
  const next=h('button','tb',ctl,'pas ›');next.onclick=()=>{k=Math.min(o.frames.length-1,k+1);show();};
  const play=h('button','tb',ctl,'▶ jouer');play.onclick=()=>{k=0;show();if(SL.reduced){k=o.frames.length-1;show();return;}const t=setInterval(()=>{if(k>=o.frames.length-1){clearInterval(t);return;}k++;show();},o.ms||900);};
  show();return {show,set:i=>{k=i;show();}};
};

/* ---------- plane : plan 2D transformé par une matrice (algèbre) ---------- */
SL.plane=function(host,o){
  const W=o.w||420,H=o.h||420,S=o.scale||40,CX=W/2,CY=H/2;
  const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,class:'sl-plane'},host);
  const root=el('g',{transform:`translate(${CX},${CY}) scale(${S},-${S})`},svg);
  const world=el('g',{class:'sl-world'},root);
  for(let i=-5;i<=5;i++){el('line',{x1:i,x2:i,y1:-5,y2:5,class:'sl-gridl','vector-effect':'non-scaling-stroke'},world);el('line',{y1:i,y2:i,x1:-5,x2:5,class:'sl-gridl','vector-effect':'non-scaling-stroke'},world);}
  el('rect',{x:0,y:0,width:1,height:1,class:'sl-unit','vector-effect':'non-scaling-stroke'},world);
  (o.vectors||[]).forEach(v=>el('line',{x1:0,y1:0,x2:v[0],y2:v[1],class:'sl-vec '+(v[2]||''),'vector-effect':'non-scaling-stroke'},world));
  const fixed=el('g',{class:'sl-fixed'},root);(o.fixed||[]).forEach(v=>el('line',{x1:-5*v[0],y1:-5*v[1],x2:5*v[0],y2:5*v[1],class:'sl-fix '+(v[2]||''),'vector-effect':'non-scaling-stroke'},fixed));
  let cur=[1,0,0,1];
  function apply(M){world.setAttribute('transform',`matrix(${M[0]} ${M[2]} ${M[1]} ${M[3]} 0 0)`);cur=M;}
  function to(M){if(SL.reduced){apply(M);return;}const a=cur.slice(),t0=performance.now();const step=t=>{let u=Math.min(1,(t-t0)/850);u=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;apply(a.map((x,i)=>x+(M[i]-x)*u));if(u<1)requestAnimationFrame(step);};requestAnimationFrame(step);}
  return {to,apply,svg};
};

/* ---------- stepper : révéler une chaîne pas à pas ---------- */
SL.stepper=function(host){
  const steps=[...host.querySelectorAll('.step')];if(!steps.length)return;const ctl=h('div','sl-ctl sl-stepctl',host);
  let k=steps.length;const all=h('button','tb',ctl,'tout montrer');const one=h('button','tb',ctl,'pas à pas');const nxt=h('button','tb',ctl,'suivant ›');
  function show(){steps.forEach((s,i)=>s.classList.toggle('hidden',i>=k));nxt.disabled=k>=steps.length;}
  all.onclick=()=>{k=steps.length;show();};one.onclick=()=>{k=1;show();steps[0].scrollIntoView({block:'start',behavior:SL.reduced?'auto':'smooth'});};nxt.onclick=()=>{k=Math.min(steps.length,k+1);show();steps[k-1].scrollIntoView({block:'nearest',behavior:SL.reduced?'auto':'smooth'});};
  host.parentNode.insertBefore(ctl,host);
  show();
};

window.SL=SL;
})();
