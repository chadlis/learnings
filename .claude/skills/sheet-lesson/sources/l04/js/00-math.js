/* ===== outils numériques communs à la leçon ===== */
const LG=(function(){const g=7,c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  function lg(x){if(x<0.5)return Math.log(Math.PI/Math.sin(Math.PI*x))-lg(1-x);x-=1;let a=c[0];const t=x+g+0.5;for(let i=1;i<g+2;i++)a+=c[i]/(x+i);return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(a);}
  return lg;})();
function binpmf(n,p,k){if(k<0||k>n)return 0;if(p<=0)return k===0?1:0;if(p>=1)return k===n?1:0;return Math.exp(LG(n+1)-LG(k+1)-LG(n-k+1)+k*Math.log(p)+(n-k)*Math.log(1-p));}
/* erfc à erreur relative < 1,2e-7 (Chebyshev) : assez pour quatre décimales */
function erfc(x){const z=Math.abs(x),t=1/(1+0.5*z);const r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277)))))))));return x>=0?r:2-r;}
/* nombre à d décimales, zéros gardés, virgule et vrai signe moins */
const fx=(x,d)=>(x<0&&Math.abs(x)>=0.5*Math.pow(10,-d)?'−':'')+Math.abs(x).toFixed(d).replace('.',',');
const Phi=z=>0.5*erfc(-z/Math.SQRT2);
const phi=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
const npdf=(x,m,s)=>phi((x-m)/s)/s;
/* aire sous f entre a et b, dans la couche dynamique */
function areaUnder(P,f,a,b,cls){if(b<=a)return null;let s='';const n=160;for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;s+=P.sx(x).toFixed(1)+','+P.sy(f(x)).toFixed(1)+' ';}
  s+=P.sx(b).toFixed(1)+','+P.sy(0).toFixed(1)+' '+P.sx(a).toFixed(1)+','+P.sy(0).toFixed(1);return SL.el('polygon',{points:s.trim(),class:cls},P.dyn);}
function xticks(a,b,m){const step=Math.max(1,Math.ceil((b-a)/m));const t=[];for(let k=Math.ceil(a);k<=b;k+=step)t.push(k);return t;}
function yticks(ym){const raw=ym/4,e=Math.pow(10,Math.floor(Math.log10(raw)));const step=[1,2,2.5,5,10].map(f=>f*e).find(s=>s>=raw)||e*10;const t=[0];for(let y=step;y<ym*0.98;y+=step)t.push(+y.toPrecision(6));return t;}
