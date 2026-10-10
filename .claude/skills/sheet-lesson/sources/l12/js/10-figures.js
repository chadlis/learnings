/* ===== outils propres à l12 ===== */
/* courbe coupée aux bords [y0, y1] au lieu d'être écrasée contre eux */
function ccurve(P,f,a,b,cls,y0,y1,n){n=n||300;let d='',prev=null;
  const edge=(p,q)=>{if(!isFinite(q.y))return [p.x,y1];const yb=q.y>y1?y1:y0;return [p.x+(q.x-p.x)*(yb-p.y)/(q.y-p.y),yb];};
  const pt=(x,y)=>P.sx(x).toFixed(1)+' '+P.sy(y).toFixed(1);
  for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x),cur={x:x,y:y,ok:isFinite(y)&&y>=y0&&y<=y1};
    if(cur.ok){if(prev&&prev.ok)d+=' L'+pt(x,y);else if(prev&&isFinite(prev.y)){const e=edge(cur,prev);d+=' M'+pt(e[0],e[1])+' L'+pt(x,y);}else d+=' M'+pt(x,y);}
    else if(prev&&prev.ok){const e=edge(prev,cur);d+=' L'+pt(e[0],e[1]);}
    prev=cur;}
  if(d)SL.el('path',{d:d.trim(),class:'sl-fn '+cls,fill:'none'},P.dyn);}
/* aire sous une courbe positive, fermée sur l'axe y = 0 */
function area(P,f,a,b,cls,ymax,n){n=n||240;let d='M'+P.sx(a).toFixed(1)+' '+P.sy(0).toFixed(1);
  for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;d+=' L'+P.sx(x).toFixed(1)+' '+P.sy(Math.min(f(x),ymax)).toFixed(1);}
  d+=' L'+P.sx(b).toFixed(1)+' '+P.sy(0).toFixed(1)+' Z';return SL.el('path',{d:d,class:cls},P.dyn);}
/* Φ par Abramowitz et Stegun 7.1.26 (erreur < 2·10⁻⁷) */
function Phi(z){const s=z<0?-1:1,x=Math.abs(z)/Math.SQRT2,k=1/(1+0.3275911*x);
  const y=1-(((((1.061405429*k-1.453152027)*k)+1.421413741)*k-0.284496736)*k+0.254829592)*k*Math.exp(-x*x);return 0.5*(1+s*y);}
const phi=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
const fmtInf=(v,d)=>isFinite(v)?SL.fmt(v,d):'∞';
const fmtS=(v,d)=>SL.fmt(v,d).replace(/^-/,'−'); /* vrai signe moins */
/* le modèle des tailles déclarées (notion 4), en pouces */
const HT={mu:69,sd:3,a:70.5,b:72};
HT.F=x=>Phi((x-HT.mu)/HT.sd);HT.f=x=>phi((x-HT.mu)/HT.sd)/HT.sd;HT.zone=HT.F(HT.b)-HT.F(HT.a);
/* masse continue des déclarations dans [lo, hi), quand une part q de la zone part à 72 */
HT.cont=(lo,hi,q)=>{let s=0;[[-1e9,HT.a,1],[HT.a,HT.b,1-q],[HT.b,1e9,1]].forEach(([u,v,c])=>{const L=Math.max(lo,u),H=Math.min(hi,v);if(H>L)s+=c*(HT.F(H)-HT.F(L));});return s;};

/* ===== Figure 1 : quatre lois de moyenne 0 et de variance 1 ===== */
(function(){
  const L=[{n:'±1, cosh t',f:t=>Math.cosh(t),c:'sl-c1'},{n:'−√2, 0, √2',f:t=>0.5+0.5*Math.cosh(Math.SQRT2*t),c:'sl-c2'},
           {n:'N(0, 1), e^(t²/2)',f:t=>Math.exp(t*t/2),c:'sl-c3'},{n:'Exp(1) − 1',f:t=>t<1?Math.exp(-t)/(1-t):Infinity,c:'sl-c5'}];
  const P=SL.plot(document.getElementById('f1plot'),{x:[-1.6,1.6],y:[0.8,3.3],w:560,h:290,xt:[-1.5,-1,-0.5,0,0.5,1,1.5],yt:[1,1.5,2,2.5,3],xl:'t'});
  const out=document.getElementById('f1out');
  function draw(t){
    P.clear();
    ccurve(P,u=>1+u*u/2,-1.6,1.6,'sl-c4 sl-dash',0.8,3.3);
    L.forEach(l=>ccurve(P,l.f,-1.6,1.6,l.c+' thin',0.8,3.3,400));
    P.vline(t,'sl-dash');
    L.forEach(l=>{const v=l.f(t);if(isFinite(v)&&v<=3.3)P.dot(t,v,l.c,4);});
    L.forEach((l,i)=>P.text(-1.05,3.15-0.2*i,'— '+l.n,l.c,'start'));
    P.text(-1.05,3.15-0.8,'-- 1 + t²/2','sl-c4','start');
    rd(out,L.map(l=>[l.n,fmtInf(l.f(t),3),l.c==='sl-c3'?'c3':'']).concat([['parabole 1 + t²/2',SL.fmt(1+t*t/2,3)]]));
  }
  SL.slider(document.getElementById('f1ctl'),{label:'t',min:-1.5,max:1.5,step:0.05,value:0.25,fmt:v=>SL.fmt(v,2)},draw);
})();

/* ===== Figure 2 : densité avec masse, fonction de répartition avec saut ===== */
(function(){
  const host=document.getElementById('f2plot'),out=document.getElementById('f2out');
  const P1=SL.plot(SL.h('div','',host),{x:[60,78],y:[0,0.165],w:560,h:210,xt:[60,63,66,69,72,75,78],yt:[0,0.05,0.1,0.15]});
  const P2=SL.plot(SL.h('div','',host),{x:[60,78],y:[0,1.05],w:560,h:230,xt:[60,63,66,69,72,75,78],yt:[0,0.25,0.5,0.75,1],xl:'taille déclarée, pouces (72 = 6 pieds = 183 cm)'});
  function draw(q){
    P1.clear();P2.clear();
    const m=q*HT.zone;
    ccurve(P1,HT.f,60,78,'sl-c4 sl-dash',0,0.165);
    area(P1,x=>(x>=HT.a&&x<HT.b?1-q:1)*HT.f(x),60,78,'sl-area',0.165,1800);
    if(m>0.0005){P1.arrow(72,0,72,0.155,'sl-c3');P1.text(72.4,0.148,'masse '+SL.fmt(100*m,1)+'\u00a0% en 72','sl-c3','start');}
    P1.text(60.3,0.15,'-- densité des tailles vraies','sl-c4','start');P1.text(60.3,0.13,'▮ déclarées, partie continue','sl-c2','start');
    const Fm=HT.F(HT.a)+(1-q)*HT.zone,Fb=HT.F(HT.b);
    ccurve(P2,x=>HT.F(x),60,78,'sl-c4 sl-dash thin',0,1.05);
    ccurve(P2,x=>x<HT.a?HT.F(x):HT.F(HT.a)+(1-q)*(HT.F(x)-HT.F(HT.a)),60,HT.b-1e-6,'sl-c1',0,1.05,300);
    ccurve(P2,x=>HT.F(x),HT.b,78,'sl-c1',0,1.05,120);
    if(m>0.0005){P2.seg(72,Fm,72,Fb,'sl-c3 sl-dash');P2.dot(72,Fm,'hollow sl-c1',4.5);}
    P2.dot(72,Fb,'sl-c1',4.5);
    P2.text(60.3,0.93,'— F, tailles déclarées','sl-c1','start');P2.text(60.3,0.81,'-- F, tailles vraies','sl-c4','start');
    if(m>0.0005)P2.text(72.4,(Fm+Fb)/2-0.02,'saut '+SL.fmt(m,3),'sl-c3','start');
    rd(out,[['masse en 72 = saut de F',SL.fmt(100*m,1)+'\u202f%','c3'],['F(72⁻), juste avant',SL.fmt(Fm,3)],['F(72)',SL.fmt(Fb,3)],['densité en 72',m>0.0005?'aucune':SL.fmt(HT.f(72),3)]]);
  }
  SL.slider(document.getElementById('f2ctl'),{label:'part arrondie',min:0,max:1,step:0.05,value:0.5,fmt:v=>SL.fmt(v,2)},draw);
})();

/* ===== Figure 3 : l'escalier de Z_n contre Φ ===== */
(function(){
  const N=[1,2,4,10,25,100,400],out=document.getElementById('f3out');
  const P=SL.plot(document.getElementById('f3plot'),{x:[-3.5,3.5],y:[0,1.05],w:560,h:270,xt:[-3,-2,-1,0,1,2,3],yt:[0,0.25,0.5,0.75,1],xl:'x'});
  leftAxis(P,-3.5);
  function draw(i){
    P.clear();const n=N[i],sq=Math.sqrt(n);
    const p=[Math.pow(2,-n)];for(let k=0;k<n;k++)p.push(p[k]*(n-k)/(k+1));
    let F=0,d='',best={g:-1},Fprev=0;const z0=-3.5;
    for(let k=0;k<=n;k++){const z=(2*k-n)/sq;Fprev=F;F+=p[k];const Pz=Phi(z);
      [Math.abs(F-Pz),Math.abs(Fprev-Pz)].forEach((g,j)=>{if(g>best.g)best={g:g,z:z,a:j?Fprev:F,b:Pz};});
      if(z<z0||z>3.5)continue;
      if(!d)d='M'+P.sx(z0).toFixed(1)+' '+P.sy(Fprev).toFixed(1);
      d+=' L'+P.sx(z).toFixed(1)+' '+P.sy(Fprev).toFixed(1)+' L'+P.sx(z).toFixed(1)+' '+P.sy(F).toFixed(1);}
    d+=' L'+P.sx(3.5).toFixed(1)+' '+P.sy(F).toFixed(1);
    curve(P,Phi,-3.5,3.5,'sl-c3',1.05);
    SL.el('path',{d:d,class:'sl-fn sl-c4 thin',fill:'none'},P.dyn);
    P.seg(best.z,best.a,best.z,best.b,'sl-c5');
    P.text(-3.4,0.95,'— Φ, la limite','sl-c3','start');P.text(-3.4,0.84,'— P(Zₙ ≤ x), Zₙ = Sₙ/√n, n pièces ±1','sl-c4','start');P.text(-3.4,0.73,'│ plus grand écart','sl-c5','start');
    rd(out,[['n',String(n)],['valeurs possibles de Zₙ',String(n+1)],['plus grand écart à Φ',best.g.toFixed(3).replace('.',','),'c3'],['0,4/√n, pour comparer',(0.3989/sq).toFixed(3).replace('.',',')]]);
  }
  SL.slider(document.getElementById('f3ctl'),{label:'n pièces',min:0,max:N.length-1,step:1,value:0,fmt:v=>String(N[v])},draw);
})();
