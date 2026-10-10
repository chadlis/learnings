/* ===== v1 (n1) : un point test, ses deux écarts, le rectangle signé ===== */
(function(){
  const host=document.getElementById('v1plot'),out=document.getElementById('v1out'),ctl=document.getElementById('v1ctl');
  const M=[{d:{x:[1,2,3,4],y:[1,3,2,4]},X:[0,5],Y:[0,5],xt:[0,1,2,3,4,5],yt:[0,1,2,3,4,5]},
    {d:cloud(33,2.2,0.45,35,250,5,4),X:[0,10],Y:[0,8],xt:[0,2,4,6,8,10],yt:[0,2,4,6,8]},
    {d:cloud(7,2.2,1.1,20,250,5,4),X:[0,10],Y:[0,8],xt:[0,2,4,6,8,10],yt:[0,2,4,6,8]},
    {d:cloud(12,1.4,1.4,0,250,5,4),X:[0,10],Y:[0,8],xt:[0,2,4,6,8,10],yt:[0,2,4,6,8]}];
  const st={k:0,j:3};
  /* le point test de départ : en haut à droite du centre, comme celui de Brunton, et loin des bords */
  function first(k){if(k===0)return 3;const d=M[k].d,S=stats2(d.x,d.y);
    for(let i=0;i<d.x.length;i++){const a=d.x[i]-S.mx,b=d.y[i]-S.my;if(a>1.2&&a<3&&b>1&&b<2.6)return i;}return 0;}
  function draw(){
    host.innerHTML='';const m=M[st.k],d=m.d,n=d.x.length,S=stats2(d.x,d.y);
    const P=SL.plot(host,{x:m.X,y:m.Y,w:560,h:340,xt:m.xt,yt:m.yt,xl:'x',yl:'y'});clipTo(P,'v1clip');
    const ex=(m.X[1]-m.X[0])*0.07,ey=(m.Y[1]-m.Y[0])*0.09;
    P.text(m.X[1]-ex,m.Y[1]-ey,'+','sl-quad','middle');P.text(m.X[0]+ex,m.Y[0]+ey*0.4,'+','sl-quad','middle');
    P.text(m.X[0]+ex,m.Y[1]-ey,'−','sl-quad','middle');P.text(m.X[1]-ex,m.Y[0]+ey*0.4,'−','sl-quad','middle');
    let pos=0;const pr=d.x.map((x,i)=>(x-S.mx)*(d.y[i]-S.my));pr.forEach(p=>{if(p>0)pos++;});
    if(st.k===0)pr.forEach((p,i)=>{rect(P,S.mx,d.x[i],S.my,d.y[i],p>=0?'sl-sq':'sl-sqn');
      P.text((S.mx+d.x[i])/2,(S.my+d.y[i])/2-0.1,fxs(p,2),p>=0?'sl-sq-t':'sl-sqn-t','middle');});
    const j=st.j%n,px=d.x[j],py=d.y[j],pp=pr[j];
    if(st.k>0)rect(P,S.mx,px,S.my,py,pp>=0?'sl-sq':'sl-sqn');
    P.seg(S.mx,m.Y[0],S.mx,m.Y[1],'sl-mean sl-dash');P.seg(m.X[0],S.my,m.X[1],S.my,'sl-mean sl-dash');
    d.x.forEach((x,i)=>P.dot(x,d.y[i],st.k===0?'sl-c1':(pr[i]>0?'sl-c2 sl-tiny':'sl-c3 sl-tiny'),st.k===0?6:2.8));
    const big=st.k>0||(Math.abs(px-S.mx)>=1&&Math.abs(py-S.my)>=1);
    if(big){P.arrow(S.mx,S.my,px,S.my,'sl-c4');P.arrow(px,S.my,px,py,'sl-c4');}P.dot(px,py,'sl-c4',6.5);
    const lx=(S.mx+px)/2,ly=S.my+(py>S.my?1:-1)*ey*0.75-(py>S.my?0:ey*0.3);
    /* quatre points : un écart de 0,5 laisse trop peu de place ; le rectangle et les readouts suffisent */
    if(big)P.text(lx,ly,'X − μX','sl-c4','middle');
    if(big)P.text(px+(px>S.mx?ex*0.4:-ex*0.4),(S.my+py)/2,'Y − μY','sl-c4',px>S.mx?'start':'end');
    rd(out,[['écarts du point test',fxs(px-S.mx,2)+' et '+fxs(py-S.my,2)],['leur produit, l’aire signée',fxs(pp,2)],
      ['Cov, moyenne des '+n+' produits',fxm(S.cov,2),'c3'],['produits positifs',st.k===0?pos+' sur 4':Math.round(100*pos/n)+' %']]);
  }
  buttons(ctl,['quatre points','nuage incliné','plus large, moins pentu','nuage rond'],k=>{st.k=k;st.j=first(k);draw();});
  SL.h('button','tb',ctl,'point suivant ›').onclick=()=>{st.j++;draw();};
})();

/* ===== v2 (n2) : deux dés contre un dé doublé (figure existante de p00-02, graine fixée) ===== */
(function(){
  const host=document.getElementById('v2plot');
  const rS=rng(15),rD=rng(1015),dS=()=>1+Math.floor(6*rS()),dD=()=>1+Math.floor(6*rD());
  const opts=(xl,th)=>({bins:[1.5,12.5,11],xt:[2,4,6,8,10,12],xl:xl,yl:' ',w:560,h:190,
    marks:[],empty:'Aucun tirage — clique « tirer 500 ».',
    readout:(n,m,s)=>n+' tirages · moyenne '+SL.fmt(m,2)+' · écart-type mesuré '+SL.fmt(s,2)+'  (théorie : 7 et '+th+')'});
  const rSum=SL.repeat(SL.h('div','',host),Object.assign(opts('X + Y : deux dés indépendants','2,42'),{draw:()=>dS()+dS()}));
  const rDbl=SL.repeat(SL.h('div','',host),Object.assign(opts('2X : le même dé compté deux fois','3,42'),{draw:()=>2*dD()}));
  /* amorce : une figure vide au chargement ne montre rien */
  for(let i=0;i<300;i++){rSum.stats.push(dS()+dS());rDbl.stats.push(2*dD());}
  rSum.render();rDbl.render();
})();

/* ===== v3 (n3) : des liens exacts, une covariance nulle ===== */
(function(){
  const out=document.getElementById('v3out'),r=rng(31),N=200;
  const par={x:[],y:[]},cir={x:[],y:[]},half={x:[],y:[]};
  for(let i=0;i<N;i++){const u=2*r()-1;par.x.push(u);par.y.push(u*u);}
  for(let i=0;i<N;i++){const a=2*Math.PI*r();cir.x.push(Math.cos(a));cir.y.push(Math.sin(a));}
  for(let i=0;i<N;i++){const u=r();half.x.push(u);half.y.push(u*u);}
  const M=[{x:[-1,0,1],y:[1,0,1]},par,cir,half],LINK=['oui : y = x²','oui : y = x²','oui : x² + y² = 1','oui : y = x²'];
  const P=SL.plot(document.getElementById('v3plot'),{x:[-1.8,1.8],y:[-1.18,1.19],w:560,h:380,xt:[-1.5,-1,-0.5,0,0.5,1,1.5],yt:[-1,-0.5,0,0.5,1],xl:'x',yl:'y'});
  function draw(k){
    P.clear();const d=M[k],S=k===0?{mx:0,my:2/3,cov:0}:stats2(d.x,d.y);
    if(k===0){
      rect(P,-1,0,2/3,1,'sl-sqn');rect(P,0,1,2/3,1,'sl-sq');
      P.text(-0.5,0.8,'−⅓','sl-sqn-t','middle');P.text(0.5,0.8,'+⅓','sl-sq-t','middle');P.text(0.1,0.04,'0','sl-sq-t','start');
    }
    P.seg(S.mx,-1.18,S.mx,1.19,'sl-mean sl-dash');P.seg(-1.8,S.my,1.8,S.my,'sl-mean sl-dash');
    d.x.forEach((x,i)=>{const p=(x-S.mx)*(d.y[i]-S.my);P.dot(x,d.y[i],k===0?'sl-c1':(p>0?'sl-c2 sl-tiny':'sl-c3 sl-tiny'),k===0?7:2.8);});
    P.text(1.75,1.08,'┆ centre (μX, μY)','sl-c3','end');
    rd(out,k===0?[['centre (μ<sub>X</sub>, μ<sub>Y</sub>)','(0 ; ⅔)'],['Cov, moyenne des rectangles','0','c3'],['P(Y = 0 ∣ X = 0)','1'],['P(Y = 0)','⅓']]
      :[['lien exact ?',LINK[k]],['Cov mesurée sur 200 points',fxf(S.cov,3),'c3'],['ρ mesuré',fxf(S.rho,2)]]);
  }
  buttons(document.getElementById('v3ctl'),['{−1, 0, 1} et X²','parabole','cercle','demi-parabole'],draw);
})();

/* ===== v4 (n4) : changer d'unité gonfle la covariance, pas la corrélation ===== */
(function(){
  const host=document.getElementById('v4plot'),out=document.getElementById('v4out');
  const X0=[1,2,3,4],Y0=[1,3,2,4],B=[0,1,2,3,4,5];
  const T=[[1,0,1,0],[12,0,12,0],[1,0,12,0],[1,10,1,10],[1,0,-1,0]];
  const UX=['x (pieds)','x (pouces)','x (pieds)','x + 10 (pieds)','x (pieds)'],UY=['y (pieds)','y (pouces)','y (pouces)','y + 10 (pieds)','−y (pieds)'];
  function draw(k){
    host.innerHTML='';const [a,b,c,d]=T[k],xs=X0.map(x=>a*x+b),ys=Y0.map(y=>c*y+d);
    const P=SL.plot(host,{x:[b,5*a+b].sort((p,q)=>p-q),y:[d,5*c+d].sort((p,q)=>p-q),w:560,h:300,xt:B.map(t=>a*t+b),yt:B.map(t=>c*t+d),xl:UX[k],yl:UY[k]});
    const S=stats2(xs,ys),ey=0.1*Math.abs(c);
    xs.forEach((x,i)=>{const p=(x-S.mx)*(ys[i]-S.my);rect(P,S.mx,x,S.my,ys[i],p>=0?'sl-sq':'sl-sqn');
      P.text((S.mx+x)/2,(S.my+ys[i])/2-ey,fxs(p,2),p>=0?'sl-sq-t':'sl-sqn-t','middle');});
    P.vline(S.mx,'sl-mean sl-dash');P.seg(Math.min(b,5*a+b),S.my,Math.max(b,5*a+b),S.my,'sl-mean sl-dash');
    xs.forEach((x,i)=>P.dot(x,ys[i],'sl-c1',6));
    rd(out,[['Cov, moyenne des rectangles',fxm(S.cov,2),'c3'],['σ<sub>X</sub> σ<sub>Y</sub>',SL.fmt(Math.sqrt(S.vx*S.vy),2)],['ρ = Cov / (σ<sub>X</sub> σ<sub>Y</sub>)',fxm(S.rho,2),'c1']]);
  }
  buttons(document.getElementById('v4ctl'),['en pieds','X et Y en pouces (× 12)','Y seul en pouces','décalé (+ 10)','Y retourné (× −1)'],draw);
})();

/* ===== v5 (n5) : trois cibles, des fléchettes ===== */
(function(){
  const out=document.getElementById('v5out'),ctl=document.getElementById('v5ctl');
  const P=SL.plot(document.getElementById('v5plot'),{x:[-6,6],y:[-4,4],w:560,h:385,xt:[-6,-4,-2,0,2,4,6],yt:[-4,-2,0,2,4],xl:'x',yl:'y'});
  clipTo(P,'v5clip');
  const G=[],r=rng(193);function add(n){for(let i=0;i<n;i++){const a=gauss(r),b=gauss(r);G.push([a,b]);}}add(300);
  const C=[[1,1,0],[2,1,0],[2,1,45]];let cur=C[0].slice(),mode=0;const fresh=runner();
  function draw(p){
    P.clear();const t=p[2]*Math.PI/180,c=Math.cos(t),s=Math.sin(t);
    [1,2].forEach(k=>ellipse(P,p[0],p[1],t,k,'sl-ell'+(k>1?' k2':'')));
    const X=[],Y=[];G.forEach(g=>{const u=p[0]*g[0],v=p[1]*g[1];X.push(u*c-v*s);Y.push(u*s+v*c);});
    X.forEach((x,i)=>P.dot(x,Y[i],'sl-c2 sl-tiny',2.6));P.dot(0,0,'sl-c3',4);
    const S=stats2(X,Y),a=p[0]*p[0],b=p[1]*p[1],cv=(a-b)*s*c;
    rd(out,[['fléchettes',String(G.length)],['Var X ; Var Y, en théorie',SL.fmt(a*c*c+b*s*s,2)+' ; '+SL.fmt(a*s*s+b*c*c,2)],
      ['Cov en théorie',fxm(cv,2),'c3'],['Cov mesurée sur les fléchettes',fxf(S.cov,2),'c1'],['f(x, y) = f<sub>X</sub>(x) f<sub>Y</sub>(y) ?',Math.abs(cv)<1e-9?'oui':'non']]);
  }
  buttons(ctl,['cercle : σ = 1 et 1','ellipse alignée : 2 et 1','ellipse tournée de 45°'],k=>{mode=k;const tk=fresh(),a=cur.slice(),b=C[k];
    tween(800,u=>{cur=a.map((x,i)=>x+(b[i]-x)*u);draw(cur);},tk);});
  SL.h('button','tb',ctl,'▶ lancer 300 fléchettes').onclick=()=>{const tk=fresh();let k=0;cur=C[mode].slice();
    loop(tk,()=>{if(G.length>=3000)return false;add(10);k+=10;draw(cur);return k<300;});};
})();

/* ===== v6 (n6) : refaire l'évaluation, avec un jeu de test ou deux ===== */
(function(){
  const host=document.getElementById('v6plot'),out=document.getElementById('v6out'),ctl=document.getElementById('v6ctl');
  const n=1000,R=400,lo=-0.03,hi=0.09,bw=0.003,nb=40,xt=[-0.02,0,0.02,0.04,0.06,0.08];
  const P1=SL.plot(SL.h('div','',host),{x:[lo,hi],y:[0,1.12],w:560,h:150,xt:xt,yt:[],xl:'D̂ = p̂B − p̂A, même jeu de test'});
  const P2=SL.plot(SL.h('div','',host),{x:[lo,hi],y:[0,1.12],w:560,h:150,xt:xt,yt:[],xl:'D̂ = p̂B − p̂A, deux jeux de test'});
  [P1,P2].forEach(P=>{P.svg.querySelectorAll('line.sl-axis')[1].remove();});
  const res=[];const fresh=runner();let seed=62;
  function once(r){let n11=0,n10=0,n01=0,a=0,b=0;
    for(let i=0;i<n;i++){const u=r();if(u<0.862)n11++;else if(u<0.872)n10++;else if(u<0.911)n01++;}
    for(let i=0;i<n;i++)if(r()<0.872)a++;
    for(let i=0;i<n;i++)if(r()<0.901)b++;
    return {ds:(n01-n10)/n,dp:(b-a)/n,b:n10,c:n01};}
  function sd(v){const m=v.reduce((s,x)=>s+x,0)/v.length;return Math.sqrt(v.reduce((s,x)=>s+(x-m)*(x-m),0)/(v.length-1));}
  function hist(v){const c=new Array(nb).fill(0);v.forEach(x=>{const i=Math.floor((x-lo)/bw+1e-6);if(i>=0&&i<nb)c[i]++;});return c;}
  function draw(){
    P1.clear();P2.clear();const A=res.map(e=>e.ds),B=res.map(e=>e.dp),c1=hist(A),c2=hist(B),mx=Math.max(1,...c1,...c2);
    c1.forEach((k,i)=>{if(k)bar(P1,lo+(i+0.08)*bw,lo+(i+0.92)*bw,k/mx,'sl-bar');});
    c2.forEach((k,i)=>{if(k)bar(P2,lo+(i+0.08)*bw,lo+(i+0.92)*bw,k/mx,'sl-bar3');});
    [P1,P2].forEach(P=>{P.vline(0,'sl-dash');P.vline(0.029,'sl-mean');
      P.text(hi-0.001,1.0,'│ D = 0,029, la vraie différence','sl-c3','end');P.text(hi-0.001,0.8,'┆ D̂ = 0','','end');});
    const last=res[res.length-1];
    rd(out,[['évaluations',String(res.length)],['écart-type de D̂, même jeu de test (théorie 0,0069)',res.length>1?fxf(sd(A),4):'—','c1'],
      ['écart-type de D̂, deux jeux de test (théorie 0,0142)',res.length>1?fxf(sd(B),4):'—'],
      ['D̂ ≤ 0 : même jeu de test ; deux jeux de test',A.filter(x=>x<=1e-12).length+' ; '+B.filter(x=>x<=1e-12).length],
      ['dernière évaluation partagée : A seul juste, B seul juste',last?last.b+' et '+last.c:'—']]);
  }
  {const r=rng(seed);for(let k=0;k<R;k++)res.push(once(r));draw();}
  SL.h('button','tb',ctl,'▶ refaire 400 évaluations').onclick=()=>{const tk=fresh(),r=rng(++seed);res.length=0;
    loop(tk,()=>{for(let j=0;j<8&&res.length<R;j++)res.push(once(r));draw();return res.length<R;});};
})();
