/* ===== Figure 1 : la hauteur et l'aire, la densité et sa répartition ===== */
(function(){
  const MU=1.75,SG=0.07,host=document.getElementById('f1plot'),out=document.getElementById('f1out');
  const st={a:1.70,b:1.82,cm:false};
  const f=x=>npdf(x,MU,SG),F=x=>Phi((x-MU)/SG);
  let sA=null,sB=null;
  const ufmt=v=>st.cm?SL.fmt(v*100,1):SL.fmt(v,3);
  function draw(){
    host.innerHTML='';
    const u=st.cm?100:1,ym=st.cm?0.065:6.5;
    const xt=[1.5,1.6,1.7,1.8,1.9,2].map(x=>x*u);
    const P1=SL.plot(SL.h('div','',host),{x:[1.5*u,2*u],y:[0,ym],w:560,h:230,xt:xt,yt:st.cm?[0,0.02,0.04,0.06]:[0,1,2,3,4,5,6],yl:st.cm?'densité f, par cm':'densité f, par m'});
    const g=x=>f(x/u)/u,a=st.a*u,b=st.b*u;
    areaUnder(P1,g,a,b,'sl-area');
    curve(P1,g,1.5*u,2*u,'sl-c1',ym);
    if(!st.cm){P1.seg(1.5,1,2,1,'chord');P1.text(1.995,1.15,'hauteur 1','sl-c3','end');}
    P1.seg(a,0,a,g(a),'sl-c3');P1.seg(b,0,b,g(b),'sl-c3');P1.dot(a,g(a),'sl-c3',5);P1.dot(b,g(b),'sl-c3',5);
    P1.text(2*u-0.002*u,ym*0.9,'│ hauteurs f(a), f(b) : vraisemblances','sl-c3','end');
    P1.text(2*u-0.002*u,ym*0.79,'■ aire : P(a < X ≤ b)','sl-c2','end');
    const P2=SL.plot(SL.h('div','',host),{x:[1.5*u,2*u],y:[0,1.05],w:560,h:180,xt:xt,yt:[0,0.5,1],xl:st.cm?'taille x (cm)':'taille x (m)',yl:'F(x) = P(X ≤ x)'});
    curve(P2,x=>F(x/u),1.5*u,2*u,'sl-c1',1.05);
    const Fa=F(st.a),Fb=F(st.b);
    P2.seg(a,Fa,b,Fa,'sl-dash');P2.seg(b,Fa,b,Fb,'gain');
    P2.dot(a,Fa,'sl-c3',5);P2.dot(b,Fb,'sl-c3',5);
    P2.text(1.505*u,0.78,'┃ F(b) − F(a) : la même probabilité','sl-gn','start');
    const unit=st.cm?' par cm':' par m',d=st.cm?4:2;
    rd(out,[['hauteur f(a), une vraisemblance',fx(g(a),d)+unit],['hauteur f(b), une vraisemblance',fx(g(b),d)+unit],
      ['aire F(b) − F(a), une probabilité',fx(Fb-Fa,4),'c3'],['P(X = a) exactement','0']]);
  }
  const relabel=()=>[sA,sB].forEach((s,i)=>{s.input.parentNode.querySelector('.sl-slab').textContent=(i?'b':'a')+(st.cm?', en cm':', en m');});
  buttons(document.getElementById('f1ctl'),['en mètres','en centimètres'],k=>{st.cm=k===1;if(sA){relabel();sA.set(st.a);sB.set(st.b);}else draw();});
  const sl=document.getElementById('f1sl');
  sA=SL.slider(sl,{label:'a',min:1.55,max:1.95,step:0.005,value:st.a,fmt:ufmt},v=>{st.a=v;if(sB&&st.b<=v+1e-9){sB.set(Math.min(1.95,v+0.005));return;}draw();});
  sB=SL.slider(sl,{label:'b',min:1.55,max:1.95,step:0.005,value:st.b,fmt:ufmt},v=>{st.b=v;if(st.a>=v-1e-9){sA.set(Math.max(1.55,v-0.005));return;}draw();});
  relabel();
})();

/* ===== Figure 2 : la forme d'une binomiale ===== */
(function(){
  const host=document.getElementById('f2plot'),out=document.getElementById('f2out');
  const st={n:12,p:1/6,k:3};let busy=false,sN,sP,sK;
  function draw(){
    if(busy)return;
    const n=st.n,p=st.p,k=Math.min(st.k,n);host.innerHTML='';
    const pm=[];let ym=0,tot=0;for(let j=0;j<=n;j++){const v=binpmf(n,p,j);pm.push(v);tot+=v;if(v>ym)ym=v;}
    const Y=ym*1.3;
    const P=SL.plot(host,{x:[-0.6,n+0.6],y:[0,Y],w:560,h:270,xt:xticks(0,n,10),yt:yticks(Y),xl:'k, nombre de succès',yl:'P(X = k)'});
    leftAxis(P,-0.6);
    pm.forEach((v,j)=>{if(v<1e-6)return;bar(P,j-0.4,j+0.4,v,j===k?'sl-bar2':'sl-bar');});
    const E=n*p,sd=Math.sqrt(n*p*(1-p)),ga=Math.max(-0.6,E-sd),gb=Math.min(n+0.6,E+sd);
    P.seg(ga,ym*1.14,gb,ym*1.14,'gain');P.seg(E,0,E,ym*1.2,'sl-mean');
    if(gb<n*0.7)P.text(gb+0.02*(n+1.2),ym*1.14,'E ± σ','','start');else P.text(ga-0.02*(n+1.2),ym*1.14,'E ± σ','','end');
    rd(out,[['E = np',SL.fmt(E,2)],['σ = √(np(1 − p))',SL.fmt(sd,2)],['P(X = '+k+')',SL.fmt(pm[k],4),'c3'],['somme des barres',SL.fmt(tot,4)]]);
  }
  function preset(n,p,k){busy=true;sN.set(n);sP.set(p);sK.input.max=n;sK.set(k);busy=false;draw();}
  const sl=document.getElementById('f2sl');
  sN=SL.slider(sl,{label:'n (essais)',min:1,max:100,step:1,value:st.n,fmt:v=>String(v)},v=>{st.n=v;if(sK){sK.input.max=v;if(st.k>v)sK.set(v);}draw();});
  sP=SL.slider(sl,{label:'p (succès)',min:0.01,max:0.99,value:st.p,fmt:v=>SL.fmt(v,3)},v=>{st.p=v;draw();});
  sK=SL.slider(sl,{label:'k lu',min:0,max:st.n,step:1,value:st.k,fmt:v=>String(v)},v=>{st.k=v;draw();});
  const pre=[[4,0.5,2],[12,1/6,3],[100,1/6,10]];
  buttons(document.getElementById('f2ctl'),['quatre pièces','douze dés','cent dés'],i=>preset(...pre[i]));
})();

/* ===== Figure 3 : la binomiale et sa normale, n et p libres ===== */
(function(){
  const host=document.getElementById('f3plot'),out=document.getElementById('f3out');
  const st={n:20,p:0.5,z:false};
  function draw(){
    host.innerHTML='';
    const n=st.n,p=st.p,mu=n*p,sd=Math.sqrt(n*p*(1-p));
    const pm=[];let gap=0,ym=0;for(let k=0;k<=n;k++){const v=binpmf(n,p,k);pm.push(v);gap=Math.max(gap,Math.abs(v-npdf(k,mu,sd)));ym=Math.max(ym,v);}
    const below=Phi((0-mu)/sd);
    if(!st.z){
      const x0=mu-4.5*sd,x1=mu+4.5*sd,Y=Math.max(ym,npdf(mu,mu,sd))*1.22;
      const P=SL.plot(host,{x:[x0,x1],y:[0,Y],w:560,h:270,xt:xticks(x0,x1,9),yt:yticks(Y),xl:'k, nombre de succès',yl:'probabilité ou densité'});
      if(x0<0)leftAxis(P,x0);
      pm.forEach((v,k)=>{if(k-0.4<x0||k+0.4>x1||v<1e-7)return;bar(P,k-0.4,k+0.4,v,'sl-bar');});
      if(x0<0)areaUnder(P,x=>npdf(x,mu,sd),x0,0,'sl-area2');
      curve(P,x=>npdf(x,mu,sd),x0,x1,'sl-c1',Y);
      P.text(x1-(x1-x0)*0.01,Y*0.93,'▮ binomiale exacte','sl-c2','end');
      P.text(x1-(x1-x0)*0.01,Y*0.83,'— normale N(np, np(1 − p))','sl-c1','end');
      if(x0<0)P.text(x1-(x1-x0)*0.01,Y*0.73,'■ masse normale sous 0','sl-c3','end');
    }else{
      const Y=0.62;
      const P=SL.plot(host,{x:[-4.5,4.5],y:[0,Y],w:560,h:270,xt:[-4,-3,-2,-1,0,1,2,3,4],yt:[0,0.1,0.2,0.3,0.4,0.5,0.6],xl:'z = (k − np)/σ',yl:'σ · P(X = k), et φ(z)'});
      leftAxis(P,-4.5);
      const hw=0.4/sd;
      pm.forEach((v,k)=>{const z=(k-mu)/sd;if(z-hw<-4.5||z+hw>4.5||v<1e-7)return;bar(P,z-hw,z+hw,Math.min(v*sd,Y),'sl-bar');});
      curve(P,phi,-4.5,4.5,'sl-c1',Y);
      P.text(4.45,Y*0.93,'▮ barres centrées réduites','sl-c2','end');
      P.text(4.45,Y*0.83,'— φ(z), la courbe de N(0, 1), fixe','sl-c1','end');
    }
    rd(out,[['μ = np',SL.fmt(mu,2)],['σ = √(np(1 − p))',SL.fmt(sd,2)],['écart maximal |P(X = k) − f(k)|',SL.fmt(gap,4),'c3'],['masse normale sous 0',SL.fmt(100*below,1)+' %']]);
  }
  buttons(document.getElementById('f3ctl'),['lecture en k','lecture centrée réduite'],k=>{st.z=k===1;draw();});
  const sl=document.getElementById('f3sl');
  SL.slider(sl,{label:'n (essais)',min:1,max:200,step:1,value:st.n,fmt:v=>String(v)},v=>{st.n=v;draw();});
  SL.slider(sl,{label:'p (succès)',min:0.01,max:0.99,step:0.01,value:st.p,fmt:v=>SL.fmt(v,2)},v=>{st.p=v;draw();});
})();

/* ===== Figure 4 : la bande μ ± kσ ne dépend que de k ===== */
(function(){
  const MU=200,host=document.getElementById('f4plot'),out=document.getElementById('f4out');
  const st={k:1,s:10};
  function draw(){
    host.innerHTML='';
    const k=st.k,s=st.s,a=MU-k*s,b=MU+k*s,f=x=>npdf(x,MU,s),F=x=>Phi((x-MU)/s);
    const xt=[140,160,180,200,220,240,260];
    const P1=SL.plot(SL.h('div','',host),{x:[130,270],y:[0,0.088],w:560,h:220,xt:xt,yt:[0,0.02,0.04,0.06,0.08],yl:'densité de N(200 ; σ²)'});
    areaUnder(P1,f,Math.max(130,a),Math.min(270,b),'sl-area');
    curve(P1,f,130,270,'sl-c1',0.088);
    P1.vline(MU,'sl-mean');
    P1.text(268,0.079,'■ bande μ ± kσ','sl-c2','end');
    const P2=SL.plot(SL.h('div','',host),{x:[130,270],y:[0,1.05],w:560,h:180,xt:xt,yt:[0,0.5,1],xl:'x',yl:'F(x) = Φ((x − 200)/σ)'});
    curve(P2,F,130,270,'sl-c1',1.05);
    const Fa=F(a),Fb=F(b);
    if(a>=130&&b<=270){P2.seg(a,Fa,b,Fa,'sl-dash');P2.seg(b,Fa,b,Fb,'gain');P2.dot(a,Fa,'sl-c3',5);P2.dot(b,Fb,'sl-c3',5);}
    P2.text(132,0.78,'┃ F(b) − F(a) : l’aire de la bande','sl-gn','start');
    rd(out,[['bande μ ± kσ',SL.fmt(a,1)+' – '+SL.fmt(b,1)],['F(a) et F(b)',SL.fmt(Fa,4)+' et '+SL.fmt(Fb,4)],['aire de la bande, 2Φ(k) − 1',SL.fmt(100*(2*Phi(k)-1),1)+' %','c3']]);
  }
  const sl=document.getElementById('f4sl');
  SL.slider(sl,{label:'k (en σ)',min:0.5,max:3,step:0.05,value:st.k,fmt:v=>SL.fmt(v,2)},v=>{st.k=v;draw();});
  SL.slider(sl,{label:'σ',min:5,max:20,step:0.5,value:st.s,fmt:v=>SL.fmt(v,1)},v=>{st.s=v;draw();});
})();
