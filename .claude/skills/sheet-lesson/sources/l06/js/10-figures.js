/* ===== Figure 1 : dix tranches de probabilité 0,1, étirées ou tassées par g ===== */
(function(){
  const host=document.getElementById('f1plot'),out=document.getElementById('f1out'),D=2.3;
  const G=[
    {n:'g(x) = 2x',g:x=>2*x,f:y=>y>=0&&y<=2?0.5:0,Y:[0,2.3],yt:[0,0.5,1,1.5,2],fs:'½ sur [0, 2]'},
    {n:'g(x) = x²',g:x=>x*x,f:y=>y>0&&y<=1?1/(2*Math.sqrt(y)):0,Y:[0,1.15],yt:[0,0.25,0.5,0.75,1],fs:'1/(2√y)'},
    {n:'g(x) = √x',g:x=>Math.sqrt(x),f:y=>y>=0&&y<=1?2*y:0,Y:[0,1.15],yt:[0,0.25,0.5,0.75,1],fs:'2y sur [0, 1]'},
    {n:'g(x) = −ln x',g:x=>-Math.log(x),f:y=>y>=0?Math.exp(-y):0,Y:[0,4.5],yt:[0,1,2,3,4],fs:'e^(−y)'}];
  function draw(k){
    const L=G[k],top=L.Y[1];host.innerHTML='';
    const row=SL.h('div','v-row',host),lh=SL.h('div','',row),rh=SL.h('div','',row);
    const A=SL.plot(lh,{x:[0,1.05],y:L.Y,w:300,h:300,xt:[0,0.5,1],yt:L.yt,xl:'x'});
    A.label(0.55,top*0.95,'y = g(x)','sl-c1','middle');
    const B=SL.plot(rh,{x:[0,D],y:L.Y,w:300,h:300,xt:[0,1,2],yt:L.yt,xl:'densité de Y'});
    const strip=0.035*(top-L.Y[0]);let hmax=0,imax=0,hmin=Infinity;const clip=[];let clipTop=0;
    for(let i=0;i<10;i++){
      const x0=i/10,x1=(i+1)/10,cls='sl-k'+(1+i%5)+' sl-kc';
      const ya=L.g(x0),yb=L.g(x1),lo=Math.min(ya,yb),hi=Math.max(ya,yb),loC=Math.min(lo,top),hiC=Math.min(hi,top);
      rect(A,x0,x1,L.Y[0],L.Y[0]+strip,cls);
      if(hiC>loC)rect(A,0,0.035,loC,hiC,cls);
      if(isFinite(hi)){const h=0.1/(hi-lo);hmin=Math.min(hmin,h);if(h>hmax){hmax=h;imax=i;}
        if(hiC>loC)rect(B,0,Math.min(h,D),loC,hiC,cls);
        if(h>D){clip.push(SL.fmt(h,1));clipTop=Math.max(clipTop,hi);}}
      else B.text(0.5,top*0.94,'↑ x de 0 à 0,1\u00a0: y > '+SL.fmt(lo,2),'','start');
    }
    if(clip.length)B.text(D-0.03,0.3*top,'↓ '+clip.join(' et '),'','end');
    for(let i=0;i<=10;i++){const x=i/10,y=L.g(x);if(isFinite(y)&&y<=top){A.seg(0,y,x,y,'sl-link');A.dot(x,y,'sl-c1',2.6);}}
    const pts=[];for(let j=0;j<=300;j++){const x=0.0005+(1-0.0005)*j/300,y=L.g(x);if(y<=top)pts.push([x,y]);}pathXY(A,pts,'sl-c1');
    const fp=[];for(let j=0;j<=300;j++){const y=L.Y[0]+0.0001+(top-0.0001)*j/300,v=L.f(y);fp.push([Math.min(v,D),y]);}pathXY(B,fp,'l6-ink');
    const ya=L.g(imax/10),yb=L.g((imax+1)/10),same=hmax/hmin<1.001;
    rd(out,[['transformation',L.n],['densité exacte de Y',L.fs],['tranche la plus haute',SL.fmt(hmax,3),'c3'],['elle couvre',same?'toutes égales':'y de '+SL.fmt(Math.min(ya,yb),3)+' à '+SL.fmt(Math.max(ya,yb),3)],['aire de chaque tranche','0,1']]);
  }
  buttons(document.getElementById('f1ctl'),G.map(g=>g.n.replace('g(x) = ','')),draw);
})();

/* ===== Figure 2 : aX + b sur une loi asymétrique, l'attente des spams ===== */
(function(){
  const P=SL.plot(document.getElementById('f2plot'),{x:[-100,100],y:[-0.15,0.15],w:560,h:280,xt:[-100,-75,-50,-25,0,25,50,75,100],yt:[-0.1,-0.05,0,0.05,0.1],xl:'y = aX + b, en minutes',yl:'densité'});
  const out=document.getElementById('f2out'),ctl=document.getElementById('f2ctl'),m=15,st={a:-1,b:30};
  const fX=x=>x<0?0:Math.exp(-x/m)/m;
  function pts(f,b){const p=[];for(let j=0;j<=400;j++){const y=-100+200*j/400;p.push([y,f(y)]);}
    if(b>-100&&b<100){p.push([b-1e-9,f(b-1e-6)],[b+1e-9,f(b+1e-6)]);p.sort((u,v)=>u[0]-v[0]);}return p;}
  function draw(){
    P.clear();const a=st.a,b=st.b;
    if(a===0){P.vline(b,'sl-c2');P.text(b+3,0.135,'a = 0\u00a0: Y = b, constante','sl-c2','start');
      rd(out,[['E[Y] = 15a + b',mf(b,0)+' min','c3'],['σ = 15 |a|','0'],['densité','aucune']]);return;}
    const f=y=>fX((y-b)/a)/Math.abs(a);
    const pf=pts(f,b);fillXY(P,pf,'l6-area');pathXY(P,pf,'sl-c2');
    if(a<0)pathXY(P,pts(y=>-f(y),b),'sl-c3 l6-dash');
    const E=m*a+b,s=m*Math.abs(a);
    P.vline(E,'sl-mean');P.seg(E-s,0.142,E+s,0.142,'gain');
    P.text(-98,-0.14,'│ moyenne','sl-c3','start');
    if(a<0)P.text(98,-0.14,'┄ avec 1/a au lieu de 1/|a|\u00a0: aire −1','sl-c3','end');
    rd(out,[['E[Y] = 15a + b',mf(E,1)+' min','c3'],['σ = 15 |a|',SL.fmt(s,1)+' min'],['hauteur en y = b',SL.fmt(1/(m*Math.abs(a)),4)],['la queue part',a>0?'à droite':'à gauche'],['aire de la courbe violette','1']]);
  }
  SL.slider(ctl,{label:'a (étire)',min:-2,max:2,step:0.5,value:-1,fmt:v=>SL.fmt(v,1)},v=>{st.a=v;draw();});
  SL.slider(ctl,{label:'b (décale)',min:-30,max:30,step:5,value:30,fmt:v=>SL.fmt(v,0)},v=>{st.b=v;draw();});
})();

/* ===== Figure 3 : standardiser ne rend pas normal ===== */
(function(){
  const P=SL.plot(document.getElementById('f3plot'),{x:[-3.5,4.5],y:[0,1.05],w:560,h:260,xt:[-3,-2,-1,0,1,2,3,4],yt:[0,0.25,0.5,0.75,1],xl:'z',yl:'densité de Z'});
  const out=document.getElementById('f3out'),r3=Math.sqrt(3);
  const L=[
    {n:'normale',f:phi,p2:1-Phi(2),p1:Phi(1)-Phi(-1)},
    {n:'exponentielle',f:z=>z<-1?0:Math.exp(-(z+1)),p2:Math.exp(-3),p1:1-Math.exp(-2),jump:-1},
    {n:'uniforme',f:z=>Math.abs(z)<=r3?1/(2*r3):0,p2:0,p1:1/r3,jump:[-r3,r3]}];
  P.fn(phi,'l6-gray');
  P.label(4.45,0.97,'┄ φ, la normale centrée réduite','','end');P.label(4.45,0.88,'— Z = (X − μ)/σ','sl-c2','end');
  function draw(k){
    P.clear();const l=L[k],p=[];
    for(let j=0;j<=480;j++)p.push(-3.5+8*j/480);
    [].concat(l.jump===undefined?[]:l.jump).forEach(x=>p.push(x-1e-9,x+1e-9));p.sort((u,v)=>u-v);
    area(P,l.f,2,4.5,'l6-area3',1.05);pathXY(P,p.map(z=>[z,l.f(z)]),'sl-c2');
    P.seg(2,0,2,0.55,'sl-c3 sl-dash');P.text(2.08,0.5,'Z > 2','sl-c3','start');
    P.text(2.25,0.16,'aire ombrée\u00a0: '+SL.fmt(l.p2,4),'sl-c3','start');
    if(l.p2>0)P.arrow(2.6,0.13,2.35,Math.min(l.f(2.35),1)+0.012,'sl-c3');
    rd(out,[['loi de X',l.n],['P(Z > 2), vraie',SL.fmt(l.p2,4),'c3'],['P(Z > 2) selon Φ',SL.fmt(1-Phi(2),4)],['P(|Z| < 1), vraie',SL.fmt(l.p1,3),'c3'],['P(|Z| < 1) selon Φ',SL.fmt(Phi(1)-Phi(-1),3)]]);
  }
  buttons(document.getElementById('f3ctl'),L.map(l=>l.n),draw);
})();

/* ===== Figure 4 : les pentes de Φ en ±√y ===== */
(function(){
  const P=SL.plot(document.getElementById('f4plot'),{x:[-3.2,3.4],y:[-0.12,1.08],w:560,h:300,xt:[-3,-2,-1,0,1,2,3],yt:[0,0.25,0.5,0.75,1],xl:'x',yl:'Φ(x)'});
  leftAxis(P,-3.2);
  const out=document.getElementById('f4out'),fresh=runner();
  P.fn(Phi,'sl-c1');
  P.label(-3.1,0.97,'— deux tangentes, même pente φ(√y)','sl-c2','start');
  P.label(-3.1,0.89,'│ P(Y ≤ y) = Φ(√y) − Φ(−√y)','sl-c3','start');
  function draw(y){
    P.clear();const r=Math.sqrt(y),s=phi(r),hi=Phi(r),lo=Phi(-r),L=0.55,X=3.25;
    rect(P,-r,r,-0.035,-0.01,'l6-band');
    P.text(-r,-0.105,'−√y','','middle');P.text(r,-0.105,'√y','','middle');
    [[-r,lo],[r,hi]].forEach(q=>P.seg(q[0]-L,q[1]-L*s,q[0]+L,q[1]+L*s,'sl-c2'));
    const v=0.4/(2*r);P.arrow(r,hi,r+v,hi+v*s,'sl-c3');P.arrow(-r,lo,-r-v,lo-v*s,'sl-c3');
    P.seg(-r,lo,X,lo,'sl-link');P.seg(r,hi,X,hi,'sl-link');P.seg(X,lo,X,hi,'sl-c3');
    P.dot(-r,lo,'sl-c2',4.5);P.dot(r,hi,'sl-c2',4.5);
    rd(out,[['√y',SL.fmt(r,3)],['pente de Φ en ±√y',SL.fmt(s,3)],['vitesse de ±√y','±'+SL.fmt(1/(2*r),3)],['apport de chaque bout',SL.fmt(s/(2*r),3)],['f<sub>Y</sub>(y), les deux bouts',SL.fmt(s/r,3),'c3'],['F<sub>Y</sub>(y), l’écart',SL.fmt(hi-lo,3)]]);
  }
  const ctl=document.getElementById('f4ctl'),sl=SL.slider(document.getElementById('f4sl'),{label:'y',min:0.05,max:6,step:0.01,value:1,fmt:v=>SL.fmt(v,2)},v=>{fresh();draw(v);});
  SL.h('button','tb',ctl,'▶ élargir la bande').onclick=()=>{const tk=fresh();
    tween(4000,u=>{const v=0.05+5.95*u;sl.input.value=v;sl.input.nextSibling.textContent=SL.fmt(v,2);draw(v);},tk);};
})();
