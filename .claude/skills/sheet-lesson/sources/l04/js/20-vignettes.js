/* ===== v1 : seize séquences, une variable, une réalisation ===== */
(function(){
  const host=document.getElementById('v1plot'),out=document.getElementById('v1out'),ctl=document.getElementById('v1ctl');
  const W=560,H=300,TW=96,TH=34,BASE=268,cx=k=>92+k*104;
  const svg=SL.el('svg',{viewBox:`0 0 ${W} ${H}`,class:'sl-plot'},host);
  const COL=['sl-k4','sl-k6','sl-k2','sl-k5','sl-k3'];
  const seqs=[];for(let i=0;i<16;i++){let s='';for(let b=3;b>=0;b--)s+=((i>>b)&1)?'F':'P';seqs.push(s);}
  const X=s=>s.split('').filter(c=>c==='P').length;
  const gO=SL.el('g',{},svg),gX=SL.el('g',{},svg);
  SL.el('text',{x:64,y:40,class:'sl-lbl'},gO).textContent='Ω : les 16 séquences de quatre lancers (P pile, F face), et leur valeur X';
  SL.el('line',{x1:40,x2:556,y1:BASE,y2:BASE,class:'sl-axis'},gX);
  for(let k=0;k<=4;k++)SL.el('text',{x:cx(k),y:BASE+20,'text-anchor':'middle',class:'sl-tick'},gX).textContent='X = '+k;
  for(let m=1;m<=6;m++){const y=BASE-m*36;SL.el('line',{x1:36,x2:42,y1:y,y2:y,class:'sl-axis'},gX);SL.el('text',{x:33,y:y+4,'text-anchor':'end',class:'sl-tick'},gX).textContent=m+'/16';}
  SL.el('text',{x:44,y:22,class:'sl-lbl'},gX).textContent='P(X = k), en seizièmes : une séquence pèse 1/16';
  const A=[],B=[],cnt=[0,0,0,0,0];
  seqs.forEach((s,i)=>{A.push([64+(i%4)*112,58+Math.floor(i/4)*52]);const k=X(s),j=cnt[k]++;B.push([cx(k)-TW/2,BASE-(j+1)*36+1]);});
  const tiles=seqs.map((s,i)=>{const g=SL.el('g',{},svg);
    SL.el('rect',{x:0,y:0,width:TW,height:TH,rx:3,class:COL[X(s)]+' sl-kc sl-tile'},g);
    SL.el('text',{x:10,y:22,class:'sl-tile-t'},g).textContent=s;
    SL.el('text',{x:TW-10,y:22,'text-anchor':'end',class:'sl-tile-x'},g).textContent=String(X(s));
    const hl=SL.el('rect',{x:-3,y:-3,width:TW+6,height:TH+6,rx:4,class:'sl-hl',display:'none'},g);
    return {g,hl};});
  let pos=0,real='PPFP',seed=3;const run=runner();
  function place(u){tiles.forEach((t,i)=>{const x=A[i][0]+(B[i][0]-A[i][0])*u,y=A[i][1]+(B[i][1]-A[i][1])*u;t.g.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);});
    gO.setAttribute('display',u<0.5?'inline':'none');gX.setAttribute('display',u>=0.5?'inline':'none');}
  function show(){tiles.forEach((t,i)=>t.hl.setAttribute('display',seqs[i]===real?'inline':'none'));const x=X(real);
    rd(out,[['p, fixe','0,5'],['X, aléatoire','0, 1, 2, 3 ou 4'],['x, sur ce tirage',x+' ('+real+')','c3'],['p̂ = x/4, sur ce tirage',SL.fmt(x/4,2)]]);}
  buttons(ctl,['Ω : seize séquences','regrouper par X'],k=>{const tk=run(),a=pos;if(a===k){place(k);return;}tween(900,u=>{pos=a+(k-a)*u;place(pos);},tk);});
  SL.h('button','tb',ctl,'▶ lancer quatre pièces').onclick=()=>{const r=rng(seed++);let s='';for(let i=0;i<4;i++)s+=r()<0.5?'P':'F';real=s;show();};
  show();
})();

/* ===== v2 : des barres de probabilité à la densité ===== */
(function(){
  const MU=1.75,SG=0.07,host=document.getElementById('v2plot'),out=document.getElementById('v2out');
  const WS=[0.10,0.05,0.02,0.01],st={w:0,dens:false};
  const F=x=>Phi((x-MU)/SG);
  function draw(){
    host.innerHTML='';
    const w=WS[st.w],J=Math.floor((0.25-w/2)/w+1e-9),Y=st.dens?6.5:0.6;
    const P=SL.plot(host,{x:[1.5,2],y:[0,Y],w:560,h:250,xt:[1.5,1.6,1.7,1.8,1.9,2],yt:st.dens?[0,1,2,3,4,5,6]:[0,0.1,0.2,0.3,0.4,0.5,0.6],xl:'taille (m)',yl:st.dens?'probabilité ÷ largeur, par m':'probabilité de la classe'});
    let pc=0;
    for(let j=-J;j<=J;j++){const c=MU+j*w,pr=F(c+w/2)-F(c-w/2);if(j===0)pc=pr;rect(P,c-w/2+0.0008,c+w/2-0.0008,0,st.dens?pr/w:pr,j===0?'sl-bar2':'sl-bar');}
    if(st.dens){curve(P,x=>npdf(x,MU,SG),1.5,2,'sl-c1',Y);P.seg(1.5,1,2,1,'chord');P.text(1.995,1.15,'hauteur 1','sl-c3','end');P.text(1.995,Y*0.92,'— densité f','sl-c1','end');}
    const cm=x=>SL.fmt(100*x,1);
    rd(out,[['classe centrale',cm(MU-w/2)+' – '+cm(MU+w/2)+' cm'],['sa probabilité',SL.fmt(pc,3),st.dens?'':'c3'],['probabilité ÷ largeur',fx(pc/w,2)+' par m',st.dens?'c3':''],['densité f(1,75)',fx(npdf(MU,MU,SG),2)+' par m']]);
  }
  buttons(document.getElementById('v2ctl'),['classes de 10 cm','5 cm','2 cm','1 cm'],k=>{st.w=k;draw();});
  buttons(document.getElementById('v2ctl2'),['probabilité de chaque classe','probabilité ÷ largeur'],k=>{st.dens=k===1;draw();});
})();

/* ===== v3 : le masque de Bernoulli de Brunton ===== */
(function(){
  const host=document.getElementById('v3plot'),out=document.getElementById('v3out');
  const C=16,R=10,S=30,X0=40,Y0=8;
  const svg=SL.el('svg',{viewBox:'0 0 560 316',class:'sl-plot'},host);
  function colour(c,r){if(r>=7)return 'sl-k6 sl-kc';const dx=c-11.5,dy=r-2.5;return dx*dx+dy*dy<=4.5?'sl-k5':'sl-k4 sl-kc';}
  const cells=[];for(let r=0;r<R;r++)for(let c=0;c<C;c++){const base=colour(c,r);cells.push({e:SL.el('rect',{x:X0+c*S,y:Y0+r*S,width:S-2,height:S-2,class:base},svg),base});}
  let seed=7,u=[],p=0.3;
  function fresh(){const g=rng(seed++);u=cells.map(()=>g());}
  function draw(){let m=0;cells.forEach((c,i)=>{const off=u[i]<p;if(off)m++;c.e.setAttribute('class',off?'sl-pxoff':c.base);});
    rd(out,[['p, fixe',SL.fmt(p,2)],['pixels masqués, ce masque',m+' / 160'],['part masquée, ce masque',SL.fmt(m/160,3),'c3'],['E[X] = p',SL.fmt(p,2)]]);}
  fresh();
  SL.h('button','tb',document.getElementById('v3ctl'),'↻ nouveau masque').onclick=()=>{fresh();draw();};
  SL.slider(document.getElementById('v3sl'),{label:'p (masquer)',min:0,max:1,step:0.01,value:p,fmt:v=>SL.fmt(v,2)},v=>{p=v;draw();});
})();

/* ===== v4 : deux essais, le carré d'aire 1 ===== */
(function(){
  const host=document.getElementById('v4plot'),out=document.getElementById('v4out');
  const row=SL.h('div','v-row',host),L=SL.h('div','',row),R=SL.h('div','',row);
  const A=SL.plot(L,{x:[0,1],y:[0,1],w:330,h:322,xt:[],yt:[],xl:'essai 1, en largeur'});
  SL.el('text',{x:14,y:152,transform:'rotate(-90 14 152)','text-anchor':'middle',class:'sl-lbl'},A.layer).textContent='essai 2, en hauteur';
  const B=SL.plot(R,{x:[-0.6,2.6],y:[0,1.1],w:330,h:322,xt:[0,1,2],yt:[0,0.25,0.5,0.75,1],xl:'k succès',yl:'P(X = k)'});
  leftAxis(B,-0.6);
  const K=['sl-k4 sl-kc','sl-k2 sl-kc','sl-k3 sl-kc'];
  function draw(p){
    const q=1-p;A.clear();B.clear();
    const cells=[[0,p,0,p,2,'SS','p²',p*p],[0,p,p,1,1,'SÉ','pq',p*q],[p,1,0,p,1,'ÉS','qp',q*p],[p,1,p,1,0,'ÉÉ','q²',q*q]];
    cells.forEach(c=>{rect(A,c[0],c[1],c[2],c[3],K[c[4]]+' sl-tile');
      const wpx=A.sx(c[1])-A.sx(c[0]),hpx=A.sy(c[2])-A.sy(c[3]);
      const mx=(c[0]+c[1])/2,my=(c[2]+c[3])/2;
      if(wpx>70&&hpx>40){
        A.text(mx,my,c[5],'sl-cap-t','middle').setAttribute('y',(A.sy(my)-4).toFixed(1));
        A.text(mx,my,c[6]+' = '+SL.fmt(c[7],3),'sl-cap-t','middle').setAttribute('y',(A.sy(my)+13).toFixed(1));}
      else if(wpx>=16&&hpx>130){const px=A.sx(mx),py=A.sy(my),t=SL.el('text',{x:px.toFixed(1),y:(py+4).toFixed(1),'text-anchor':'middle',class:'sl-lbl sl-cap-t',transform:`rotate(-90 ${px.toFixed(1)} ${py.toFixed(1)})`},A.dyn);t.textContent=c[5]+' · '+c[6]+' = '+SL.fmt(c[7],3);}
      else if(hpx>=16&&wpx>130){A.text(mx,my,c[5]+' · '+c[6]+' = '+SL.fmt(c[7],3),'sl-cap-t','middle').setAttribute('y',(A.sy(my)+4).toFixed(1));}});
    [[p/2,'S'],[(1+p)/2,'É']].forEach(a=>{A.text(a[0],0,a[1],'sl-cap-t','middle').setAttribute('y',(A.sy(0)+16).toFixed(1));
      A.text(0,a[0],a[1],'sl-cap-t','end').setAttribute('x',(A.sx(0)-8).toFixed(1));});
    const pk=[q*q,2*p*q,p*p];
    pk.forEach((v,k)=>{bar(B,k-0.32,k+0.32,v,K[k]);B.text(k,v+0.035,SL.fmt(v,3),'','middle');});
    rd(out,[['P(X = 0) = q²',SL.fmt(q*q,3)],['P(X = 1) = 2pq',SL.fmt(2*p*q,3)],['P(X = 2) = p²',SL.fmt(p*p,3)],['pq = qp',SL.fmt(p*q,3)],['somme = (p + q)²',SL.fmt(q*q+2*p*q+p*p,4),'c3']]);
  }
  SL.slider(document.getElementById('v4sl'),{label:'p (succès)',min:0.02,max:0.98,value:1/6,fmt:v=>SL.fmt(v,3)},draw);
})();

/* ===== v5 : les cinq tracés de Brunton ===== */
(function(){
  const host=document.getElementById('v5plot'),out=document.getElementById('v5out');
  const C=[{n:100,p:0.5,x:[30,70]},{n:30,p:0.5,x:[3,27]},{n:10,p:0.5,x:[-1,11]},{n:5,p:0.5,x:[-1,6]},{n:30,p:0.02,x:[-3,5]}];
  function draw(i){
    const c=C[i],n=c.n,p=c.p,mu=n*p,sd=Math.sqrt(n*p*(1-p)),small=p<0.1;host.innerHTML='';
    let peak=0,gap=0,kg=0;const pm=[];
    for(let k=0;k<=n;k++){const v=binpmf(n,p,k);pm.push(v);peak=Math.max(peak,v);const d=Math.abs(v-npdf(k,mu,sd));if(d>gap){gap=d;kg=k;}}
    const Y=peak*1.32;
    const P=SL.plot(host,{x:c.x,y:[0,Y],w:560,h:250,xt:xticks(c.x[0],c.x[1],10),yt:yticks(Y),xl:'k, nombre de succès',yl:'probabilité ou densité'});
    if(c.x[0]<0)leftAxis(P,c.x[0]);
    pm.forEach((v,k)=>{if(k<c.x[0]||k>c.x[1])return;bar(P,k-0.36,k+0.36,v,'sl-bar');});
    if(small)areaUnder(P,x=>npdf(x,mu,sd),c.x[0],0,'sl-area2');
    curve(P,x=>npdf(x,mu,sd),c.x[0],c.x[1],'sl-c1',Y);
    P.seg(kg,pm[kg],kg,npdf(kg,mu,sd),'sl-c3');
    const xr=c.x[1]-(c.x[1]-c.x[0])*0.01;
    P.text(xr,Y*0.93,'▮ binomiale, « exacte »','sl-c2','end');P.text(xr,Y*0.84,'— normale, « approximation »','sl-c1','end');
    P.text(xr,Y*0.75,'│ écart maximal','sl-c3','end');
    if(small)P.text(xr,Y*0.66,'■ masse normale sous 0','sl-c3','end');
    const items=[['μ = np',SL.fmt(mu,2)],['σ = √(np(1 − p))',SL.fmt(sd,2)],['pic de la binomiale',SL.fmt(peak,4)],['écart maximal',SL.fmt(gap,4),'c3']];
    if(small)items.push(['masse normale sous 0',SL.fmt(100*Phi(-mu/sd),1)+' %'],['dont sous −0,5, hors barre',SL.fmt(100*Phi((-0.5-mu)/sd),1)+' %']);
    rd(out,items);
  }
  buttons(document.getElementById('v5ctl'),['n = 100','n = 30','n = 10','n = 5','n = 30, p = 0,02'],draw);
})();

/* ===== v6 : 68 % en quatre temps ===== */
(function(){
  const host=document.getElementById('v6plot'),out=document.getElementById('v6out');
  const P=SL.plot(host,{x:[-4,4],y:[0,0.5],w:560,h:250,xt:[-3,-2,-1,0,1,2,3],yt:[0,0.1,0.2,0.3,0.4],xl:'z',yl:'densité φ(z)'});
  leftAxis(P,-4);
  const st={k:1,s:0};
  function draw(){
    P.clear();const k=st.k,s=st.s,F=Phi(k),t=1-F,band=fx(100*(2*F-1),1)+' %';
    if(s===0)areaUnder(P,phi,-4,k,'sl-area');
    if(s>=1)areaUnder(P,phi,k,4,'sl-area2');
    if(s>=2)areaUnder(P,phi,-4,-k,'sl-area2');
    if(s===3)areaUnder(P,phi,-k,k,'sl-area');
    curve(P,phi,-4,4,'sl-c1',0.5);
    P.seg(k,0,k,0.43,'sl-dash');if(s>=2)P.seg(-k,0,-k,0.43,'sl-dash');
    const lab=[['■ Φ('+SL.fmt(k,2)+') = '+fx(F,4)+', l’aire à gauche de k','sl-c2'],['■ queue droite : 1 − Φ(k) = '+fx(t,4),'sl-c3'],['■ queue gauche = queue droite = '+fx(t,4),'sl-c3'],['■ bande : 1 − 2 × '+fx(t,4)+' ≈ '+band,'sl-c2']][s];
    P.text(3.95,0.465,lab[0],lab[1],'end');
    rd(out,[['Φ(k), à gauche de k',fx(F,4)],['queue droite, 1 − Φ(k)',fx(t,4)],['queue gauche, Φ(−k)',fx(Phi(-k),4)],['bande, 2Φ(k) − 1',band,'c3']]);
  }
  buttons(document.getElementById('v6ctl'),['1. Φ(k)','2. queue droite','3. symétrie','4. la bande'],i=>{st.s=i;draw();});
  SL.slider(document.getElementById('v6sl'),{label:'k',min:0.5,max:3,step:0.01,value:1,fmt:v=>SL.fmt(v,2)},v=>{st.k=v;draw();});
})();

/* ===== v7 : 400 pièces, les deux demi-barres ===== */
(function(){
  const host=document.getElementById('v7plot'),out=document.getElementById('v7out');
  const row=SL.h('div','v-row',host),L=SL.h('div','',row),R=SL.h('div','v-mini',row);
  const MU=200,SG=10,f=x=>npdf(x,MU,SG),YM=0.047;
  const A=SL.plot(L,{x:[175,240],y:[0,YM],w:440,h:260,xt:[180,190,200,210,220,230,240],yt:[0,0.01,0.02,0.03,0.04],xl:'k, nombre de piles'});
  const Z=SL.plot(R,{x:[186.5,193.5],y:[0,YM],w:220,h:260,xt:[188,190,192],yt:[],xl:'zoom sur 190'});
  const pm=[];for(let k=0;k<=400;k++)pm.push(binpmf(400,0.5,k));
  let exact=0;for(let k=190;k<=230;k++)exact+=pm[k];
  const LO=[190,190,189.5],HI=[230,230,230.5];
  function paint(P,x0,x1,m){
    P.clear();
    if(m>0)areaUnder(P,f,Math.max(x0,LO[m]),Math.min(x1,HI[m]),'sl-area');
    for(let k=Math.ceil(x0);k<=Math.floor(x1);k++){const inr=k>=190&&k<=230;bar(P,k-0.5,k+0.5,pm[k],m===0?(inr?'sl-bar':'sl-barlite'):'sl-barline');}
    curve(P,f,x0,x1,'sl-c1',YM);
    if(m>0){if(LO[m]>=x0&&LO[m]<=x1)P.seg(LO[m],0,LO[m],0.035,'sl-c3');if(HI[m]>=x0&&HI[m]<=x1)P.seg(HI[m],0,HI[m],0.035,'sl-c3');}
  }
  function draw(m){
    paint(A,175,240,m);paint(Z,186.5,193.5,m);
    A.text(239.5,0.044,'— N(200 ; 10²)','sl-c1','end');A.text(239.5,0.039,'▮ P(X = k), une barre de largeur 1','sl-c2','end');
    Z.text(193.3,0.044,['P(X = 190) = 0,024','½ barre perdue','barre entière'][m],m===1?'sl-c3':'sl-c2','end');
    const val=[exact,Phi(3)-Phi(-1),Phi(3.05)-Phi(-1.05)][m],d=val-exact;
    rd(out,[['μ et σ','200 et 10'],[['somme exacte, 41 termes','aire de 190 à 230','aire de 189,5 à 230,5'][m],fx(val,4),'c3'],['écart à la somme exacte',m?fx(d,4):'—']]);
  }
  buttons(document.getElementById('v7ctl'),['41 barres : la somme exacte','aire de 190 à 230','aire de 189,5 à 230,5'],draw);
})();
