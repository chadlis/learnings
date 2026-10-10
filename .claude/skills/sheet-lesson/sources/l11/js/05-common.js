/* ===== l11 : lois exactes et outils communs ===== */
const SIGD=Math.sqrt(35/12);                                   /* écart-type d'un dé : 1,708 */
const LF=new Float64Array(5001);for(let k=1;k<=5000;k++)LF[k]=LF[k-1]+Math.log(k);   /* ln k! */
function phiN(z){return Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);}
function PhiN(z){const x=Math.abs(z)/Math.SQRT2,t=1/(1+0.3275911*x);
  const e=1-(((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t)*Math.exp(-x*x);
  return z>=0?0.5*(1+e):0.5*(1-e);}
/* loi exacte de la somme de n dés, par convolution : DICE[n][s] = P(Sₙ = s) */
const DICE=[new Float64Array([1])];
function diceLaw(n){while(DICE.length<=n){const a=DICE[DICE.length-1],b=new Float64Array(a.length+6);
  for(let s=0;s<a.length;s++){const q=a[s]/6;if(q===0)continue;for(let f=1;f<=6;f++)b[s+f]+=q;}DICE.push(b);}return DICE[n];}
function binomLaw(n,p){const a=new Float64Array(n+1),lp=Math.log(p),lq=Math.log(1-p);
  for(let k=0;k<=n;k++)a[k]=Math.exp(LF[n]-LF[k]-LF[n-k]+k*lp+(n-k)*lq);return a;}
/* densité de la moyenne de n Exponentielle(1) : Gamma(n, taux n) */
function gammaMean(x,n){return x<=0?(n===1?1:0):Math.exp(n*Math.log(n)+(n-1)*Math.log(x)-n*x-LF[n-1]);}
/* une loi sur un réseau de pas h, en densité (p/h × sc) : des barres si le pas est large, une ligne sinon */
function lattice(P,xs,ps,h,sc,X,ymax,cls){
  const px=Math.abs(P.sx(h)-P.sx(0));
  if(px>=3.2){for(let i=0;i<xs.length;i++){const a=xs[i]-0.42*h,b=xs[i]+0.42*h;if(ps[i]<1e-9||a<X[0]||b>X[1])continue;bar(P,a,b,Math.min(ps[i]/h*sc,ymax),cls||'sl-bar');}}
  else{let d='';for(let i=0;i<xs.length;i++){if(xs[i]<X[0]||xs[i]>X[1])continue;d+=(d?' L':'M')+P.sx(xs[i]).toFixed(1)+' '+P.sy(Math.min(ps[i]/h*sc,ymax)).toFixed(1);}
    if(d)SL.el('path',{d:d,class:'sl-fn sl-c2',fill:'none'},P.dyn);}
}
/* axe logarithmique : grille et étiquettes posées à la main */
function logTicksX(P,vals,lab,y0,y1){vals.forEach((v,i)=>{const x=P.sx(Math.log10(v));
  SL.el('line',{x1:x.toFixed(1),x2:x.toFixed(1),y1:P.sy(y1).toFixed(1),y2:P.sy(y0).toFixed(1),class:'sl-gridl0'},P.dyn);
  const t=SL.el('text',{x:x.toFixed(1),y:(P.sy(y0)+16).toFixed(1),'text-anchor':'middle',class:'sl-tick'},P.dyn);t.textContent=lab[i];});}
/* nombres à décimales fixes (SL.fmt retire les zéros finaux) */
function fixed(x,d){const s=x.toFixed(d).replace('.',',');return /^-0(,0*)?$/.test(s)?s.slice(1):s;}
function pct(x,d){return fixed(100*x,d===undefined?1:d)+'\u00a0%';}
