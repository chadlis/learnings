/* ===== l06 : outils propres à la leçon ===== */
/* erf (Abramowitz et Stegun 7.1.26, erreur < 1,5e-7), Φ et φ de la normale centrée réduite */
function erf(x){const s=x<0?-1:1;x=Math.abs(x);const t=1/(1+0.3275911*x);return s*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x));}
const Phi=z=>z===-Infinity?0:z===Infinity?1:0.5*(1+erf(z/Math.SQRT2));
const phi=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
/* aire sous f entre a et b, écrêtée à ymax (une densité peut être infinie) */
function area(P,f,a,b,cls,ymax,parent){if(!(b>a))return null;const n=160;let d='M'+P.sx(a).toFixed(1)+' '+P.sy(0).toFixed(1);
  for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;let y=f(x);if(!isFinite(y))y=ymax;y=Math.max(-ymax,Math.min(y,ymax));d+=' L'+P.sx(x).toFixed(1)+' '+P.sy(y).toFixed(1);}
  d+=' L'+P.sx(b).toFixed(1)+' '+P.sy(0).toFixed(1)+' Z';return SL.el('path',{d:d,class:cls},parent||P.dyn);}
/* courbe tracée sur une liste de points [x, y] déjà calculés (sauts et écrêtage compris) */
function pathXY(P,pts,cls,parent){let d='';pts.forEach(p=>{d+=(d?' L':'M')+P.sx(p[0]).toFixed(1)+' '+P.sy(p[1]).toFixed(1);});return SL.el('path',{d:d,class:'sl-fn '+cls,fill:'none'},parent||P.dyn);}
/* aire sous une liste de points [x, y] (même tracé que pathXY, sauts compris) */
function fillXY(P,pts,cls,parent){if(!pts.length)return null;let d='M'+P.sx(pts[0][0]).toFixed(1)+' '+P.sy(0).toFixed(1);pts.forEach(p=>{d+=' L'+P.sx(p[0]).toFixed(1)+' '+P.sy(p[1]).toFixed(1);});d+=' L'+P.sx(pts[pts.length-1][0]).toFixed(1)+' '+P.sy(0).toFixed(1)+' Z';return SL.el('path',{d:d,class:cls},parent||P.dyn);}
/* SL.fmt avec le vrai signe moins */
const mf=(x,d)=>SL.fmt(x,d).replace('-','−');
