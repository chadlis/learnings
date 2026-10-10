/* ===== v1 : chaque face pèse e^(tx), et les moments reconstruisent M ===== */
(function(){
  const X=[1,2,3,4,5,6],mom=[];for(let k=0;k<=10;k++)mom.push(X.reduce((a,x)=>a+Math.pow(x,k)/6,0));
  const fact=k=>k<2?1:k*fact(k-1);
  const M=t=>X.reduce((a,x)=>a+Math.exp(t*x)/6,0),T=(t,K)=>{let s=0;for(let k=0;k<=K;k++)s+=mom[k]*Math.pow(t,k)/fact(k);return s;};
  const host=document.getElementById('v1plot'),out=document.getElementById('v1out'),ctl=document.getElementById('v1ctl');
  const row=SL.h('div','v-row',host),left=SL.h('div','',row),right=SL.h('div','',row);
  const R=SL.plot(right,{x:[-0.5,0.5],y:[0,8.6],w:300,h:260,xt:[-0.5,-0.25,0,0.25,0.5],yt:[0,2,4,6,8],xl:'t'});
  const st={t:0.5,K:2};
  function draw(){
    const t=st.t,K=st.K,c=X.map(x=>Math.exp(t*x)/6),m=M(t),top=Math.max(0.25,1.18*Math.max(...c));
    left.innerHTML='';
    const L=SL.plot(left,{x:[0.3,6.7],y:[0,top],w:300,h:260,xt:[1,2,3,4,5,6],yt:[],xl:'face x',yl:'P(X = x) · e^(tx)'});
    c.forEach((v,i)=>{bar(L,X[i]-0.33,X[i]+0.33,v,'sl-bar');L.text(X[i],v+top*0.02,SL.fmt(v,v<1?3:2),'','middle');});
    R.clear();
    ccurve(R,u=>T(u,K),-0.5,0.5,'sl-c3 sl-dash',0,8.6);
    ccurve(R,M,-0.5,0.5,'sl-c1',0,8.6);
    R.vline(t,'sl-dash');R.dot(t,m,'sl-c1',5);
    R.text(-0.48,8.0,'— M(t)','sl-c1','start');R.text(-0.48,7.1,'-- Taylor, '+K+' moment'+(K>1?'s':''),'sl-c3','start');
    const j=t>0?5:0,share=Math.abs(t)<1e-9?'toutes ⅙':SL.fmt(100*c[j]/m,0)+'\u202f%';
    rd(out,[['M(t), somme des barres',SL.fmt(m,3),'c1'],[t>0?'part de la face 6':t<0?'part de la face 1':'part de chaque face',share],['Taylor avec '+K+' moment'+(K>1?'s':''),SL.fmt(T(t,K),3),'c3'],['écart',fmtS(m-T(t,K),3)]]);
  }
  SL.slider(ctl,{label:'t',min:-0.5,max:0.5,step:0.05,value:0.5,fmt:v=>SL.fmt(v,2)},v=>{st.t=v;draw();});
  SL.slider(ctl,{label:'K moments',min:0,max:10,step:1,value:2,fmt:v=>String(v)},v=>{st.K=v;draw();});
})();

/* ===== v2 : la pente en 0 est la moyenne, la courbure est E[X²] ===== */
(function(){
  const host=document.getElementById('v2plot'),out=document.getElementById('v2out'),sdiv=document.getElementById('v2sl');
  const st={m:0,lam:2,p:0.3};
  function draw(){
    host.innerHTML='';
    const pois=st.m===0,m1=pois?st.lam:st.p,m2=pois?st.lam*st.lam+st.lam:st.p;
    const M=pois?(t=>Math.exp(st.lam*(Math.exp(t)-1))):(t=>1-st.p+st.p*Math.exp(t));
    const Y=pois?[0,4]:[0.6,1.5];
    const P=SL.plot(host,{x:[-0.5,0.5],y:Y,w:560,h:260,xt:[-0.5,-0.25,0,0.25,0.5],yt:pois?[0,1,2,3,4]:[0.6,0.8,1,1.2,1.4],xl:'t'});
    ccurve(P,t=>1+m1*t+m2*t*t/2,-0.5,0.5,'sl-c2 sl-dash',Y[0],Y[1]);
    ccurve(P,t=>1+m1*t,-0.5,0.5,'sl-c3 thin',Y[0],Y[1]);
    ccurve(P,M,-0.5,0.5,'sl-c1',Y[0],Y[1]);
    P.dot(0,1,'sl-c3',4.5);
    const yy=k=>Y[1]-(Y[1]-Y[0])*(0.07+0.1*k);
    P.text(-0.48,yy(0),'— M(t)','sl-c1','start');P.text(-0.48,yy(1),'— tangente en 0, pente E[X]','sl-c3','start');P.text(-0.48,yy(2),'-- parabole 1 + E[X] t + E[X²] t²/2','sl-c2','start');
    rd(out,[['M′(0) = E[X]',SL.fmt(m1,3),'c1'],['M″(0) = E[X²]',SL.fmt(m2,3)],['Var = M″(0) − M′(0)²',SL.fmt(m2-m1*m1,3),'c3']]);
  }
  const sl1=SL.h('div','',sdiv),sl2=SL.h('div','',sdiv);
  SL.slider(sl1,{label:'λ',min:0.5,max:4,step:0.1,value:2,fmt:v=>SL.fmt(v,1)},v=>{st.lam=v;if(st.m===0)draw();});
  SL.slider(sl2,{label:'p',min:0.05,max:0.95,step:0.05,value:0.3,fmt:v=>SL.fmt(v,2)},v=>{st.p=v;if(st.m===1)draw();});
  buttons(document.getElementById('v2ctl'),['Poisson(λ)','pièce Bernoulli(p)'],k=>{st.m=k;sl1.style.display=k===0?'':'none';sl2.style.display=k===1?'':'none';draw();});
})();

/* ===== v3 : multiplier la loi par e^(tx), puis mesurer l'aire ===== */
(function(){
  const host=document.getElementById('v3plot'),out=document.getElementById('v3out'),st={m:0,t:0.5};
  const fac=[1];for(let k=1;k<=40;k++)fac.push(fac[k-1]*k);
  const pois=(k,l)=>Math.exp(-l)*Math.pow(l,k)/fac[k];
  function draw(){
    host.innerHTML='';const t=st.t;
    if(st.m===0){
      const lam=2,K=[];for(let k=0;k<=14;k++)K.push(k);
      const g=K.map(k=>pois(k,lam)),h=K.map(k=>Math.exp(t*k)*pois(k,lam)),top=1.15*Math.max(...g,...h);
      const P=SL.plot(host,{x:[-0.6,14.6],y:[0,top],w:560,h:250,xt:[0,2,4,6,8,10,12,14],yt:[],xl:'k'});leftAxis(P,-0.6);
      K.forEach((k,i)=>{bar(P,k-0.34,k+0.34,h[i],'sl-bar');rect(P,k-0.34,k+0.34,0,g[i],'sl-bar ghost');});
      P.text(14.5,top*0.92,'▭ P(X = k), Poisson(2)','','end');P.text(14.5,top*0.82,'▮ e^(tk) · P(X = k)','sl-c2','end');
      rd(out,[['M(t), somme des barres pleines',SL.fmt(Math.exp(lam*(Math.exp(t)-1)),3),'c3'],['forme des barres pleines','Poisson('+(lam*Math.exp(t)).toFixed(2).replace('.',',')+')']]);
    }else if(st.m===1){
      const top=1.15*Math.max(phi(0),Math.exp(t*t/2)*phi(0));
      const P=SL.plot(host,{x:[-4,5],y:[0,top],w:560,h:250,xt:[-4,-3,-2,-1,0,1,2,3,4,5],yt:[],xl:'x'});
      area(P,x=>Math.exp(t*x)*phi(x),-4,5,'sl-area',top);
      ccurve(P,phi,-4,5,'sl-c4 sl-dash',0,top);
      P.vline(t,'sl-dash');
      P.text(4.9,top*0.92,'-- φ(x), N(0, 1)','sl-c4','end');P.text(4.9,top*0.82,'▮ e^(tx) · φ(x)','sl-c2','end');
      rd(out,[['M(t), aire pleine',SL.fmt(Math.exp(t*t/2),3),'c3'],['forme de la courbe pleine','N('+fmtS(t,2)+', 1)']]);
    }else{
      const f=x=>Math.exp((t-1)*x),top=1.45*Math.max(1,f(0),f(8));
      const P=SL.plot(host,{x:[0,8],y:[0,top],w:560,h:250,xt:[0,1,2,3,4,5,6,7,8],yt:[],xl:'x'});
      area(P,f,0,8,'sl-area',top);
      ccurve(P,x=>Math.exp(-x),0,8,'sl-c4 sl-dash',0,top);
      P.text(4,top*0.92,'-- e^(−x), Exp(1)','sl-c4','middle');P.text(4,top*0.82,'▮ e^(tx) · e^(−x)','sl-c2','middle');
      rd(out,[['M(t), aire pleine',t<1?SL.fmt(1/(1-t),3):'∞','c3'],['forme de la courbe pleine',t<1?'Exp('+SL.fmt(1-t,2)+')':'aucune, aire infinie']]);
    }
  }
  SL.slider(document.getElementById('v3sl'),{label:'t',min:-1,max:1.2,step:0.05,value:0.5,fmt:v=>SL.fmt(v,2)},v=>{st.t=v;draw();});
  buttons(document.getElementById('v3ctl'),['Poisson(2)','N(0, 1)','Exp(1)'],k=>{st.m=k;draw();});
})();

/* ===== v4 : plus la classe est fine, plus la barre de 6 pieds monte ===== */
(function(){
  const W=[2,1,0.5,0.25,0.1],q=0.5,top=0.42,out=document.getElementById('v4out');
  const P=SL.plot(document.getElementById('v4plot'),{x:[60,78],y:[0,top],w:560,h:260,xt:[60,63,66,69,72,75,78],yt:[0,0.1,0.2,0.3,0.4],xl:'taille déclarée, pouces (72 = 6 pieds)',yl:'part / largeur'});
  function draw(i){
    P.clear();const w=W[i];let other=0,h72=0;
    for(let k=-Math.ceil(12/w);k<=Math.ceil(6/w);k++){const c=72+k*w,lo=c-w/2,hi=c+w/2;if(hi<60||lo>78)continue;
      const h=(HT.cont(lo,hi,q)+(k===0?q*HT.zone:0))/w;
      if(k===0)h72=h;else other=Math.max(other,h);
      bar(P,Math.max(60,lo+w*0.06),Math.min(78,hi-w*0.06),Math.min(h,top*0.95),k===0?'sl-bar2 hot':'sl-bar');}
    if(h72>top*0.95)P.text(72.4,top*0.72,SL.fmt(h72,2)+' ↑','sl-c3','start');
    ccurve(P,HT.f,60,78,'sl-c4 sl-dash',0,top);
    P.text(77.8,top*0.9,'-- taille vraie','sl-c4','end');P.text(77.8,top*0.8,'▮ classe de 72','sl-c3','end');
    rd(out,[['largeur des classes',SL.fmt(w,2)+(w>=2?' pouces':' pouce')],['barre de 72',SL.fmt(h72,3),'c3'],['plus haute autre barre',SL.fmt(other,3)],['masse en 72',SL.fmt(100*q*HT.zone,1)+'\u202f%']]);
  }
  SL.slider(document.getElementById('v4ctl'),{label:'largeur w',min:0,max:W.length-1,step:1,value:2,fmt:v=>SL.fmt(W[v],2)},draw);
})();

/* ===== v5 : les 36 termes du produit, regroupés par x + y ===== */
(function(){
  const out=document.getElementById('v5out');
  const P=SL.plot(document.getElementById('v5plot'),{x:[0.3,12.7],y:[0,6.6],w:560,h:300,xt:[1,2,3,4,5,6,7,8,9,10,11,12],yt:[0,1,2,3,4,5,6]});
  const cells=[],rank={};
  for(let x=1;x<=6;x++)for(let y=1;y<=6;y++){const s=x+y;rank[s]=(rank[s]||0)+1;cells.push({x:x,y:y,s:s,j:rank[s]});}
  cells.sort((a,b)=>(a.x===a.y)-(b.x===b.y)); /* la diagonale en dernier, au-dessus */
  const G=[c=>({cx:c.x,cy:c.y-0.5,hh:0.45,op:1}),c=>({cx:c.s,cy:c.j-0.5,hh:0.45,op:1}),
           c=>c.x===c.y?{cx:c.s,cy:3,hh:2.95,op:1}:{cx:c.s,cy:c.j-0.5,hh:0.45,op:0.1}];
  const M=t=>[1,2,3,4,5,6].reduce((a,x)=>a+Math.exp(t*x)/6,0);
  let cur=cells.map(G[0]),mode=0;const fresh=runner();
  function frame(S){
    P.clear();
    cells.forEach((c,i)=>{const g=S[i];const r=rect(P,g.cx-0.45,g.cx+0.45,g.cy-g.hh,g.cy+g.hh,'sl-cellsq sl-k'+(1+c.s%6));r.setAttribute('style','opacity:'+(0.55*g.op).toFixed(3));
      if(g.op>0.5)P.text(g.cx,g.cy-0.16,String(c.s),'sl-cell-t','middle');});
    P.text(12.6,6.25,mode===0?'case (x, y)\u00a0: le terme e^(t(x+y))/36, marqué x + y':mode===1?'colonne s\u00a0: 36 × P(S = s)':'Y = X\u00a0: 6 cases de masse ⅙, sommes paires','','end');
  }
  function show(k){
    const tk=fresh(),a=cur.slice(),b=cells.map(G[k]);mode=k;
    tween(900,u=>{cur=a.map((g,i)=>({cx:g.cx+(b[i].cx-g.cx)*u,cy:g.cy+(b[i].cy-g.cy)*u,hh:g.hh+(b[i].hh-g.hh)*u,op:g.op+(b[i].op-g.op)*u}));frame(cur);},tk);
    const t=0.2,ind=k<2;
    rd(out,[['termes de somme 7',ind?'6 sur 36':'0'],['P(S = 7)',ind?'6/36 = 0,167':'0'],['M<sub>X</sub>(0,2)²',SL.fmt(M(t)**2,3)],[ind?'M<sub>X+Y</sub>(0,2)':'M<sub>2X</sub>(0,2)',SL.fmt(ind?M(t)**2:M(2*t),3),'c3']]);
  }
  buttons(document.getElementById('v5ctl'),['le produit\u00a0: 36 termes','regrouper par x + y','Y = X'],show);
})();

/* ===== v6 : M_Zn se rapproche de e^(t²/2) ===== */
(function(){
  const N=[1,2,3,5,10,20,50,100,1000],out=document.getElementById('v6out'),st={m:0,i:0};
  const Ms=[u=>Math.cosh(u),u=>u<1?Math.exp(-u)/(1-u):Infinity];
  const P=SL.plot(document.getElementById('v6plot'),{x:[-2,2],y:[0,8],w:560,h:270,xt:[-2,-1.5,-1,-0.5,0,0.5,1,1.5,2],yt:[0,2,4,6,8],xl:'t'});
  function draw(){
    P.clear();const n=N[st.i],sq=Math.sqrt(n),M=Ms[st.m],Mz=t=>Math.pow(M(t/sq),n);
    curve(P,t=>Math.exp(t*t/2),-2,2,'sl-c3',8);
    ccurve(P,Mz,-2,2,'sl-c4',0,8,400);
    if(st.m===1&&sq<2){P.vline(sq,'sl-c5 sl-dash');P.text(sq+0.04,7.5,'t = √n','sl-c5','start');}
    P.text(-1.45,7.4,'— e^(t²/2), la cible','sl-c3','start');P.text(-1.45,6.6,'— M(t/√n)ⁿ, la fonction de Zₙ','sl-c4','start');
    const v=Mz(1);
    rd(out,[['n',String(n)],['M<sub>Z<sub>n</sub></sub>(1)',fmtInf(v,3),'c1'],['e<sup>0,5</sup>, la cible','1,649','c3'],['écart en t = 1',isFinite(v)?fmtS(v-Math.exp(0.5),3):'∞']]);
  }
  SL.slider(document.getElementById('v6sl'),{label:'n',min:0,max:N.length-1,step:1,value:0,fmt:v=>String(N[v])},v=>{st.i=v;draw();});
  buttons(document.getElementById('v6ctl'),['pile ou face ±1','exponentielle centrée'],k=>{st.m=k;draw();});
})();
