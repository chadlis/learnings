/* ===== outils numériques propres à l05 (en partie portés de p00-01) ===== */
const LG=(function(){const g=7,c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  function lg(x){if(x<0.5)return Math.log(Math.PI/Math.sin(Math.PI*x))-lg(1-x);x-=1;let a=c[0];const t=x+g+0.5;for(let i=1;i<g+2;i++)a+=c[i]/(x+i);return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(a);}
  return lg;})();
const lchoose=(n,k)=>LG(n+1)-LG(k+1)-LG(n-k+1);
function binpmf(n,p,k){if(k<0||k>n)return 0;if(p<=0)return k===0?1:0;if(p>=1)return k===n?1:0;return Math.exp(lchoose(n,k)+k*Math.log(p)+(n-k)*Math.log(1-p));}
function poispmf(lam,k){if(k<0)return 0;if(lam<=0)return k===0?1:0;return Math.exp(-lam+k*Math.log(lam)-LG(k+1));}
function gammapdf(r,lam,t){if(t<0)return 0;if(t===0)return r===1?lam:0;return Math.exp(r*Math.log(lam)+(r-1)*Math.log(t)-lam*t-LG(r));}
function erfc(x){const z=Math.abs(x),t=1/(1+0.5*z);const r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277)))))))));return x>=0?r:2-r;}
const Phi=x=>0.5*erfc(-x/Math.SQRT2);
const npdf=(x,m,s)=>Math.exp(-(x-m)*(x-m)/(2*s*s))/(s*Math.sqrt(2*Math.PI));
function expo(r,lam){return -Math.log(1-r())/lam;}
function xticks(a,b,m){const step=Math.max(1,Math.ceil((b-a)/m));const t=[];for(let k=a;k<=b;k+=step)t.push(k);return t;}
function yticks(ym){const raw=ym/4,e=Math.pow(10,Math.floor(Math.log10(raw)));const step=[1,2,2.5,5,10].map(f=>f*e).find(s=>s>=raw)||e*10;const t=[];for(let y=step;y<ym*0.98;y+=step)t.push(+y.toPrecision(6));return t;}
/* polyline et aire remplie dans la couche dynamique */
function poly(P,pts,cls){let s='';pts.forEach(q=>{s+=P.sx(q[0]).toFixed(1)+','+P.sy(q[1]).toFixed(1)+' ';});return SL.el('polyline',{points:s.trim(),class:cls,fill:'none'},P.dyn);}
function area(P,f,a,b,y0,cls){let s='';const n=140;for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;s+=P.sx(x).toFixed(1)+','+P.sy(f(x)).toFixed(1)+' ';}
  s+=P.sx(b).toFixed(1)+','+P.sy(y0).toFixed(1)+' '+P.sx(a).toFixed(1)+','+P.sy(y0).toFixed(1);
  return SL.el('polygon',{points:s.trim(),class:cls},P.dyn);}
/* courbe qui sort par le haut au lieu de s'écraser contre le bord */
function curveS(P,f,a,b,cls,ymax){let d='',on=false;const n=300;for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x);if(!isFinite(y)||y>ymax){if(on){d+=' L'+P.sx(x).toFixed(1)+' '+P.sy(ymax).toFixed(1);}on=false;continue;}d+=(on?' L':(d?' M':'M'))+P.sx(x).toFixed(1)+' '+P.sy(y).toFixed(1);on=true;}SL.el('path',{d:d,class:'sl-fn '+cls,fill:'none'},P.dyn);}
function sample(f,a,b,n){const t=[];for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;t.push([x,f(x)]);}return t;}
/* histogramme en densité : valeurs → barres de largeur bw sur [x0, x1] */
function histo(P,vals,x0,x1,bw,cls,ymax,scale){const k=Math.round((x1-x0)/bw),c=new Array(k).fill(0),sc=scale||1;vals.forEach(v=>{const i=Math.floor((v-x0)/bw);if(i>=0&&i<k)c[i]++;});
  const n=Math.max(1,vals.length);c.forEach((m,i)=>{if(m)bar(P,x0+i*bw+bw*0.06,x0+(i+1)*bw-bw*0.06,Math.min(ymax,sc*m/(n*bw)),cls);});}
/* nombre à décimales fixes, virgule (SL.fmt retire les zéros finaux) */
const fx=(x,d)=>x.toFixed(d).replace('.',',');
