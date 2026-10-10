/* ===== v1 : la règle qui penche ===== */
(function(){
  const V=[1,2,6],Q=[0.5,0.3,0.2],E=2.3;
  const ctl=document.getElementById('v1ctl'),out=document.getElementById('v1out');
  const P=SL.plot(document.getElementById('v1plot'),{x:[0,7],y:[-0.3,1],w:560,h:260,xt:[0,1,2,3,4,5,6,7],yt:[],xl:'position x'});
  const fresh=runner();let samp=null,sl=null;
  function draw(c){
    P.clear();
    const cx=P.sx(c),cy=P.sy(0.42),net=E-c,th=8*Math.tanh(net/1.0);
    const g=SL.el('g',{transform:`rotate(${th.toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})`},P.dyn);
    SL.el('rect',{x:P.sx(0.3).toFixed(1),y:(cy-5).toFixed(1),width:(P.sx(6.7)-P.sx(0.3)).toFixed(1),height:5,class:'sl-ruler'},g);
    V.forEach((x,i)=>{const r=34*Math.sqrt(Q[i]);SL.el('circle',{cx:P.sx(x).toFixed(1),cy:(cy-5-r).toFixed(1),r:r.toFixed(1),class:'sl-mass'},g);
      const t=SL.el('text',{x:P.sx(x).toFixed(1),y:(cy-1-r).toFixed(1),'text-anchor':'middle',class:'sl-mass-t'},g);t.textContent=SL.fmt(Q[i],1);});
    SL.el('path',{d:`M${cx.toFixed(1)} ${cy.toFixed(1)} L${(cx-10).toFixed(1)} ${(cy+22).toFixed(1)} L${(cx+10).toFixed(1)} ${(cy+22).toFixed(1)} Z`,class:'sl-fulcrum'},P.dyn);
    let L=0,R=0;V.forEach((x,i)=>{if(x<c)L+=(c-x)*Q[i];else R+=(x-c)*Q[i];});
    const a=Math.abs(net),state=a<0.03?'équilibre':a<0.25?'presque à l’équilibre':net>0?'penche à droite':'penche à gauche';
    P.text(6.95,0.92,state,a<0.25?'sl-c1':'sl-c3','end');
    rd(out,[['doigt c',SL.fmt(c,2)],['masse × bras, à gauche',SL.fmt(L,2)],['masse × bras, à droite',SL.fmt(R,2)],
      samp?['moyenne de '+samp.n+' tirages',SL.fmt(samp.m,2),'c1']:['tirages','aucun']]);
  }
  sl=SL.slider(ctl,{label:'doigt c',min:0.5,max:6.5,step:0.01,value:4,fmt:v=>SL.fmt(v,2)},draw);
  sl.input.addEventListener('input',()=>{fresh();samp=null;draw(sl.get());});
  const b=SL.h('button','tb',SL.h('div','sl-ctl',ctl),'▶ tirer 1 000 valeurs');let seed=11;
  b.onclick=()=>{const tk=fresh(),r=rng(seed++);let n=0,s=0;samp={n:0,m:sl.get()};
    loop(tk,()=>{const k=n<30?1:n<120?3:8;for(let j=0;j<k&&n<1000;j++){s+=pick(r,V,Q);n++;}samp={n:n,m:s/n};sl.set(Math.min(6.5,Math.max(0.5,s/n)));return n<1000;});};
})();

/* ===== v2 : deux contre-exemples, un point par individu ===== */
(function(){
  const one=[2.74,3.29,3.59,3.81,3.99,4.15,4.29,4.42,4.55,4.66,4.78,4.89,5.00,5.11,5.22,5.34,5.45,5.58,5.71,5.85,6.01,6.19,6.41,6.71,7.26];
  const two=[1.05,1.37,1.55,1.70,1.82,1.94,2.06,2.18,2.30,2.45,2.63,2.95,7.05,7.37,7.55,7.70,7.82,7.94,8.06,8.18,8.30,8.45,8.63,8.95];
  const w=[0.36,0.46,0.53,0.58,0.63,0.68,0.72,0.77,0.81,0.86,0.90,0.95,1.00,1.05,1.11,1.17,1.23,1.30,1.38,1.47,1.58,1.72,1.90,2.18,2.79],F=[11,13.5,16,18.5];
  const host=document.getElementById('v2plot'),out=document.getElementById('v2out'),sdiv=document.getElementById('v2sl');
  const st={m:0,f:0};
  function draw(){
    host.innerHTML='';
    const wealth=st.m===2,vals=st.m===0?one:st.m===1?two:w.concat(F.slice(0,st.f));
    const X=wealth?[0,21]:[0,10],bw=0.5;
    const P=SL.plot(host,{x:X,y:[-0.22,1],w:560,h:230,xt:wealth?[0,2,4,6,8,10,12,14,16,18,20]:[0,1,2,3,4,5,6,7,8,9,10],yt:[],xl:wealth?'patrimoine / médiane de départ':'x'});
    const n=vals.length,ord=vals.map((v,i)=>i).sort((a,b)=>vals[a]-vals[b]);
    const mids=n%2?[ord[(n-1)/2]]:[ord[n/2-1],ord[n/2]];
    const mean=vals.reduce((a,b)=>a+b,0)/n,med=median(vals);
    const bins=stack(P,vals,bw,4.6,i=>mids.includes(i)?'sl-c4':'sl-c2',true);
    let top=0;bins.forEach(b=>top=Math.max(top,b.ids.length));
    const modes=bins.filter(b=>b.ids.length===top).map(b=>b.c).sort((a,b)=>a-b);
    modes.forEach(x=>P.text(x,0,'▾','sl-c2','middle').setAttribute('y',(P.sy(0)-top*10.2-6).toFixed(1)));
    P.vline(mean,'sl-mean');P.vline(med,'sl-c4 sl-dash');fulcrum(P,mean); /* médiane par-dessus : ses tirets restent visibles quand elle coïncide avec la moyenne */
    const xr=X[1]-(X[1]-X[0])*0.01;
    P.text(xr,0.93,'│ moyenne, point d’équilibre','sl-c3','end');P.text(xr,0.82,'┆ médiane, coupe les individus en deux','sl-c4','end');P.text(xr,0.71,'▾ mode, la pile la plus haute','sl-c2','end');
    rd(out,[['moyenne',SL.fmt(mean,2),'c3'],['médiane',SL.fmt(med,2)],['mode',modes.length>1?modes.map(x=>'≈ '+SL.fmt(x,1)).join(' et '):'≈ '+SL.fmt(modes[0],1)],['moyenne / médiane',SL.fmt(mean/med,2)]]);
  }
  const s=SL.slider(sdiv,{label:'fortunes',min:0,max:4,step:1,value:0,fmt:v=>String(v)},v=>{st.f=v;if(st.m===2)draw();});
  buttons(document.getElementById('v2ctl'),['une bosse','deux bosses','patrimoine'],k=>{st.m=k;sdiv.style.display=k===2?'':'none';draw();});
})();

/* ===== v3 : la dépendance change la forme de X + Y, pas son centre ===== */
(function(){
  const out=document.getElementById('v3out'),ctl=document.getElementById('v3ctl');
  const P=SL.plot(document.getElementById('v3plot'),{x:[1.3,12.7],y:[-0.12,1.06],w:560,h:240,xt:[2,3,4,5,6,7,8,9,10,11,12],yt:[0,0.5,1],xl:'x + y',yl:'P(X + Y = s)'});
  const M=[{p:s=>(6-Math.abs(s-7))/36,f:'triangle',y:x=>0},{p:s=>s%2===0?1/6:0,f:'6 barres paires',y:x=>x},{p:s=>s===7?1:0,f:'une barre en 7',y:x=>7-x}];
  const S=[2,3,4,5,6,7,8,9,10,11,12];let cur=S.map(s=>M[0].p(s)),mode=0,samp=null;const fresh=runner();
  function draw(h){
    P.clear();S.forEach((s,i)=>bar(P,s-0.34,s+0.34,h[i],'sl-bar'));
    P.vline(7,'sl-mean');fulcrum(P,7);P.text(12.6,0.97,'│ E[X + Y] = 3,5 + 3,5 = 7','sl-c3','end');
    if(samp)P.dot(samp.m,0,'sl-c4',6);
    rd(out,[['E[X], E[Y]','3,5 et 3,5'],['forme de la loi de X + Y',M[mode].f],['E[X + Y], centre de masse','7','c3'],samp?['moyenne de '+samp.n+' sommes',SL.fmt(samp.m,2),'c1']:['sommes tirées','aucune']]);
  }
  buttons(ctl,['indépendants','Y = X','Y = 7 − X'],k=>{const tk=fresh(),a=cur.slice(),b=S.map(s=>M[k].p(s));mode=k;samp=null;
    tween(500,u=>{cur=a.map((x,i)=>x+(b[i]-x)*u);draw(cur);},tk);});
  let seed=5;const go=SL.h('button','tb',ctl,'▶ lancer 300 couples');
  go.onclick=()=>{const tk=fresh(),r=rng(seed++);let n=0,s=0;cur=S.map(s=>M[mode].p(s));
    loop(tk,()=>{const k=n<30?1:6;for(let j=0;j<k&&n<300;j++){const x=1+Math.floor(6*r()),y=mode===0?1+Math.floor(6*r()):M[mode].y(x);s+=x+y;n++;}samp={n:n,m:s/n};draw(cur);return n<300;});};
})();

/* ===== v4 : la moyenne des produits, case par case ===== */
(function(){
  const out=document.getElementById('v4out');
  const P=SL.plot(document.getElementById('v4plot'),{x:[0.5,6.5],y:[0.5,6.5],w:560,h:300,xt:[1,2,3,4,5,6],yt:[1,2,3,4,5,6],xl:'x en colonne, y en ligne'});
  const M=[(x,y)=>1/36,(x,y)=>x===y?1/6:0,(x,y)=>x+y===7?1/6:0];
  const lab=['0','+2,92','−2,92'];
  let cur=[];for(let x=1;x<=6;x++)for(let y=1;y<=6;y++)cur.push(1/36);const fresh=runner();
  function draw(p,k){
    P.clear();let E=0,i=0;
    for(let x=1;x<=6;x++)for(let y=1;y<=6;y++,i++){const q=p[i];E+=x*y*q;
      rect(P,x-0.47,x+0.47,y-0.47,y+0.47,'sl-cello');
      if(q>1e-4)rect(P,x-0.47,x+0.47,y-0.47,y+0.47,'sl-cellp').setAttribute('fill-opacity',(0.1+3.9*q).toFixed(3));
      const t=P.text(x,y-0.14,String(x*y),'sl-prod'+(q>0.02?' on':''),'middle');}
    rd(out,[['E[XY], moyenne pondérée des produits',SL.fmt(E,2),'c3'],['E[X] · E[Y]','3,5 × 3,5 = 12,25'],['écart, la covariance (l09)',lab[k]]]);
  }
  buttons(document.getElementById('v4ctl'),['indépendants','Y = X','Y = 7 − X'],k=>{const tk=fresh(),a=cur.slice(),b=[];
    for(let x=1;x<=6;x++)for(let y=1;y<=6;y++)b.push(M[k](x,y));
    tween(450,u=>{cur=a.map((v,i)=>v+(b[i]-v)*u);draw(cur,k);},tk);});
})();

/* ===== v5 : LOTUS, on garde les masses et on déplace les valeurs ===== */
(function(){
  const host=document.getElementById('v5plot'),out=document.getElementById('v5out');host.classList.add('nogrid');
  const G=[{n:'g(x) = x²',g:x=>x*x,r:[-1,37],t:[0,5,10,15,20,25,30,35]},{n:'g(x) = 2x + 1',g:x=>2*x+1,r:[0,14],t:[0,2,4,6,8,10,12,14]},{n:'g(x) = (x − 3,5)²',g:x=>(x-3.5)**2,r:[-0.5,7],t:[0,1,2,3,4,5,6,7]}];
  const fresh=runner();let first=true;
  function show(k){
    const tk=fresh(),L=G[k];host.innerHTML='';
    const P=SL.plot(host,{x:L.r,y:[-0.17,1.2],w:560,h:250,xt:L.t,yt:[],xl:'g(x)'});
    const ax=P.svg.querySelectorAll('line.sl-axis');if(ax[1])ax[1].remove();
    const ml=44,W=560,tx=x=>ml+(x-0.5)/6*(W-ml-14),ty=P.sy(0.95),by=P.sy(0);
    SL.el('line',{x1:ml,x2:W-14,y1:ty.toFixed(1),y2:ty.toFixed(1),class:'sl-axis'},P.layer);
    for(let x=1;x<=6;x++){const t=SL.el('text',{x:tx(x).toFixed(1),y:(ty+16).toFixed(1),'text-anchor':'middle',class:'sl-tick'},P.layer);t.textContent=String(x);}
    SL.el('text',{x:ml+2,y:(ty-26).toFixed(1),class:'sl-lbl'},P.layer).textContent='X, six masses de ⅙';
    SL.el('text',{x:W-14,y:(by+13).toFixed(1),'text-anchor':'end',class:'sl-lbl'},P.layer).textContent='g(X), les mêmes masses';
    const E=[1,2,3,4,5,6].reduce((a,x)=>a+L.g(x)/6,0),gE=L.g(3.5);
    function frame(u){
      P.clear();
      for(let x=1;x<=6;x++){const x0=tx(x),y0=ty-10,x1=P.sx(L.g(x)),y1=by-10,cx=x0+(x1-x0)*u,cy=y0+(y1-y0)*u;
        SL.el('line',{x1:x0.toFixed(1),y1:y0.toFixed(1),x2:cx.toFixed(1),y2:cy.toFixed(1),class:'sl-seg sl-link'},P.dyn);
        SL.el('circle',{cx:cx.toFixed(1),cy:cy.toFixed(1),r:10,class:'sl-mass'},P.dyn);
        const t=SL.el('text',{x:cx.toFixed(1),y:(cy+4).toFixed(1),'text-anchor':'middle',class:'sl-mass-t'},P.dyn);t.textContent='⅙';}
      if(u>=1){
        const grp=new Map();for(let x=1;x<=6;x++){const v=+L.g(x).toFixed(6);grp.set(v,(grp.get(v)||0)+1);}
        grp.forEach((c,v)=>{if(c>1)P.text(v,0,c+'/6','sl-c2','middle').setAttribute('y',(by-26).toFixed(1));});
        const same=Math.abs(E-gE)<1e-9,dx=(L.r[1]-L.r[0])*0.012,yl=(P.sy(0.42)-6).toFixed(1);
        if(!same)P.seg(gE,0,gE,0.42,'sl-c4 sl-dash');
        P.seg(E,0,E,0.42,'sl-mean');fulcrum(P,E);
        P.dot(gE,0,'hollow sl-c4',6);
        P.text(same?E:E+(E>gE?dx:-dx),0,'E[g(X)] = '+SL.fmt(E,2)+(same?' = g(E[X])':''),'sl-c3',same?'middle':(E>gE?'start':'end')).setAttribute('y',yl);
        if(!same)P.text(gE+(E>gE?-dx:dx),0,'g(E[X]) = '+SL.fmt(gE,2),'sl-c4',E>gE?'end':'start').setAttribute('y',yl);
      }
    }
    if(first){first=false;frame(1);}else{frame(0);tween(1100,frame,tk);}
    rd(out,[['E[g(X)] = Σ g(x) · ⅙',SL.fmt(E,3),'c3'],['g(E[X]) = g(3,5)',SL.fmt(gE,3)],['écart',SL.fmt(E-gE,3)]]);
  }
  buttons(document.getElementById('v5ctl'),G.map(g=>g.n),show);
})();

/* ===== v6 : carrés des écarts et bâton qui tourne ===== */
(function(){
  const host=document.getElementById('v6plot'),out=document.getElementById('v6out');
  const row=SL.h('div','v-row',host),left=SL.h('div','wide',row),right=SL.h('div','v-mini',row);
  const P=SL.plot(left,{x:[-0.5,4.5],y:[-0.25,2.35],w:560,h:311,xt:[0,1,2,3,4],yt:[],xl:'x'});
  P.svg.style.minWidth='440px'; /* comme les autres tracés : défile sur mobile plutôt que de réduire les graduations à 7 px */
  leftAxis(P,-0.5);
  const S=SL.el('svg',{viewBox:'0 0 220 236',class:'sl-plot sl-mini'},right);
  const orbit=SL.el('circle',{cx:110,cy:110,r:45,class:'sl-orbit'},S),stick=SL.el('line',{class:'sl-stick'},S);
  const ms=[SL.el('circle',{r:9,class:'sl-mass'},S),SL.el('circle',{r:9,class:'sl-mass'},S)];
  const vs=[SL.el('line',{class:'sl-seg sl-arrow sl-c3','marker-end':'url(#sl-ah)'},S),SL.el('line',{class:'sl-seg sl-arrow sl-c3','marker-end':'url(#sl-ah)'},S)];
  SL.el('circle',{cx:110,cy:110,r:4,class:'sl-dot sl-c1'},S);
  const cap=SL.el('text',{x:110,y:232,'text-anchor':'middle',class:'sl-lbl'},S);cap.textContent='vitesse ∝ d, énergie ∝ d²';
  let d=1,phi=0.6;
  function stickAt(){const R=45*d,c=Math.cos(phi),s=Math.sin(phi),rm=Math.min(9,0.4*R);orbit.setAttribute('r',R);
    stick.setAttribute('x1',110-R*c);stick.setAttribute('y1',110-R*s);stick.setAttribute('x2',110+R*c);stick.setAttribute('y2',110+R*s);
    [1,-1].forEach((g,i)=>{const x=110+g*R*c,y=110+g*R*s;ms[i].setAttribute('cx',x);ms[i].setAttribute('cy',y);ms[i].setAttribute('r',rm);const L=0.5*R;
      vs[i].setAttribute('x1',x);vs[i].setAttribute('y1',y);vs[i].setAttribute('x2',x-g*L*s);vs[i].setAttribute('y2',y+g*L*c);});}
  function draw(v){
    d=v;P.clear();const mu=2,xs=[mu-d,mu+d];
    xs.forEach(x=>{rect(P,Math.min(x,mu),Math.max(x,mu),0,d,'sl-sq');if(d>=0.5)P.text((x+mu)/2,d/2-0.06,SL.fmt(d*d,2),'sl-sq-t','middle');});
    P.vline(mu,'sl-mean');P.text(mu+0.06,2.2,'μ = 2','sl-c3','start');
    xs.forEach(x=>SL.el('circle',{cx:P.sx(x).toFixed(1),cy:P.sy(0).toFixed(1),r:12,class:'sl-mass'},P.dyn));
    xs.forEach(x=>{const t=SL.el('text',{x:P.sx(x).toFixed(1),y:(P.sy(0)+4).toFixed(1),'text-anchor':'middle',class:'sl-mass-t'},P.dyn);t.textContent='½';});
    stickAt();
    rd(out,[['les deux valeurs',SL.fmt(mu-d,2)+' et '+SL.fmt(mu+d,2)],['carré de chaque écart',SL.fmt(d*d,4)],['Var, aire moyenne des carrés',SL.fmt(d*d,4),'c3'],['inertie du bâton, Σ p · d²',SL.fmt(d*d,4)]]);
  }
  SL.slider(document.getElementById('v6ctl'),{label:'écart d',min:0.25,max:2,step:0.25,value:1,fmt:v=>SL.fmt(v,2)},draw);
  if(!SL.reduced){let on=false,last=0;const tick=t=>{if(!on)return;if(last)phi+=(t-last)/1000*1.1;last=t;stickAt();requestAnimationFrame(tick);};
    new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!on){on=true;last=0;requestAnimationFrame(tick);}else if(!e.isIntersecting)on=false;})).observe(host);}
})();

/* ===== v7 : la puissance k et la masse lointaine ===== */
(function(){
  const laws=[{n:'{1, 3}, symétrique',v:[1,3],p:[0.5,0.5]},{n:'Z : 0 ou 10',v:[0,10],p:[0.9,0.1]}];
  const out=document.getElementById('v7out');
  const P=SL.plot(document.getElementById('v7plot'),{x:[-1,11],y:[-1.3,1.3],w:560,h:250,xt:[0,1,2,3,4,5,6,7,8,9,10],yt:[-1,0,1],xl:'x'});
  leftAxis(P,-1);const st={l:0,k:1};
  function draw(){
    P.clear();const L=laws[st.l],k=st.k,mu=L.v.reduce((a,x,i)=>a+x*L.p[i],0);
    const c=L.v.map((x,i)=>L.p[i]*Math.pow(x-mu,k)),A=c.map(Math.abs),M=Math.max(...A),tot=c.reduce((a,b)=>a+b,0);
    L.v.forEach((x,i)=>{const h=c[i]/M;rect(P,x-0.32,x+0.32,0,h,'sl-bar');P.text(x,h>=0?h+0.07:h-0.16,SL.fmt(c[i],2),'','middle');});
    P.vline(mu,'sl-mean');P.text(mu-0.15,1.17,'μ = '+SL.fmt(mu,2),'sl-c3','end');
    const far=L.v.map(x=>Math.abs(x-mu)),j=far.indexOf(Math.max(...far)),share=100*A[j]/A.reduce((a,b)=>a+b,0);
    rd(out,[['moment centré d’ordre '+k,SL.fmt(tot,2),'c3'],['poids de x = '+L.v[j]+' dans Σ |barres|',SL.fmt(share,1)+' %'],['signe des écarts, k '+(k%2?'impair':'pair'),k%2?'gardé':'effacé']]);
  }
  buttons(document.getElementById('v7ctl'),laws.map(l=>l.n),i=>{st.l=i;draw();});
  SL.slider(document.getElementById('v7sl'),{label:'puissance k',min:1,max:4,step:1,value:1,fmt:v=>String(v)},v=>{st.k=v;draw();});
})();

/* ===== v8 : huit heures de spams à 4 par heure ===== */
(function(){
  const host=document.getElementById('v8plot'),out=document.getElementById('v8out'),lam=4,H=8;
  const P1=SL.plot(SL.h('div','',host),{x:[0,8],y:[0,1],w:560,h:78,xt:[0,1,2,3,4,5,6,7,8],yt:[],xl:'heure d’arrivée'});
  const P2=SL.plot(SL.h('div','',host),{x:[0,75],y:[0,1],w:560,h:165,xt:[0,15,30,45,60,75],yt:[],xl:'attente entre deux spams, en minutes'});
  const fresh=runner();let seed=4;
  function gen(r){const t=[];let s=0;for(;;){s+=-Math.log(1-r())/lam;if(s>H)break;t.push(s);}return t;}
  function draw(T,upto){
    P1.clear();P2.clear();const seen=T.filter(t=>t<=upto),w=seen.map((t,i)=>60*(t-(i?seen[i-1]:0)));
    seen.forEach(t=>P1.dot(t,0.42,'sl-c1',3.6));if(upto<H)P1.vline(upto,'sl-c5');
    stack(P2,w.map(x=>Math.min(x,74.9)),2.5,4.6,()=>'sl-c2');
    if(w.length>1){const m=w.reduce((a,b)=>a+b,0)/w.length,md=median(w),sh=100*w.filter(x=>x<m).length/w.length;
      P2.vline(m,'sl-mean');P2.vline(md,'sl-c4 sl-dash');P2.text(74,0.9,'│ moyenne','sl-c3','end');P2.text(74,0.78,'┆ médiane','sl-c4','end');
      rd(out,[['spams reçus',String(w.length)],['attente moyenne (théorie 15)',SL.fmt(m,1)+' min','c3'],['médiane (théorie 10,4)',SL.fmt(md,1)+' min'],['attentes sous la moyenne (théorie 63 %)',SL.fmt(sh,0)+' %']]);}
    else rd(out,[['spams reçus',String(w.length)]]);
  }
  let T=gen(rng(seed));draw(T,H);
  SL.h('button','tb',document.getElementById('v8ctl'),'▶ une nouvelle journée').onclick=()=>{const tk=fresh();T=gen(rng(++seed));
    if(SL.reduced){draw(T,H);return;}const t0=performance.now();loop(tk,()=>{const u=Math.min(1,(performance.now()-t0)/4000);draw(T,u*H);return u<1;});};
})();

/* ===== v9 : décaler ne touche aucun écart, étirer les multiplie ===== */
(function(){
  const out=document.getElementById('v9out'),C=[10,15,20],S=[[1,0],[1,32],[1.8,0],[1.8,32]];
  const P=SL.plot(document.getElementById('v9plot'),{x:[0,72],y:[-3,17.08],w:560,h:190,xt:[0,10,20,30,40,50,60,70],yt:[],xl:'température'});
  let cur=[1,0];const fresh=runner();
  function draw(a,b){
    P.clear();const xs=C.map(c=>a*c+b),mu=15*a+b,dv=5*a;
    xs.forEach(x=>{const s=Math.abs(x-mu);if(s>0.01){rect(P,Math.min(x,mu),Math.max(x,mu),0,s,'sl-sq');P.text((x+mu)/2,s/2-0.9,SL.fmt(s*s,1),'sl-sq-t','middle');}});
    P.vline(mu,'sl-mean');fulcrum(P,mu);
    xs.forEach(x=>{P.dot(x,0,'sl-c2',5);if(Math.abs(x-mu)>0.01)P.text(x,Math.abs(x-mu)+0.9,SL.fmt(x,1),'','middle');});
    rd(out,[['valeurs',xs.map(x=>SL.fmt(x,1)).join('\u202f; ')],['écarts à la moyenne','−'+SL.fmt(dv,1)+' ; 0 ; +'+SL.fmt(dv,1)],[Math.abs(a-1)<1e-9?'Var, aire moyenne des carrés':'Var, aire moyenne des carrés = 16,67 × '+SL.fmt(a*a,2),SL.fmt(a*a*50/3,2),'c3'],['σ',SL.fmt(a*Math.sqrt(50/3),2)]]);
  }
  buttons(document.getElementById('v9ctl'),['°C','+ 32 : décaler','× 1,8 : étirer','× 1,8 + 32 : °F'],k=>{const tk=fresh(),a0=cur.slice(),a1=S[k];
    tween(700,u=>{cur=[a0[0]+(a1[0]-a0[0])*u,a0[1]+(a1[1]-a0[1])*u];draw(cur[0],cur[1]);},tk);});
})();

/* ===== v10 : l'énergie d'un gaz, composante par composante ===== */
(function(){
  const host=document.getElementById('v10plot'),out=document.getElementById('v10out'),sg=1.3,r=rng(21);
  const row=SL.h('div','v-row',host),L=SL.h('div','',row),R=SL.h('div','',row);
  const A=SL.plot(L,{x:[-4.4,4.4],y:[-4.4,4.4],w:300,h:292,xt:[-4,-2,0,2,4],yt:[-4,-2,0,2,4],xl:'Vx',yl:'Vy'});
  const B=SL.plot(R,{x:[0.4,4.6],y:[-0.9,6.3],w:300,h:292,xt:[],yt:[0,1,2,3,4,5,6],yl:'moyenne'});
  const pts=SL.el('g',{},A.layer),vx=[],vy=[],vz=[];const fresh=runner();
  function add(n){for(let i=0;i<n;i++){const a=sg*gauss(r),b=sg*gauss(r),c=sg*gauss(r);vx.push(a);vy.push(b);vz.push(c);
    SL.el('circle',{cx:A.sx(Math.max(-4.4,Math.min(4.4,a))).toFixed(1),cy:A.sy(Math.max(-4.4,Math.min(4.4,b))).toFixed(1),r:2.2,class:'sl-dot sl-c2 sl-tiny'},pts);}}
  function draw(){
    A.clear();B.clear();const n=vx.length,i=n-1,a=vx[i],b=vy[i],c=vz[i];
    A.seg(a,0,a,b,'sl-dash');A.seg(0,b,a,b,'sl-dash');A.arrow(0,0,a,b,'sl-c3');A.dot(a,b,'sl-c3',4.5);
    const m=[vx,vy,vz].map(v=>v.reduce((s,x)=>s+x*x,0)/n),cls=['sl-k1 sl-kc','sl-k2 sl-kc','sl-k5 sl-kc'];
    m.forEach((v,j)=>rect(B,j+1-0.3,j+1+0.3,0,Math.min(v,6.3),cls[j]));
    let y=0;m.forEach((v,j)=>{rect(B,4-0.3,4+0.3,y,Math.min(y+v,6.3),cls[j]);y+=v;});
    B.seg(0.5,sg*sg,3.5,sg*sg,'sl-dash');B.seg(3.55,3*sg*sg,4.5,3*sg*sg,'sl-dash');
    B.text(0.45,sg*sg+0.15,'σ² = 1,69','','start');B.text(4.5,3*sg*sg+0.15,'3σ² = 5,07','','end');
    ['Vx²','Vy²','Vz²','|V|²'].forEach((t,j)=>B.text(j+1,-0.55,t,'','middle'));
    rd(out,[['molécules',String(n)],['la dernière, Vx² + Vy² + Vz² = '+SL.fmt(a*a,2)+' + '+SL.fmt(b*b,2)+' + '+SL.fmt(c*c,2),SL.fmt(a*a+b*b+c*c,2)],['moyenne de |V|² (théorie 5,07)',SL.fmt(m[0]+m[1]+m[2],2),'c3']]);
  }
  add(30);while(Math.hypot(vx[vx.length-1],vy[vy.length-1])<1.5)add(1);draw();
  const ctl=document.getElementById('v10ctl');
  SL.h('button','tb',ctl,'+ 1 molécule').onclick=()=>{fresh();if(vx.length<3030){add(1);draw();}};
  SL.h('button','tb',ctl,'▶ + 1 000 molécules').onclick=()=>{const tk=fresh();let k=0;loop(tk,()=>{if(vx.length>=3030)return false;add(25);k+=25;draw();return k<1000;});};
})();

/* ===== v11 : le triangle de Brunton, lu par colonnes puis par lignes ===== */
(function(){
  const out=document.getElementById('v11out');
  const P=SL.plot(document.getElementById('v11plot'),{x:[0.3,6.7],y:[0,1.2],w:560,h:250,xt:[1,2,3,4,5,6],yt:[0,0.5,1]});
  const sub='₀₁₂₃₄₅₆',cells=[];for(let k=1;k<=6;k++)for(let r=1;r<=k;r++)cells.push({k:k,r:r});
  let pos=0;const fresh=runner();
  function frame(u){
    P.clear();
    cells.forEach(c=>{const x=c.k+(c.r-c.k)*u,l=c.r+(c.k-c.r+1-c.r)*u;
      rect(P,x-0.36,x+0.36,(l-1)/6+0.004,l/6-0.004,'sl-k'+c.k+' sl-kc');P.text(x,(l-0.5)/6-0.018,'P'+sub[c.k],'sl-cell-t','middle');});
    P.text(0.4,1.12,u<0.5?'colonne k : k copies de P(X = k), en abscisse la valeur k':'ligne r : P(X ≥ r) = Pᵣ + … + P₆, en abscisse le seuil r','','start');
  }
  buttons(document.getElementById('v11ctl'),['par colonnes : Σ k · P(X = k)','par lignes : Σ P(X ≥ k)'],k=>{const tk=fresh(),a=pos;
    if(a===k)frame(k);else tween(1200,u=>{pos=a+(k-a)*u;frame(pos);},tk);
    rd(out,k?[['lecture','par lignes'],['somme des lignes, 6/6 + 5/6 + … + 1/6','21/6'],['aire totale = E[X]','3,5','c3']]
            :[['lecture','par colonnes'],['somme des colonnes, 1·⅙ + 2·⅙ + … + 6·⅙','21/6'],['aire totale = E[X], 21 cases × ⅙','3,5','c3']]);});
})();
