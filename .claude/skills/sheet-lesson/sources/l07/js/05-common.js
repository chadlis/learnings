/* ===== outils propres à l07 ===== */
/* nombres à décimales fixes, virgule et vrai signe moins */
function fx(x,d){const s=Math.abs(x).toFixed(d).replace('.',',');return (x<0&&+s.replace(',','.')!==0?'−':'')+s;}
/* très petit nombre : notation scientifique, 1,7·10⁻⁵ */
function sci(x){if(x>=0.001||x<=0)return fx(x,4);const e=Math.floor(Math.log10(x)),S='⁰¹²³⁴⁵⁶⁷⁸⁹';
  return fx(x/Math.pow(10,e),1)+'·10'+(e<0?'⁻':'')+String(Math.abs(e)).split('').map(d=>S[+d]).join('');}
/* trois chiffres significatifs environ */
function sig(x){return x>=100?fx(x,0):x>=10?fx(x,1):x>=1?fx(x,2):x>=0.01?fx(x,3):sci(x);}
function pc(x,d){return fx(100*x,d===undefined?1:d)+' %';}
const SQ2PI=Math.sqrt(2*Math.PI);
function phi(t){return Math.exp(-t*t/2)/SQ2PI;}
/* Φ par Abramowitz-Stegun 7.1.26 (erreur < 1,5e-7) */
function Phi(t){const z=Math.abs(t)/Math.SQRT2,k=1/(1+0.3275911*z);
  const e=1-(((((1.061405429*k-1.453152027)*k)+1.421413741)*k-0.284496736)*k+0.254829592)*k*Math.exp(-z*z);return t>=0?0.5*(1+e):0.5*(1-e);}
/* 1,5 · 2 · 0,25 : décimales utiles seulement */
function nf(v){return fx(v,2).replace(/,?0+$/,'');}
/* path d'une courbe dans un repère quelconque : pts = [[px,py],…] */
function pathOf(pts){return pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');}

/* nuage carré, avec en option un histogramme marginal en haut (T px) et à droite (R px) */
function jointPanel(host,o){
  const L=o.lim,S=o.size||330,T=o.top||0,R=o.right||0,ml=40,mt=12,gT=T?10:0,gR=R?10:0,mr=12,mb=32;
  const W=ml+S+gR+R+mr,H=mt+T+gT+S+mb,X0=ml,Y0=mt+T+gT;
  const svg=SL.el('svg',{viewBox:`0 0 ${W} ${H}`,class:'sl-plot'},host);
  const sx=x=>X0+(x-L[0])/(L[1]-L[0])*S,sy=y=>Y0+S-(y-L[0])/(L[1]-L[0])*S;
  const g=SL.el('g',{class:'sl-grid'},svg);
  for(let t=Math.ceil(L[0]);t<=L[1];t++){
    SL.el('line',{x1:sx(t),x2:sx(t),y1:Y0,y2:Y0+S},g);SL.el('line',{x1:X0,x2:X0+S,y1:sy(t),y2:sy(t)},g);
    SL.el('text',{x:sx(t),y:Y0+S+16,'text-anchor':'middle',class:'sl-tick'},svg).textContent=SL.fmt(t);
    SL.el('text',{x:X0-6,y:sy(t)+4,'text-anchor':'end',class:'sl-tick'},svg).textContent=SL.fmt(t);}
  SL.el('rect',{x:X0,y:Y0,width:S,height:S,class:'sl-frame'},svg);
  if(o.xl)SL.el('text',{x:X0+S,y:H-4,'text-anchor':'end',class:'sl-lbl'},svg).textContent=o.xl;
  const back=SL.el('g',{},svg),pts=SL.el('g',{},svg),dyn=SL.el('g',{},svg);
  const J={svg,sx,sy,S,T,R,X0,Y0,W,H,back,pts,dyn,L};
  const tb=mt+T,rb=X0+S+gR;            /* base de l'histogramme du haut, bord gauche de celui de droite */
  if(T){SL.el('line',{x1:X0,x2:X0+S,y1:tb,y2:tb,class:'sl-axis'},svg);if(o.tl)SL.el('text',{x:X0+S-2,y:mt+10,'text-anchor':'end',class:'sl-lbl'},svg).textContent=o.tl;}
  if(R){SL.el('line',{x1:rb,x2:rb,y1:Y0,y2:Y0+S,class:'sl-axis'},svg);if(o.rl)SL.el('text',{x:rb+R,y:Y0-3,'text-anchor':'end',class:'sl-lbl'},svg).textContent=o.rl;}
  J.clear=()=>{while(dyn.firstChild)dyn.removeChild(dyn.firstChild);while(back.firstChild)back.removeChild(back.firstChild);};
  J.vband=(a,b,cls)=>SL.el('rect',{x:sx(a).toFixed(1),y:Y0,width:(sx(b)-sx(a)).toFixed(1),height:S,class:cls||'sl-band'},back);
  J.topBar=(a,b,v,vm,cls)=>{const h=Math.min(T,T*v/vm);return SL.el('rect',{x:(sx(a)+0.6).toFixed(1),y:(tb-h).toFixed(1),width:Math.max(0.5,sx(b)-sx(a)-1.2).toFixed(1),height:h.toFixed(1),class:cls||'sl-bar'},dyn);};
  J.rightBar=(a,b,v,vm,cls)=>{const w=Math.min(R,R*v/vm);return SL.el('rect',{x:rb,y:(sy(b)+0.6).toFixed(1),width:w.toFixed(1),height:Math.max(0.5,sy(a)-sy(b)-1.2).toFixed(1),class:cls||'sl-bar'},dyn);};
  J.topCurve=(f,vm,cls)=>{const p=[];for(let i=0;i<=240;i++){const x=L[0]+(L[1]-L[0])*i/240;p.push([sx(x),tb-Math.min(T,T*f(x)/vm)]);}return SL.el('path',{d:pathOf(p),class:'sl-fn '+cls,fill:'none'},dyn);};
  J.rightCurve=(f,vm,cls)=>{const p=[];for(let i=0;i<=240;i++){const y=L[0]+(L[1]-L[0])*i/240;p.push([rb+Math.min(R,R*f(y)/vm),sy(y)]);}return SL.el('path',{d:pathOf(p),class:'sl-fn '+cls,fill:'none'},dyn);};
  return J;
}
