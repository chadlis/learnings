/* ===== v1 : un événement est une région du tableau des deux dés ===== */
(function(){
  const P=SL.plot(document.getElementById('v1plot'),{x:[0.4,6.6],y:[0.4,6.95],w:460,h:430,xt:[1,2,3,4,5,6],yt:[1,2,3,4,5,6],xl:'x, premier dé',yl:'y, second dé'});
  P.svg.querySelector('.sl-grid').style.display='none';
  const out=document.getElementById('v1out'),ctl=document.getElementById('v1ctl');
  const EV=[{n:'X + Y = 7',t:(x,y)=>x+y===7},{n:'X > Y',t:(x,y)=>x>y},{n:'X ≤ 2 et Y ≥ 5',t:(x,y)=>x<=2&&y>=5}];
  for(let x=1;x<=6;x++)for(let y=1;y<=6;y++)rect(P,x-0.46,x+0.46,y-0.46,y+0.46,'sl-cello',P.layer);
  const dots=SL.el('g',{},P.svg);const fresh=runner();
  let ev=0,thr=[],seed=21;
  function draw(){
    P.clear();const E=EV[ev];let k=0;
    for(let x=1;x<=6;x++)for(let y=1;y<=6;y++){const on=E.t(x,y);if(on){k++;rect(P,x-0.46,x+0.46,y-0.46,y+0.46,'sl-cellp').setAttribute('fill-opacity','0.42');}
      P.text(x,y-0.1,'1/36',on?'sl-cell-t':'sl-prod','middle');}
    const hit=thr.filter(p=>E.t(p[0],p[1])).length;
    rd(out,[['cases dans l’événement',String(k)],['P = somme des cases',k+'/36 = '+fx(k/36,3),'c3'],
      thr.length?['part des '+thr.length+' paires lancées',pc(hit/thr.length,1),'c1']:['paires lancées','aucune']]);
  }
  buttons(ctl,EV.map(e=>e.n),i=>{ev=i;draw();});
  SL.h('button','tb',ctl,'▶ lancer 360 paires').onclick=()=>{const tk=fresh(),r=rng(seed++);thr=[];while(dots.firstChild)dots.removeChild(dots.firstChild);
    loop(tk,()=>{for(let j=0;j<6&&thr.length<360;j++){const x=1+Math.floor(6*r()),y=1+Math.floor(6*r());thr.push([x,y]);
      SL.el('circle',{cx:P.sx(x-0.38+0.76*r()).toFixed(1),cy:P.sy(y+0.12+0.28*r()).toFixed(1),r:2.2,class:'sl-dot sl-c4 sl-hot'},dots);}
      draw();return thr.length<360;});};
})();

/* ===== v2 : la marginale compte les points bande par bande ===== */
(function(){
  const host=document.getElementById('v2plot'),out=document.getElementById('v2out');
  const J=jointPanel(host,{lim:[-3.5,3.5],size:330,top:90,right:90,xl:'x',tl:'marginale de X',rl:'marginale de Y'});
  const DF=x=>{const t=Math.max(-2,Math.min(2,x));return (t*Math.sqrt(4-t*t)+4*Math.asin(t/2))/(4*Math.PI);};
  const LAW=[
    {n:'gaussien',gen:r=>[gauss(r),gauss(r)],f:phi,band:a=>Phi(a+0.5)-Phi(a)},
    {n:'uniforme sur un carré',gen:r=>[-2+4*r(),-2+4*r()],f:x=>Math.abs(x)<=2?0.25:0,band:a=>Math.max(0,Math.min(a+0.5,2)-Math.max(a,-2))/4},
    {n:'uniforme sur un disque',gen:r=>{for(;;){const x=-2+4*r(),y=-2+4*r();if(x*x+y*y<4)return [x,y];}},f:x=>Math.abs(x)<2?Math.sqrt(4-x*x)/(2*Math.PI):0,band:a=>DF(a+0.5)-DF(a)}];
  const st={k:0,a:0,seed:3163},X=[],Y=[],D=[];let r=null;const fresh=runner();
  function add(n){const L=LAW[st.k];for(let i=0;i<n&&X.length<6200;i++){const p=L.gen(r);X.push(p[0]);Y.push(p[1]);
    D.push(Math.abs(p[0])<3.5&&Math.abs(p[1])<3.5?SL.el('circle',{cx:J.sx(p[0]).toFixed(1),cy:J.sy(p[1]).toFixed(1),r:2,class:'sl-dot sl-c2 sl-tiny'},J.pts):null);}}
  function reset(){fresh();X.length=0;Y.length=0;D.length=0;while(J.pts.firstChild)J.pts.removeChild(J.pts.firstChild);r=rng(st.seed+100*st.k);add(800);}
  function draw(){
    J.clear();const L=LAW[st.k],a=st.a,n=X.length,cx=new Array(14).fill(0),cy=new Array(14).fill(0);let k=0;
    J.vband(a,a+0.5);
    for(let i=0;i<n;i++){const ix=Math.floor((X[i]+3.5)/0.5),iy=Math.floor((Y[i]+3.5)/0.5);if(ix>=0&&ix<14)cx[ix]++;if(iy>=0&&iy<14)cy[iy]++;
      const on=X[i]>=a&&X[i]<a+0.5;if(on)k++;if(D[i])D[i].setAttribute('class',on?'sl-dot sl-c3 sl-hot':'sl-dot sl-c2 sl-tiny');}
    let pm=0;for(let j=0;j<14;j++)pm=Math.max(pm,L.band(-3.5+0.5*j));
    const vm=1.1*Math.max(...cx,...cy,n*pm),sel=Math.round((a+3.5)/0.5);
    for(let j=0;j<14;j++){const e=-3.5+0.5*j;J.topBar(e,e+0.5,cx[j],vm,j===sel?'sl-bar2':'sl-bar');J.rightBar(e,e+0.5,cy[j],vm,'sl-bar');}
    J.topCurve(x=>n*0.5*L.f(x),vm,'sl-c1 sl-dash');J.rightCurve(y=>n*0.5*L.f(y),vm,'sl-c1 sl-dash');
    rd(out,[['points',String(n)],['dans la bande ['+nf(a)+' ; '+nf(a+0.5)+']',k+' · '+pc(n?k/n:0,1),'c3'],['théorie pour cette bande',pc(L.band(a),1)]]);
  }
  buttons(document.getElementById('v2ctl'),LAW.map(l=>l.n),i=>{st.k=i;reset();draw();});
  const c2=document.getElementById('v2ctl2');
  SL.h('button','tb',c2,'+ 300 points').onclick=()=>{fresh();add(300);draw();};
  SL.h('button','tb',c2,'▶ + 3 000 points').onclick=()=>{const tk=fresh();let m=0;loop(tk,()=>{if(X.length>=6200)return false;add(100);m+=100;draw();return m<3000;});};
  SL.h('button','tb',c2,'↺ autre tirage').onclick=()=>{st.seed++;reset();draw();};
  SL.slider(document.getElementById('v2sl'),{label:'bande de x',min:-3.5,max:3,step:0.5,value:0,fmt:v=>nf(v)+' à '+nf(v+0.5)},v=>{st.a=v;draw();});
})();

/* ===== v3 : une bande du nuage à x fixé ===== */
(function(){
  const host=document.getElementById('v3plot'),out=document.getElementById('v3out'),a=0.8,s=0.6,N=3000,H=0.15;
  const J=jointPanel(host,{lim:[-3.5,3.5],size:330,right:110,xl:'x',rl:'y dans la bande'});
  const X=[],Y=[],D=[];let seed=41,x0=1.5;
  function gen(){X.length=0;Y.length=0;D.length=0;while(J.pts.firstChild)J.pts.removeChild(J.pts.firstChild);const r=rng(seed);
    for(let i=0;i<N;i++){const x=gauss(r),y=a*x+s*gauss(r);X.push(x);Y.push(y);
      D.push(Math.abs(x)<3.5&&Math.abs(y)<3.5?SL.el('circle',{cx:J.sx(x).toFixed(1),cy:J.sy(y).toFixed(1),r:2,class:'sl-dot sl-c2 sl-tiny'},J.pts):null);}}
  function draw(){
    J.clear();J.vband(x0-H,x0+H);const c=new Array(28).fill(0);let nb=0,m=0,q=0,ma=0,qa=0;
    for(let i=0;i<N;i++){const on=Math.abs(X[i]-x0)<H;ma+=Y[i];qa+=Y[i]*Y[i];
      if(on){nb++;m+=Y[i];q+=Y[i]*Y[i];const j=Math.floor((Y[i]+3.5)/0.25);if(j>=0&&j<28)c[j]++;}
      if(D[i])D[i].setAttribute('class',on?'sl-dot sl-c3 sl-hot':'sl-dot sl-c2 sl-tiny');}
    for(let j=0;j<28;j++)if(c[j]&&nb)J.rightBar(-3.5+0.25*j,-3.25+0.25*j,c[j]/(nb*0.25),1,'sl-bar2');
    J.rightCurve(y=>phi((y-a*x0)/s)/s,1,'sl-c3 sl-dash');J.rightCurve(phi,1,'sl-c4 sl-dash');
    const mb=nb?m/nb:0,sb=nb>1?Math.sqrt(Math.max(0,q/nb-mb*mb)):0,mA=ma/N;
    rd(out,[['points dans la bande',String(nb)],['moyenne des y (théorie '+fx(a*x0,2)+')',fx(mb,2),'c3'],
      ['écart-type des y (théorie 0,6)',fx(sb,2),'c3'],['écart-type de tous les y (théorie 1)',fx(Math.sqrt(qa/N-mA*mA),2)]]);
  }
  gen();
  SL.slider(document.getElementById('v3sl'),{label:'x fixé',min:-2.5,max:2.5,step:0.1,value:1.5,fmt:v=>fx(v,1)},v=>{x0=v;draw();});
  SL.h('button','tb',document.getElementById('v3ctl'),'↺ autre tirage').onclick=()=>{seed++;gen();draw();};
})();

/* ===== v4 : mélanger les y entre les fléchettes ===== */
(function(){
  const P=SL.plot(document.getElementById('v4plot'),{x:[-3.6,3.6],y:[-3.6,3.6],w:420,h:412,xt:[-3,-2,-1,0,1,2,3],yt:[-3,-2,-1,0,1,2,3],xl:'x'});
  P.svg.querySelector('.sl-grid').style.display='none';
  const cx=P.sx(0),cy=P.sy(0),u1=P.sx(1)-P.sx(0),out=document.getElementById('v4out');
  [0.5,1.5,2,2.5,3,3.4].forEach(R=>SL.el('circle',{cx:cx,cy:cy,r:R*u1,class:'sl-orbit'},P.layer));
  for(let k=0;k<20;k++){const t=2*Math.PI*(k+0.5)/20;SL.el('line',{x1:cx+0.5*u1*Math.cos(t),y1:cy-0.5*u1*Math.sin(t),x2:cx+3.4*u1*Math.cos(t),y2:cy-3.4*u1*Math.sin(t),class:'sl-orbit'},P.layer);}
  SL.el('circle',{cx:cx,cy:cy,r:u1,class:'sl-ring1'},P.layer);
  const g=SL.el('g',{},P.svg),N=400,X=[],Y=[],Ys=[],D=[];
  for(let i=0;i<N;i++)D.push(SL.el('circle',{r:2.6,class:'sl-dot sl-c2 sl-hot'},g));
  const TH=['39,3 / 39,3 %','0 / 8,7 %'];
  let mode=0,seed=47,u=0;const fresh=runner();
  const clamp=v=>Math.max(-3.55,Math.min(3.55,v));
  function gen(){const r=rng(seed+50*mode);X.length=0;Y.length=0;
    for(let i=0;i<N;i++){if(mode===0){X.push(gauss(r));Y.push(gauss(r));}else{const R=2+0.2*gauss(r),t=2*Math.PI*r();X.push(R*Math.cos(t));Y.push(R*Math.sin(t));}}
    const p=[...Array(N).keys()];for(let i=N-1;i>0;i--){const j=Math.floor(r()*(i+1));[p[i],p[j]]=[p[j],p[i]];}
    for(let i=0;i<N;i++)Ys[i]=Y[p[i]];}
  function place(){for(let i=0;i<N;i++){D[i].setAttribute('cx',P.sx(clamp(X[i])).toFixed(1));D[i].setAttribute('cy',P.sy(clamp(Y[i]+(Ys[i]-Y[i])*u)).toFixed(1));}}
  function stats(){let b=0,a=0;for(let i=0;i<N;i++){if(X[i]*X[i]+Y[i]*Y[i]<1)b++;if(X[i]*X[i]+Ys[i]*Ys[i]<1)a++;}
    rd(out,[['fléchettes',String(N)],['dans le cercle r < 1, avant',pc(b/N,1)],['après le mélange des y',pc(a/N,1),'c3'],['théorie, avant / après',TH[mode]]]);}
  const mix=SL.h('button','tb',null,'mélanger les y');
  buttons(document.getElementById('v4ctl'),['viser le centre','viser l’anneau'],k=>{fresh();mode=k;u=0;mix.textContent='mélanger les y';gen();place();stats();});
  const c2=document.getElementById('v4ctl2');c2.appendChild(mix);
  mix.onclick=()=>{const tk=fresh(),a=u,b=u<0.5?1:0;mix.textContent=b?'remettre les y':'mélanger les y';tween(900,t=>{u=a+(b-a)*t;place();},tk);};
  SL.h('button','tb',c2,'↺ autre tirage').onclick=()=>{fresh();seed++;u=0;mix.textContent='mélanger les y';gen();place();stats();};
})();

/* ===== v5 : ce que dit le score, et ce qu'il faut en croire ===== */
(function(){
  const host=document.getElementById('v5plot'),out=document.getElementById('v5out'),XT=[-3,-2,-1,0,1,2,3,4,5];
  const A=SL.plot(SL.h('div','',host),{x:[-3,5.5],y:[0,0.46],w:560,h:200,xt:XT,yt:[0,0.2,0.4],yl:'f(y ∣ classe)'});
  const B=SL.plot(SL.h('div','',host),{x:[-3,5.5],y:[0,1],w:560,h:170,xt:XT,yt:[0,0.5,1],xl:'score y',yl:'P(malade ∣ y)'});
  leftAxis(A,-3);leftAxis(B,-3);
  A.fn(phi,'sl-c4');A.fn(t=>phi(t-2),'sl-c3');
  A.label(5.45,0.42,'│ sains, N(0, 1)','sl-c4','end');A.label(5.45,0.36,'│ malades, N(2, 1)','sl-c3','end');
  const st={p:0.01,y:2},PR=[0.01,0.1,0.5];
  function draw(){
    A.clear();B.clear();const p=st.p,y=st.y,post=t=>{const m=phi(t-2)*p,h=phi(t)*(1-p);return m/(m+h);};
    A.vline(y,'sl-c5');A.dot(y,phi(y),'sl-c4',5);A.dot(y,phi(y-2),'sl-c3',5);
    B.seg(-3,0.5,5.5,0.5,'sl-dash');curve(B,post,-3,5.5,'sl-c3',1);B.vline(y,'sl-c5');B.dot(y,post(y),'sl-c3',5);
    rd(out,[['f(y ∣ malade)',fx(phi(y-2),3)],['f(y ∣ sain)',fx(phi(y),3)],['rapport malade / sain',sig(phi(y-2)/phi(y))],
      ['P(malade ∣ y)',pc(post(y),1),'c3']]);
  }
  buttons(document.getElementById('v5ctl'),['prévalence 1 %','10 %','50 %'],i=>{st.p=PR[i];draw();});
  SL.slider(document.getElementById('v5sl'),{label:'score y',min:-2,max:5,step:0.1,value:2,fmt:v=>fx(v,1)},v=>{st.y=v;draw();});
})();

/* ===== v6 : dense au centre, peuplé sur les anneaux ===== */
(function(){
  const host=document.getElementById('v6plot'),out=document.getElementById('v6out');
  const row=SL.h('div','v-row',host),Lh=SL.h('div','',row),Rh=SL.h('div','',row);
  const A=SL.plot(Lh,{x:[-3.4,3.4],y:[-3.4,3.4],w:300,h:292,xt:[-3,-2,-1,0,1,2,3],yt:[-3,-2,-1,0,1,2,3]});
  A.svg.querySelector('.sl-grid').style.display='none';
  const B=SL.plot(Rh,{x:[0,3.25],y:[0,0.19],w:300,h:292,xt:[0,1,2,3],yt:[0,0.05,0.1,0.15],xl:'distance r au centre',yl:'part des fléchettes'});
  const cx=A.sx(0),cy=A.sy(0),u1=A.sx(1)-A.sx(0);
  [0.5,1,1.5,2,2.5,3].forEach(R=>SL.el('circle',{cx:cx,cy:cy,r:R*u1,class:'sl-orbit'},A.layer));
  const ring=SL.el('path',{class:'sl-band','fill-rule':'evenodd'},A.layer),g=SL.el('g',{},A.svg);
  const circ=R=>`M${(cx+R).toFixed(1)} ${cy.toFixed(1)} A${R.toFixed(1)} ${R.toFixed(1)} 0 1 0 ${(cx-R).toFixed(1)} ${cy.toFixed(1)} A${R.toFixed(1)} ${R.toFixed(1)} 0 1 0 ${(cx+R).toFixed(1)} ${cy.toFixed(1)} Z`;
  const X=[],Y=[],RR=[],D=[];let r=null,seed=5,a0=1;const fresh=runner();
  function add(n){for(let i=0;i<n&&X.length<6000;i++){const x=gauss(r),y=gauss(r);X.push(x);Y.push(y);RR.push(Math.hypot(x,y));
    D.push(Math.abs(x)<3.4&&Math.abs(y)<3.4?SL.el('circle',{cx:A.sx(x).toFixed(1),cy:A.sy(y).toFixed(1),r:1.8,class:'sl-dot sl-c2 sl-tiny'},g):null);}}
  function reset(){fresh();X.length=0;Y.length=0;RR.length=0;D.length=0;while(g.firstChild)g.removeChild(g.firstChild);r=rng(seed);add(1000);}
  function draw(){
    B.clear();const b0=a0+0.25,n=X.length,c=new Array(13).fill(0);let k=0;
    ring.setAttribute('d',circ(b0*u1)+' '+(a0>0?circ(a0*u1):''));
    for(let i=0;i<n;i++){const j=Math.floor(RR[i]/0.25);if(j<13)c[j]++;const on=RR[i]>=a0&&RR[i]<b0;if(on)k++;
      if(D[i])D[i].setAttribute('class',on?'sl-dot sl-c3 sl-hot':'sl-dot sl-c2 sl-tiny');}
    const sel=Math.round(a0/0.25);for(let j=0;j<13;j++)bar(B,0.25*j+0.012,0.25*j+0.238,c[j]/n,j===sel?'sl-bar2':'sl-bar');
    curve(B,t=>0.25*t*Math.exp(-t*t/2),0,3.25,'sl-c1 sl-dash',0.19);
    const th=Math.exp(-a0*a0/2)-Math.exp(-b0*b0/2),ar=Math.PI*(b0*b0-a0*a0);
    rd(out,[['fléchettes',String(n)],['anneau','['+nf(a0)+' ; '+nf(b0)+')'],['part des fléchettes (théorie '+pc(th,1)+')',pc(k/n,1),'c3'],
      ['par unité d’aire (théorie '+fx(th/ar,3)+')',fx(k/n/ar,3)]]);
  }
  const ctl=document.getElementById('v6ctl');
  SL.h('button','tb',ctl,'+ 1 000 fléchettes').onclick=()=>{fresh();add(1000);draw();};
  SL.h('button','tb',ctl,'↺ autre tirage').onclick=()=>{seed++;reset();draw();};
  reset();
  SL.slider(document.getElementById('v6sl'),{label:'anneau',min:0,max:3,step:0.25,value:1,fmt:v=>nf(v)+' à '+nf(v+0.25)},v=>{a0=v;draw();});
})();
