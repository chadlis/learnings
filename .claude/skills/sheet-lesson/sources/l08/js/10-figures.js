/* ===== Figure 1 : dé pipé et point d'appui ===== */
(function(){
  const P=SL.plot(document.getElementById('f1plot'),{x:[0.3,6.7],y:[-0.14,1.1],w:560,h:260,xt:[1,2,3,4,5,6],yt:[0,0.25,0.5,0.75,1],xl:'face x',yl:'P(X = x)'});
  const out=document.getElementById('f1out');
  function draw(w6){
    P.clear();
    const p=[1,2,3,4,5,6].map(x=>x===6?w6:(1-w6)/5);
    let E=0;p.forEach((q,i)=>E+=(i+1)*q);
    p.forEach((q,i)=>bar(P,i+1-0.32,i+1+0.32,q,'sl-bar'));
    const cx=P.sx(E),cy=P.sy(0),cb=P.sy(-0.12);
    SL.el('path',{d:`M${cx.toFixed(1)} ${cy.toFixed(1)} L${(cx-10).toFixed(1)} ${cb.toFixed(1)} L${(cx+10).toFixed(1)} ${cb.toFixed(1)} Z`,class:'sl-fulcrum'},P.dyn);
    P.text(E,1.02,'E[X] = '+SL.fmt(E,2),'sl-c3','middle');
    rd(out,[['P(X = 6)',SL.fmt(w6,2)],['P(chaque autre face)',SL.fmt((1-w6)/5,3)],['E[X], le point d’appui',SL.fmt(E,2),'c3']]);
  }
  SL.slider(document.getElementById('f1ctl'),{label:'poids du 6',min:0.1667,max:0.9,step:0.0033,value:0.1667,fmt:v=>SL.fmt(v,2)},draw);
})();

/* ===== Figure 2 : log-normale, trois centres ===== */
(function(){
  const P=SL.plot(document.getElementById('f2plot'),{x:[0,8],y:[0,1.5],w:560,h:260,xt:[0,1,2,3,4,5,6,7,8],yt:[0,0.5,1,1.5],xl:'x / médiane',yl:'densité'});
  const out=document.getElementById('f2out');
  function draw(s){
    P.clear();
    const f=x=>x<=0?0:Math.exp(-(Math.log(x)**2)/(2*s*s))/(x*s*Math.sqrt(2*Math.PI));
    curve(P,f,0.001,8,'sl-c1',1.5);
    const mode=Math.exp(-s*s),med=1,mean=Math.exp(s*s/2);
    [[mode,'mode','sl-c2',1.4],[med,'médiane','sl-c4',1.27],[mean,'moyenne','sl-c3',1.14]].forEach(m=>{if(m[0]<=8)P.vline(m[0],m[2]);P.text(7.9,m[3],'│ '+m[1],m[2],'end');});
    rd(out,[['mode',SL.fmt(mode,3)],['médiane',SL.fmt(med,2)],['moyenne (= moyenne / médiane)',SL.fmt(mean,2),'c3']]);
  }
  SL.slider(document.getElementById('f2ctl'),{label:'σ de ln X',min:0.3,max:1.9,step:0.01,value:1,fmt:v=>SL.fmt(v,2)},draw);
})();

/* ===== Figure 3 : contributions à la variance ===== */
(function(){
  const laws=[
    {n:'dé',v:[1,2,3,4,5,6],p:[1/6,1/6,1/6,1/6,1/6,1/6]},
    {n:'{1, 3}',v:[1,3],p:[0.5,0.5]},
    {n:'{0, 4}',v:[0,4],p:[0.5,0.5]},
    {n:'Z : 0 ou 10',v:[0,10],p:[0.9,0.1]}];
  const host=document.getElementById('f3plot'),out=document.getElementById('f3out');
  function draw(k){
    const L=laws[k];host.innerHTML='';
    const mu=L.v.reduce((a,x,i)=>a+x*L.p[i],0);
    const c=L.v.map((x,i)=>L.p[i]*(x-mu)**2),V=c.reduce((a,b)=>a+b,0);
    const cmax=Math.max(...c),ym=k===3?9.7:2.4; /* même échelle pour dé, {1, 3}, {0, 4} : le ×4 se voit */
    const P1=SL.plot(SL.h('div','',host),{x:[-0.6,10.6],y:[0,1],w:560,h:170,xt:[0,1,2,3,4,5,6,7,8,9,10],yt:[0,0.5,1]});
    leftAxis(P1,-0.6);
    L.v.forEach((x,i)=>bar(P1,x-0.3,x+0.3,L.p[i],'sl-bar'));
    P1.vline(mu,'sl-mean');P1.text(mu+0.12,0.9,'μ = '+SL.fmt(mu,2),'sl-c3','start');
    const step=ym>4?2:0.5,yt=[];for(let t=0;t<=ym+1e-9;t+=step)yt.push(+t.toFixed(2));
    const P2=SL.plot(SL.h('div','',host),{x:[-0.6,10.6],y:[0,ym],w:560,h:190,xt:[0,1,2,3,4,5,6,7,8,9,10],yt:yt,xl:'x'});
    leftAxis(P2,-0.6);
    L.v.forEach((x,i)=>{bar(P2,x-0.3,x+0.3,c[i],'sl-bar2');if(c[i]>0)P2.text(x,c[i]+ym*0.04,SL.fmt(c[i],2),'','middle');});
    P2.vline(mu,'sl-mean');
    const big=c.indexOf(cmax);
    rd(out,[['μ',SL.fmt(mu,2)],['Var = somme des barres du bas',SL.fmt(V,3),'c3'],['σ',SL.fmt(Math.sqrt(V),3)],['part de la plus haute barre',SL.fmt(100*cmax/V,1)+' %']]);
  }
  buttons(document.getElementById('f3ctl'),laws.map(l=>l.n),draw);
})();

/* ===== Figure 4 : exponentielle ===== */
(function(){
  const P=SL.plot(document.getElementById('f4plot'),{x:[0,3],y:[0,4.2],w:560,h:250,xt:[0,0.5,1,1.5,2,2.5,3],yt:[0,1,2,3,4],xl:'attente t (heures)',yl:'densité'});
  const out=document.getElementById('f4out');
  function draw(l){
    P.clear();
    curve(P,t=>l*Math.exp(-l*t),0,3,'sl-c1',4.2);
    const mean=1/l,med=Math.log(2)/l;
    if(mean<=3)P.vline(mean,'sl-mean');
    if(med<=3)P.vline(med,'sl-c4');
    P.text(2.95,3.9,'│ moyenne','sl-c3','end');P.text(2.95,3.5,'│ médiane','sl-c4','end');
    rd(out,[['E[T] = 1/λ',SL.fmt(mean,3)+' h','c3'],['σ = 1/λ',SL.fmt(mean,3)+' h'],['médiane = ln 2/λ',SL.fmt(med,3)+' h'],['f(0) = λ',SL.fmt(l,2)]]);
  }
  SL.slider(document.getElementById('f4ctl'),{label:'taux λ par h',min:0.5,max:4,step:0.1,value:2,fmt:v=>SL.fmt(v,1)},draw);
})();

/* ===== Figure 5 : aX + b sur un dé ===== */
(function(){
  const P=SL.plot(document.getElementById('f5plot'),{x:[-24,24],y:[0,1.08],w:560,h:240,xt:[-20,-10,0,10,20],yt:[0,0.5,1],xl:'valeur de aX + b',yl:'probabilité'});
  const out=document.getElementById('f5out'),ctl=document.getElementById('f5ctl');
  const st={a:1,b:0},V=35/12;
  function draw(){
    P.clear();
    const m=new Map();for(let x=1;x<=6;x++){const y=st.a*x+st.b;m.set(y,(m.get(y)||0)+1/6);}
    const w=Math.max(0.12,Math.min(0.8,0.8*Math.abs(st.a)));
    m.forEach((q,y)=>bar(P,y-w/2,y+w/2,q,'sl-bar'));
    const E=3.5*st.a+st.b,s=Math.abs(st.a)*Math.sqrt(V);
    P.vline(E,'sl-mean');
    if(s>0)P.seg(E-s,0.95,E+s,0.95,'gain');
    P.text(E+0.8,1.01,'moyenne '+SL.fmt(E,2),'sl-c3','start');
    rd(out,[['E = 3,5a + b',SL.fmt(E,2),'c3'],['Var = a² × 2,917',SL.fmt(st.a*st.a*V,3)],['σ = |a| × 1,708',SL.fmt(s,3)]]);
  }
  SL.slider(ctl,{label:'a (étire)',min:-3,max:3,step:0.25,value:1,fmt:v=>SL.fmt(v,2)},v=>{st.a=v;draw();});
  SL.slider(ctl,{label:'b (décale)',min:-5,max:5,step:1,value:0,fmt:v=>SL.fmt(v,0)},v=>{st.b=v;draw();});
})();

/* ===== Figure 6 : escalier de survie ===== */
(function(){
  const host=document.getElementById('f6plot'),out=document.getElementById('f6out');
  function draw(k){
    host.innerHTML='';
    if(k===0){
      const P=SL.plot(SL.h('div','',host),{x:[0,7],y:[0,1.15],w:560,h:230,xt:[0,1,2,3,4,5,6,7],yt:[0,0.5,1],xl:'k'});
      P.text(6.9,1.06,'marche k : P(X ≥ k)','','end');
      let s=0;for(let j=1;j<=6;j++){const q=(7-j)/6;s+=q;bar(P,j-1+0.02,j-0.02,q,'sl-bar3');P.text(j-0.5,q+0.04,SL.fmt(q,2),'','middle');}
      rd(out,[['somme des marches',SL.fmt(s,3),'c3'],['E[X] d’un dé','3,5']]);
    }else{
      const p=1/6,q=1-p;const P=SL.plot(SL.h('div','',host),{x:[0,30],y:[0,1.15],w:560,h:230,xt:[0,5,10,15,20,25,30],yt:[0,0.5,1],xl:'k'});
      P.text(29.6,1.06,'marche k : P(X ≥ k) = (5/6)ᵏ⁻¹','','end');
      let s=0;for(let j=1;j<=30;j++){const v=Math.pow(q,j-1);s+=v;bar(P,j-1+0.05,j-0.05,v,'sl-bar3');}
      rd(out,[['30 premières marches',SL.fmt(s,3),'c3'],['série complète = 1/p','6']]);
    }
  }
  buttons(document.getElementById('f6ctl'),['dé','géométrique, p = 1/6'],draw);
})();
