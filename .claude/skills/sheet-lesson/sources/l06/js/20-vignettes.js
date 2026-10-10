/* ===== v1 : étirer une densité, l'aire se garde, la hauteur baisse ===== */
(function(){
  const host=document.getElementById('v1plot'),out=document.getElementById('v1out');
  const P1=SL.plot(SL.h('div','',host),{x:[0,4.2],y:[0,1.3],w:560,h:130,xt:[0,1,2,3,4],yt:[0,1],xl:'x',yl:'densité de X'});
  const P2=SL.plot(SL.h('div','',host),{x:[0,4.2],y:[0,2.25],w:560,h:210,xt:[0,1,2,3,4],yt:[0,0.5,1,1.5,2],xl:'y = ax',yl:'densité de Y'});
  rect(P1,0,1,0,1,'l6-area2',P1.layer);rect(P1,0.2,0.3,0,1,'l6-band',P1.layer);
  P1.label(1.12,0.45,'← la bande [0,2 ; 0,3], probabilité 0,1','','start');
  P2.label(4.15,2.08,'┄ densité recopiée, hauteur 1 : aire a','sl-c3','end');
  P2.label(4.15,1.88,'▮ vraie densité, hauteur 1/a : aire 1','sl-c2','end');
  function draw(a){
    P2.clear();
    rect(P2,0,a,0,1/a,'l6-area');rect(P2,0.2*a,0.3*a,0,1/a,'l6-band');
    rect(P2,0,a,0,1,'l6-copy');
    rd(out,[['étirement a',SL.fmt(a,1)],['aire de la densité recopiée',SL.fmt(a,1),'c3'],['hauteur vraie 1/a',SL.fmt(1/a,3),'c1'],['la bande devient','['+SL.fmt(0.2*a,2)+' ; '+SL.fmt(0.3*a,2)+']'],['sa probabilité','0,1']]);
  }
  SL.slider(document.getElementById('v1ctl'),{label:'étirement a',min:0.5,max:4,step:0.1,value:2,fmt:v=>SL.fmt(v,1)},draw);
})();

/* ===== v2 : °C en °F, puis le miroir 20 − X ===== */
(function(){
  const P=SL.plot(document.getElementById('v2plot'),{x:[-25,100],y:[0,0.092],w:560,h:250,xt:[-20,0,20,40,60,80,100],yt:[0,0.02,0.04,0.06,0.08],xl:'valeur',yl:'densité'});
  leftAxis(P,-25);
  const out=document.getElementById('v2out'),mu=15,s=5,top=0.092;
  const fX=x=>Math.exp(-(((x-mu)/s)**2)/2)/(s*Math.sqrt(2*Math.PI));
  area(P,fX,-25,20,'l6-area2',top,P.layer);P.fn(fX,'l6-gray');
  P.label(98,0.084,'┄ X, en °C ; zone grise : X ≤ 20','','end');P.label(98,0.075,'— Y = aX + b ; zone violette : son image','sl-c2','end');
  const S=[[1.8,32],[-1,20],[1,0]];let cur=[1.8,32];const fresh=runner();
  function draw(a,b){
    P.clear();const t=20*a+b;
    if(Math.abs(a)<1e-3){P.vline(b,'sl-c2');}
    else{const f=y=>fX((y-b)/a)/Math.abs(a);
      if(a>0)area(P,f,-25,Math.min(t,100),'l6-area',top);else area(P,f,Math.max(t,-25),100,'l6-area',top);
      curve(P,f,-25,100,'sl-c2',top);P.seg(t,0,t,Math.min(f(t)+0.012,top),'sl-c2 sl-dash');}
    const ev=Math.abs(a)<1e-3?'Y = '+mf(b,1):(a>0?'Y ≤ ':'Y ≥ ')+mf(t,1);
    rd(out,[['moyenne aμ + b',mf(a*mu+b,1)],['écart-type |a|σ',SL.fmt(Math.abs(a)*s,2)],['pic de densité',Math.abs(a)<0.05?'→ ∞':SL.fmt(fX(mu)/Math.abs(a),4)],['« X ≤ 20 » devient',ev,'c3'],['probabilité',SL.fmt(Phi(1),3)]]);
  }
  buttons(document.getElementById('v2ctl'),['× 1,8 + 32 : °F','20 − X : miroir','Y = X : °C'],k=>{const tk=fresh(),a0=cur.slice(),a1=S[k];
    tween(1100,u=>{cur=[a0[0]+(a1[0]-a0[0])*u,a0[1]+(a1[1]-a0[1])*u];draw(cur[0],cur[1]);},tk);});
})();

/* ===== v3 : deux cloches reliées ===== */
(function(){
  const host=document.getElementById('v3plot'),out=document.getElementById('v3out');
  const PX=SL.plot(SL.h('div','',host),{x:[-5,35],y:[0,0.09],w:560,h:165,xt:[-5,0,5,10,15,20,25,30,35],yt:[0,0.04,0.08],xl:'x, en °C',yl:'densité de X'});
  const PZ=SL.plot(SL.h('div','',host),{x:[-4,4],y:[0,0.45],w:560,h:165,xt:[-4,-3,-2,-1,0,1,2,3,4],yt:[0,0.2,0.4],xl:'z = (x − 15)/5',yl:'densité de Z'});
  leftAxis(PX,-5);leftAxis(PZ,-4);
  const fX=x=>phi((x-15)/5)/5;
  PX.fn(fX,'sl-c1');PZ.fn(phi,'sl-c2');
  const C=[{n:'10 à 20 °C : ±σ',c:10,d:20},{n:'X < 7 °C (Brunton)',c:-Infinity,d:7},{n:'10 à 25 °C',c:10,d:25}];
  const f4=x=>SL.fmt(x,4);
  buttons(document.getElementById('v3ctl'),C.map(c=>c.n),k=>{
    const c=C[k],zc=(c.c-15)/5,zd=(c.d-15)/5,p=Phi(zd)-Phi(zc);
    PX.clear();PZ.clear();
    area(PX,fX,Math.max(c.c,-5),c.d,'l6-area',0.09);area(PZ,phi,Math.max(zc,-4),zd,'l6-area',0.45);
    [c.c,c.d].forEach((x,i)=>{if(isFinite(x)){PX.vline(x,'sl-c3 sl-dash');PX.text(x+(i?0.4:-0.4),0.08,SL.fmt(x,0)+' °C','sl-c3',i?'start':'end');}});
    [zc,zd].forEach((z,i)=>{if(isFinite(z)){PZ.vline(z,'sl-c3 sl-dash');PZ.text(z+(i?0.08:-0.08),0.4,'z = '+mf(z,1),'sl-c3',i?'start':'end');}});
    const inC=isFinite(c.c)?SL.fmt(c.c,0)+' < X < '+SL.fmt(c.d,0):'X < '+SL.fmt(c.d,0);
    const inZ=isFinite(zc)?mf(zc,1)+' < Z < '+mf(zd,1):'Z < '+mf(zd,1);
    const ph=isFinite(zc)?f4(Phi(zd))+' − '+f4(Phi(zc)):'Φ('+mf(zd,1)+') = '+f4(Phi(zd));
    rd(out,[['en °C',inC],['en z',inZ],['avec la table de Φ',ph],['probabilité',SL.fmt(100*p,p<0.1?2:1)+' %','c3']]);
  });
})();

/* ===== v4 : la bande ±√y de X fait la probabilité de Y ≤ y ===== */
(function(){
  const host=document.getElementById('v4plot'),out=document.getElementById('v4out'),T=1.35;
  const PX=SL.plot(SL.h('div','',host),{x:[-3.5,3.5],y:[0,0.46],w:560,h:160,xt:[-3,-2,-1,0,1,2,3],yt:[0,0.2,0.4],xl:'x, densité φ'});
  const PY=SL.plot(SL.h('div','',host),{x:[0,6.5],y:[0,T],w:560,h:190,xt:[0,1,2,3,4,5,6],yt:[0,0.5,1],xl:'y = x²'});
  leftAxis(PX,-3.5);
  const fY=y=>y<=0?Infinity:Math.exp(-y/2)/Math.sqrt(2*Math.PI*y);
  PX.fn(phi,'sl-c1');
  PY.label(0.3,1.2,'← la densité tend vers ∞ en 0','sl-c2','start');PY.label(6.4,1.2,'densité de Y, χ² à 1 degré de liberté','','end');PY.label(3.84,0.16,'3,84','sl-c3','middle');
  SL.el('line',{x1:PY.sx(3.84),x2:PY.sx(3.84),y1:PY.sy(0),y2:PY.sy(0.11),class:'sl-seg sl-c3'},PY.layer);
  function draw(y){
    PX.clear();PY.clear();const r=Math.sqrt(y);
    area(PX,phi,-r,r,'l6-area',0.46);PX.vline(-r,'sl-c3 sl-dash');PX.vline(r,'sl-c3 sl-dash');
    PX.text(r+0.08,0.41,'√y = '+SL.fmt(r,2),'sl-c3','start');PX.text(-r-0.08,0.41,'−√y','sl-c3','end');
    area(PY,fY,0.0005,y,'l6-area',T);curve(PY,fY,0.002,6.5,'sl-c2',T);PY.seg(y,0,y,Math.min(fY(y)+0.15,T),'sl-c3 sl-dash');
    const P=2*Phi(r)-1;
    rd(out,[['√y',SL.fmt(r,3)],['P(|X| ≤ √y) = P(Y ≤ y)',SL.fmt(P,4),'c3'],['densité moyenne sur [0, y]',SL.fmt(P/y),'c1'],['densité du χ² en y',SL.fmt(fY(y),3)]]);
  }
  const sl=SL.slider(document.getElementById('v4sl'),{label:'y',min:0.01,max:6,step:0.01,value:1,fmt:v=>SL.fmt(v,2)},draw);
  const bs=buttons(document.getElementById('v4ctl'),['y = 1','y = 3,84','y = 0,01'],k=>sl.set([1,3.84,0.01][k]));
  sl.input.addEventListener('input',()=>bs.forEach(b=>b.setAttribute('aria-pressed','false')));
})();
