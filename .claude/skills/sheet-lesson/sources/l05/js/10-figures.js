/* ===== Figure 1 : la binomiale rejoint la Poisson (portée de p00-01, figure 2) ===== */
(function(){
  const h=document.getElementById('f1plot'),o=document.getElementById('f1out'),st={lam:4,n:1000};
  function draw(){
    const lam=st.lam,n=st.n,p=lam/n,ok=p<=1;h.innerHTML='';
    const kmax=Math.max(8,Math.ceil(lam+4*Math.sqrt(lam)+3));
    const po=[],bi=[];let ymax=0,dmax=0;
    for(let k=0;k<=kmax;k++){const a=poispmf(lam,k),b=ok?binpmf(n,p,k):0;po.push(a);bi.push(b);
      if(a>ymax)ymax=a;if(b>ymax)ymax=b;if(Math.abs(a-b)>dmax)dmax=Math.abs(a-b);}
    const Y=ymax*1.3;
    const P=SL.plot(h,{x:[-0.6,kmax+0.6],y:[0,Y],w:600,h:290,xt:xticks(0,kmax,9),yt:yticks(Y),xl:'k — événements dans l’intervalle',yl:'probabilité'});
    leftAxis(P,-0.6);
    if(ok)bi.forEach((v,k)=>{if(v>1e-5)bar(P,k-0.34,k+0.34,v,'sl-bar');});
    poly(P,po.map((v,k)=>[k,v]),'sl-fn sl-c3');
    po.forEach((v,k)=>{if(v>1e-5)P.dot(k,v,'sl-c3',3.2);});
    P.text(kmax+0.5,Y*0.93,'● Poisson(λ)','sl-c3','end');
    if(ok)P.text(kmax+0.5,Y*0.84,'▮ Binomiale(n, λ/n)','','end');
    rd(o,[['λ = E = Var',SL.fmt(lam,2)],['p = λ/n',ok?SL.fmt(p,4):SL.fmt(p,2)+' > 1',ok?'':'zero'],
      ['écart max, binomiale contre Poisson',ok?fx(dmax,4):'binomiale impossible',!ok?'':(dmax<=0.01?'pos':'zero')]]);
  }
  const c=document.getElementById('f1ctl');
  SL.slider(c,{label:'λ',min:0.5,max:15,step:0.5,value:4},v=>{st.lam=v;draw();});
  SL.slider(c,{label:'n (occasions)',min:20,max:2000,step:10,value:1000,fmt:v=>SL.fmt(v,0)},v=>{st.n=v;draw();});
})();

/* ===== Figure 2 : la loi géométrique et sa queue ===== */
(function(){
  const host=document.getElementById('f2plot'),out=document.getElementById('f2out'),st={p:1/6,k:10};
  function draw(){
    host.innerHTML='';const p=st.p,q=1-p,k=st.k,Y=p*1.32;
    const P=SL.plot(host,{x:[0.3,30.7],y:[0,Y],w:600,h:260,xt:[1,5,10,15,20,25,30],yt:yticks(Y),xl:'k — rang du premier succès',yl:'P(X = k)'});
    for(let j=1;j<=30;j++)bar(P,j-0.36,j+0.36,Math.pow(q,j-1)*p,j>=k?'sl-bar3':'sl-bar');
    P.seg(k-0.5,0,k-0.5,Y*0.86,'sl-dash');
    P.text(30.5,Y*0.92,'▮ violet\u00a0: X < k','sl-c2','end');P.text(30.5,Y*0.82,'▮ bleu\u00a0: la queue X ≥ k','sl-c1','end');
    rd(out,[['P(X = k) = qᵏ⁻¹ p',fx(Math.pow(q,k-1)*p,4)],['P(X ≥ k) = qᵏ⁻¹, la queue',fx(Math.pow(q,k-1),4),'c3'],['E[X] = 1/p',SL.fmt(1/p,2)]]);
  }
  buttons(document.getElementById('f2ctl'),['dé, p = 1/6','p = 1/3','pièce, p = 1/2'],i=>{st.p=[1/6,1/3,1/2][i];draw();});
  SL.slider(document.getElementById('f2sl'),{label:'seuil k',min:1,max:20,step:1,value:10,fmt:v=>String(v)},v=>{st.k=v;draw();});
})();

/* ===== Figure 3 : l'exponentielle et ses aires (portée de p00-01, figure 3) ===== */
(function(){
  const h=document.getElementById('f3plot'),o=document.getElementById('f3out'),XM=90,st={lam:4,a:15,b:30};
  function draw(){
    const r=st.lam/60,a=Math.min(st.a,st.b),b=Math.max(st.a,st.b),inf=Math.max(st.a,st.b)>=XM;h.innerHTML='';
    const Y=r*1.22,f=x=>r*Math.exp(-r*x);
    const P=SL.plot(h,{x:[0,XM],y:[0,Y],w:600,h:280,xt:[0,15,30,45,60,75,90],yt:yticks(Y),xl:'t — minutes depuis le dernier spam',yl:'densité (par minute)'});
    area(P,f,a,inf?XM:b,0,'sl-bar');
    poly(P,sample(f,0,XM,180),'sl-fn sl-c1');
    const E=60/st.lam,med=Math.LN2*60/st.lam;
    P.seg(E,0,E,Y*0.86,'sl-mean');P.seg(med,0,med,Y*0.86,'chord');
    P.text(XM*0.99,Y*0.92,'│ moyenne 1/λ','sl-c3','end');P.text(XM*0.99,Y*0.81,'┆ médiane ln 2/λ','sl-c3','end');
    const pa=Math.exp(-r*a),pb=inf?0:Math.exp(-r*b);
    rd(o,[['E[T] = 1/λ',SL.fmt(E,1)+' min'],['médiane = ln 2/λ',SL.fmt(med,1)+' min'],['P(T &gt; a) = e<sup>−λa</sup>',fx(pa,3)],
      [inf?'P(T &gt; a), b = ∞':'P(a &lt; T &lt; b), aire violette',fx(pa-pb,3),'c3']]);
  }
  const c=document.getElementById('f3ctl');
  SL.slider(c,{label:'λ (par heure)',min:2,max:12,step:0.5,value:4},v=>{st.lam=v;draw();});
  SL.slider(c,{label:'a (minutes)',min:0,max:60,step:1,value:15,fmt:v=>SL.fmt(v,0)},v=>{st.a=v;draw();});
  SL.slider(c,{label:'b (minutes)',min:1,max:90,step:1,value:30,fmt:v=>v>=90?'∞':SL.fmt(v,0)},v=>{st.b=v;draw();});
})();

/* ===== Figure 4 : l'absence de mémoire, bouton « déjà attendu » (portée de p00-01, figure 3) ===== */
(function(){
  const h=document.getElementById('f4plot'),o=document.getElementById('f4out'),XM=90,ATT=15,st={lam:4,t:30,cond:false};
  function draw(){
    const r=st.lam/60,t=st.t;h.innerHTML='';
    const Y=r*1.22,f=x=>r*Math.exp(-r*x);
    const P=SL.plot(h,{x:[0,XM],y:[0,Y],w:600,h:280,xt:[0,15,30,45,60,75,90],yt:yticks(Y),xl:'t — minutes',yl:'densité (par minute)'});
    area(P,f,t,XM,0,'sl-bar');
    poly(P,sample(f,0,XM,180),'sl-fn sl-c1');
    P.dot(t,f(t),'sl-c1',4.5);
    P.text(XM*0.99,Y*0.92,'— densité de T','sl-c1','end');
    let extra=[];
    if(st.cond){
      const g=x=>r*Math.exp(-r*(x-ATT));
      P.seg(ATT,0,ATT,Y*0.86,'sl-c2 sl-dash');
      if(ATT+t<XM)area(P,g,ATT+t,XM,0,'sl-bar2');
      poly(P,sample(g,ATT,XM,150),'sl-fn sl-c2');
      if(ATT+t<=XM)P.dot(ATT+t,g(ATT+t),'sl-c2',4.5);
      P.text(XM*0.99,Y*0.81,'— densité sachant T > 15 min','sl-c2','end');
      extra=[['P(T &gt; 15 + t ∣ T &gt; 15)',fx(Math.exp(-r*t),3),'pos']];
    }
    rd(o,[['P(T &gt; t), aire violette',fx(Math.exp(-r*t),3)]].concat(extra,[['E[T] = 1/λ',SL.fmt(60/st.lam,1)+' min']]));
  }
  const bc=SL.h('button','tb',document.getElementById('f4btn'),'déjà attendu 15 min');bc.setAttribute('aria-pressed','false');
  bc.onclick=()=>{st.cond=!st.cond;bc.setAttribute('aria-pressed',String(st.cond));draw();};
  const c=document.getElementById('f4ctl');
  SL.slider(c,{label:'λ (par heure)',min:2,max:12,step:0.5,value:4},v=>{st.lam=v;draw();});
  SL.slider(c,{label:'t (minutes)',min:0,max:75,step:1,value:30,fmt:v=>SL.fmt(v,0)},v=>{st.t=v;draw();});
})();

/* ===== Figure 5 : zéro mail, un mail, et le facteur 5t ===== */
(function(){
  const host=document.getElementById('f5plot'),out=document.getElementById('f5out'),L=5,XM=1.2,YM=1.12;
  const P=SL.plot(host,{x:[0,XM],y:[0,YM],w:600,h:280,xt:[0,0.2,0.4,0.6,0.8,1,1.2],yt:[0.25,0.5,0.75,1],xl:'t — durée de la fenêtre (minutes)',yl:'probabilité'});
  const p=(k,t)=>Math.pow(L*t,k)*Math.exp(-L*t)/[1,1,2][k],bru=t=>5*Math.exp(-5*t);
  function draw(t){
    P.clear();
    P.seg(0,1,XM,1,'sl-dash');
    curveS(P,bru,0,XM,'sl-c5 sl-dash',YM);
    curve(P,x=>p(2,x),0,XM,'sl-c2',YM);curve(P,x=>p(1,x),0,XM,'sl-c3',YM);curve(P,x=>p(0,x),0,XM,'sl-c1',YM);
    P.seg(t,0,t,Math.min(1,Math.max(p(0,t),p(1,t),p(2,t),Math.min(bru(t),1))+0.06),'sl-dash');
    [['sl-c1',0],['sl-c3',1],['sl-c2',2]].forEach(c=>P.dot(t,p(c[1],t),c[0],4.5));
    if(bru(t)<=YM)P.dot(t,bru(t),'sl-c5',4.5);
    const xr=XM*0.99;
    P.text(xr,0.93,'— 0 mail\u00a0: e⁻⁵ᵗ, la survie de l’attente','sl-c1','end');
    P.text(xr,0.85,'— 1 mail\u00a0: 5t e⁻⁵ᵗ','sl-c3','end');
    P.text(xr,0.77,'— 2 mails\u00a0: (5t)² e⁻⁵ᵗ/2','sl-c2','end');
    P.text(xr,0.69,'┄ Brunton\u00a0: 5 e⁻⁵ᵗ, dépasse 1','sl-c5','end');
    const p0=p(0,t),p1=p(1,t),b=bru(t);
    rd(out,[['P(N(t) = 0) = e<sup>−5t</sup>',fx(p0,4)],['P(N(t) = 1) = 5t e<sup>−5t</sup>',fx(p1,4),'c3'],['rapport P(1)/P(0) = 5t',SL.fmt(5*t,2)],
      ['formule de Brunton, 5 e<sup>−5t</sup>',fx(b,3),b>1?'zero':'']]);
  }
  SL.slider(document.getElementById('f5ctl'),{label:'t (minutes)',min:0.01,max:1.2,step:0.01,value:0.1,fmt:v=>SL.fmt(v,2)},draw);
})();

/* ===== Figure 6 : r attentes contre r fois une attente ===== */
(function(){
  const host=document.getElementById('f6plot'),out=document.getElementById('f6out'),L=5,XM=6;
  function draw(r){
    host.innerHTML='';
    const g=t=>gammapdf(r,L,t),w=t=>(L/r)*Math.exp(-L*t/r);
    let ym=Math.max(g(0),w(0));for(let i=1;i<=300;i++){const t=XM*i/300;ym=Math.max(ym,g(t),w(t));}
    const Y=ym*1.25;
    const P=SL.plot(host,{x:[0,XM],y:[0,Y],w:600,h:270,xt:[0,1,2,3,4,5,6],yt:yticks(Y),xl:'attente du r-ième mail (minutes)',yl:'densité'});
    curve(P,w,0,XM,'sl-c3 sl-dash',Y);curve(P,g,0,XM,'sl-c4',Y);
    P.vline(r/L,'sl-mean');
    P.text(XM*0.99,Y*0.92,'— somme de r attentes, Gamma(r, 5)','sl-c4','end');
    P.text(XM*0.99,Y*0.83,'┄ r fois une seule attente','sl-c3','end');
    P.text(XM*0.99,Y*0.74,'│ moyenne commune r/5','sl-c3','end');
    let pg=0;for(let k=0;k<r;k++)pg+=poispmf(3*L,k);
    rd(out,[['moyenne commune r/λ',SL.fmt(r/L,2)+' min'],['écart-type, somme\u00a0: √r/λ',fx(Math.sqrt(r)/L,2)+' min','c1'],['écart-type, r × W\u00a0: r/λ',fx(r/L,2)+' min','c3'],
      ['P(somme &gt; 3 min)',fx(pg,3),'c1'],['P(r × W &gt; 3 min)',fx(Math.exp(-3*L/r),3),'c3']]);
  }
  SL.slider(document.getElementById('f6ctl'),{label:'r (mails attendus)',min:1,max:10,step:1,value:10,fmt:v=>String(v)},draw);
})();
