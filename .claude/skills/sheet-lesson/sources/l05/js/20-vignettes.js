/* ===== v1 : la normale déborde sous zéro, la Poisson colle ===== */
(function(){
  const host=document.getElementById('v1plot'),out=document.getElementById('v1out');
  /* écarts max et masse négative recalculés par script (check/vis.py) */
  const S=[{n:1000,p:0.001,x:[-3.6,6.6],xt:[-3,-2,-1,0,1,2,3,4,5,6],w:0.36,neg:'15,9\u00a0%',dp:'0,0002',dn:'0,13'},
           {n:10000,p:0.002,x:[-6,41],xt:[0,5,10,15,20,25,30,35,40],w:0.34,neg:'0,0004\u00a0%',dp:'0,0001',dn:'0,005'}];
  function draw(i){
    const s=S[i],lam=s.n*s.p,sd=Math.sqrt(s.n*s.p*(1-s.p)),kmax=Math.floor(s.x[1]);host.innerHTML='';
    let ym=npdf(lam,lam,sd);for(let k=0;k<=kmax;k++)ym=Math.max(ym,binpmf(s.n,s.p,k));
    const Y=ym*1.55,f=x=>npdf(x,lam,sd);
    const P=SL.plot(host,{x:s.x,y:[0,Y],w:600,h:270,xt:s.xt,yt:yticks(Y),xl:'k — nombre de succès',yl:'probabilité'});
    leftAxis(P,s.x[0]);
    area(P,f,s.x[0],0,0,'sl-bar2');
    for(let k=0;k<=kmax;k++){const v=binpmf(s.n,s.p,k);if(v>1e-6)bar(P,k-s.w,k+s.w,v,'sl-bar');}
    poly(P,sample(f,s.x[0],s.x[1],300),'sl-fn sl-c1');
    for(let k=0;k<=kmax;k++){const v=poispmf(lam,k);if(v>1e-6)P.dot(k,v,'sl-c3',3.4);}
    P.vline(0,'sl-dash');
    const xr=s.x[1]-(s.x[1]-s.x[0])*0.01;
    P.text(xr,Y*0.93,'▮ binomiale exacte','','end');
    P.text(xr,Y*0.84,'● Poisson de même moyenne','sl-c3','end');
    P.text(xr,Y*0.75,'— normale de même moyenne et variance','sl-c1','end');
    P.text(xr,Y*0.66,'▮ rouge\u00a0: sa masse sous zéro','sl-c3','end');
    rd(out,[['λ = np',String(lam)],['normale, masse sous 0',s.neg,'c3'],['écart max à la binomiale, Poisson',s.dp],['écart max à la binomiale, normale',s.dn]]);
  }
  buttons(document.getElementById('v1ctl'),['1 000 essais, p = 1/1 000','néons : 10 000, p = 0,002'],draw);
})();

/* ===== v2 : vingt joueurs qui lancent jusqu'au premier 5 ===== */
(function(){
  const host=document.getElementById('v2plot'),out=document.getElementById('v2out'),N=20,C=30;
  host.classList.add('nogrid');
  const P=SL.plot(host,{x:[0,C+3],y:[0,N+1.7],w:600,h:340,xt:[1,5,9,15,20,25,30],yt:[],xl:'lancer n°'});
  const ax=P.svg.querySelectorAll('line.sl-axis');if(ax[1])ax[1].remove();
  rect(P,0.5,9.5,0.45,N+0.55,'sl-band',P.layer);
  P.label(5,N+1.05,'les 9 premiers lancers','','middle');
  P.label(C+2.8,N+1.05,'X','','end');
  let seed=37,tot=0,ge=0,sum=0;
  function draw(){
    P.clear();const r=rng(seed);let k10=0;
    for(let i=0;i<N;i++){
      let x=1;while(r()>=1/6)x++;
      const y=N-i;
      for(let j=1;j<=Math.min(x,C);j++)rect(P,j-0.42,j+0.42,y-0.36,y+0.36,j===x?'sl-cellp':'sl-cello');
      if(x>C)P.text(C+0.55,y-0.3,'…','','start');
      P.text(C+2.8,y-0.3,String(x),x>=10?'sl-c3':'','end');
      if(x>=10)k10++;
      tot++;sum+=x;if(x>=10)ge++;
    }
    rd(out,[['ces vingt joueurs, X ≥ 10',k10+' sur 20'],['joueurs en tout',String(tot)],['part X ≥ 10 (théorie 19,4\u00a0%)',SL.fmt(100*ge/tot,1)+'\u00a0%','c3'],['rang moyen (théorie 6)',fx(sum/tot,2)]]);
  }
  draw();
  SL.h('button','tb',document.getElementById('v2ctl'),'▶ vingt autres joueurs').onclick=()=>{seed++;draw();};
})();

/* ===== v3 : 400 ampoules, 400 atomes ===== */
(function(){
  const host=document.getElementById('v3plot'),out=document.getElementById('v3out'),sdiv=document.getElementById('v3sl'),ctl=document.getElementById('v3ctl');
  const M=[{lam:1/100,T:300,u:'h',xt:[0,50,100,150,200,250,300],t0:50,seed:182},
           {lam:Math.LN2/138,T:920,u:'j',xt:[0,138,276,414,552,690,828],t0:138,seed:210}];
  const row=SL.h('div','v-row',host),A=SL.h('div','nogrid',row),B=SL.h('div','',row);
  const G=SL.plot(A,{x:[0,20],y:[0,20],w:300,h:300,xt:[],yt:[]});
  G.svg.querySelectorAll('line.sl-axis').forEach(l=>l.remove());
  let mode=0,life=[],S=null,sl=null;const fresh=runner();
  function draw(t){
    const m=M[mode];G.clear();S.clear();let alive=0;
    life.forEach((d,i)=>{const on=d>t;if(on)alive++;G.dot(0.5+(i%20),19.5-Math.floor(i/20),on?'sl-c2':'hollow sl-c2',on?5.6:4.4);});
    S.seg(t,0,t,0.9,'sl-c5');S.dot(t,alive/400,'sl-c3',5.5);
    rd(out,[['temps écoulé',SL.fmt(t,0)+' '+m.u],['encore en vie',alive+' sur 400'],['part simulée',SL.fmt(100*alive/400,1)+'\u00a0%','c3'],['théorie e<sup>−λt</sup>',SL.fmt(100*Math.exp(-m.lam*t),1)+'\u00a0%']]);
  }
  function setMode(i){
    mode=i;fresh();const m=M[i],r=rng(m.seed);life=[];for(let k=0;k<400;k++)life.push(expo(r,m.lam));
    B.innerHTML='';S=SL.plot(B,{x:[0,m.T],y:[0,1.05],w:300,h:300,xt:m.xt,yt:[0.25,0.5,0.75,1],xl:'temps ('+m.u+')',yl:'part en vie'});
    S.fn(t=>Math.exp(-m.lam*t),'sl-c1');
    sdiv.innerHTML='';sl=SL.slider(sdiv,{label:'temps',min:0,max:m.T,step:1,value:m.t0,fmt:v=>SL.fmt(v,0)+' '+m.u},draw);
    sl.input.addEventListener('input',()=>fresh());
  }
  buttons(ctl,['ampoules, 100 h en moyenne','polonium 210, demi-vie 138 j'],setMode);
  SL.h('button','tb',ctl,'▶ laisser passer le temps').onclick=()=>{const tk=fresh(),T=M[mode].T,t0=performance.now();
    loop(tk,()=>{const u=SL.reduced?1:Math.min(1,(performance.now()-t0)/5000);sl.set(Math.round(u*T));return u<1;});};
})();

/* ===== v4 : la vie qui reste aux ampoules encore allumées ===== */
(function(){
  const host=document.getElementById('v4plot'),out=document.getElementById('v4out'),N=2000,XM=3000,BW=200,YM=4.4;
  const r=rng(22),E=[],W=[];for(let i=0;i<N;i++){E.push(expo(r,1/1000));W.push(1000+200*gauss(r));}
  const P=SL.plot(host,{x:[0,XM],y:[0,YM],w:600,h:260,xt:[0,500,1000,1500,2000,2500,3000],yt:[1,2,3,4],xl:'vie restante (h)',yl:'densité, pour 1 000 h'});
  const st={m:0,s:1000};
  const Sw=s=>Phi((1000-s)/200);
  function mrlW(s){const a=s,b=s+1600,n=800,hh=(b-a)/n;let t=Sw(a)+Sw(b);for(let i=1;i<n;i++)t+=Sw(a+i*hh)*(i%2?4:2);return t*hh/3/Sw(s);}
  function draw(){
    P.clear();const s=st.s,L=st.m?W:E,rest=L.filter(x=>x>s).map(x=>x-s);
    histo(P,rest,0,XM,BW,'sl-bar',4,1000);
    const neuf=st.m?(t=>1000*npdf(t,1000,200)):(t=>Math.exp(-t/1000));
    const surv=st.m?(t=>1000*npdf(s+t,1000,200)/Sw(s)):(t=>Math.exp(-t/1000));
    curveS(P,neuf,0,XM,'sl-c4 sl-dash',YM);curveS(P,surv,0,XM,'sl-c1',YM);
    const xr=XM*0.99;
    P.text(xr,YM*0.92,'┄ une ampoule neuve','sl-c4','end');P.text(xr,YM*0.83,'— les survivantes, théorie','sl-c1','end');P.text(xr,YM*0.74,'▮ les survivantes, simulées','','end');
    const m=rest.length?rest.reduce((a,b)=>a+b,0)/rest.length:NaN;
    rd(out,[['encore allumées à s',SL.fmt(100*rest.length/N,1)+'\u00a0%'],['théorie',SL.fmt(100*(st.m?Sw(s):Math.exp(-s/1000)),1)+'\u00a0%'],
      ['vie restante moyenne, simulée',rest.length?SL.fmt(m,0)+' h':'—','c3'],['théorie',SL.fmt(st.m?mrlW(s):1000,0)+' h']]);
  }
  buttons(document.getElementById('v4ctl'),['exponentielle, moyenne 1 000 h','usure : normale 1 000 ± 200 h'],i=>{st.m=i;draw();});
  SL.slider(document.getElementById('v4sl'),{label:'déjà allumées depuis s',min:0,max:1400,step:50,value:1000,fmt:v=>SL.fmt(v,0)+' h'},v=>{st.s=v;draw();});
})();

/* ===== v5 : taux constant, et courbe en baignoire ===== */
(function(){
  const host=document.getElementById('v5plot'),out=document.getElementById('v5out'),XM=4000,YM=4.4;
  const P=SL.plot(host,{x:[0,XM],y:[0,YM],w:600,h:270,xt:[0,500,1000,1500,2000,2500,3000,3500,4000],yt:[1,2,3,4],xl:'âge de l’ampoule (h)',yl:'pannes pour 1 000 h'});
  /* jeunesse = Weibull de forme 0,5 et d’échelle 1 000 h, hasard = 0,5 pour 1 000 h, usure = Weibull de forme 5 et d’échelle 3 000 h */
  const h1=t=>0.5*Math.sqrt(1000/t),h0=0.5,h3=t=>(5000/3000)*Math.pow(t/3000,4);
  const Hb=t=>Math.sqrt(t/1000)+h0*t/1000+Math.pow(t/3000,5),Hc=t=>t/1000;
  const st={m:1,t:1200};
  function draw(){
    P.clear();const t=st.t,xr=XM*0.66;let h,H,ph;
    if(st.m===0){
      curveS(P,()=>1,0,XM,'sl-c1',YM);h=1;H=Hc;ph='hasard seul';
      P.text(xr,3.95,'— taux constant, 1 pour 1 000 h','sl-c1','end');
    }else{
      curveS(P,h1,1,XM,'sl-c2 sl-dash',YM);curveS(P,()=>h0,0,XM,'sl-c4 sl-dash',YM);curveS(P,h3,0,XM,'sl-c5 sl-dash',YM);
      curveS(P,u=>h1(u)+h0+h3(u),1,XM,'sl-c1',YM);
      h=t>0?h1(t)+h0+h3(t):Infinity;H=Hb;
      const a=t>0?h1(t):Infinity,c=h3(t);ph=a>Math.max(h0,c)?'jeunesse':c>Math.max(h0,a)?'usure':'hasard';
      P.text(xr,3.95,'— taux total\u00a0: la baignoire','sl-c1','end');P.text(xr,3.6,'┄ jeunesse','sl-c2','end');
      P.text(xr,3.25,'┄ hasard','sl-c4','end');P.text(xr,2.9,'┄ usure','sl-c5','end');
    }
    P.vline(t,'sl-c3 sl-dash');if(isFinite(h)&&h<=YM)P.dot(t,h,'sl-c3',5);
    const p100=1-Math.exp(-(H(t+100)-H(t)));
    rd(out,[['âge t',SL.fmt(t,0)+' h'],['taux h(t), pour 1 000 h',isFinite(h)?fx(h,2):'∞'],['panne dans les 100 h, sachant vivante',SL.fmt(100*p100,1)+'\u00a0%','c3'],['phase qui domine',ph]]);
  }
  buttons(document.getElementById('v5ctl'),['baignoire : jeunesse, hasard, usure','taux constant : l’exponentielle'],i=>{st.m=i?0:1;draw();});
  SL.slider(document.getElementById('v5sl'),{label:'âge',min:0,max:4000,step:50,value:1200,fmt:v=>SL.fmt(v,0)+' h'},v=>{st.t=v;draw();});
})();

/* ===== v6 : une heure de mails, comptée et chronométrée ===== */
(function(){
  const host=document.getElementById('v6plot'),out=document.getElementById('v6out'),L=5,H=60,SHOW=4;
  const top=SL.h('div','wide',host);
  const F=SL.plot(top,{x:[0,SHOW],y:[0,1],w:600,h:130,xt:[0,0.5,1,1.5,2,2.5,3,3.5,4],yt:[],xl:'temps (minutes)'});
  F.svg.parentNode.classList.add('nogrid');
  const row=SL.h('div','v-row',host),A=SL.h('div','',row),B=SL.h('div','',row);
  const PA=SL.plot(A,{x:[0,60],y:[0,0.11],w:300,h:240,xt:[0,12,24,36,48,60],yt:[0.05,0.1],xl:'attente entre deux mails (s)',yl:'densité'});
  PA.fn(s=>(L/60)*Math.exp(-L*s/60),'sl-c1');
  let seed=1413,arr=[],win=0.5;
  function gen(){const r=rng(seed);arr=[];let s=0;for(;;){s+=expo(r,L);if(s>H)break;arr.push(s);}}
  function draw(){
    F.clear();PA.clear();B.innerHTML='';
    const nw=Math.round(H/win),cnt=new Array(nw).fill(0);arr.forEach(a=>{const j=Math.floor(a/win);if(j<nw)cnt[j]++;});
    for(let j=0;j*win<SHOW-1e-9;j++){if(j%2===0)rect(F,j*win,Math.min(SHOW,(j+1)*win),0.02,1,'sl-win');F.text((j+0.5)*win,0.8,String(cnt[j]),'sl-c4','middle');}
    arr.filter(a=>a<=SHOW).forEach(a=>F.text(a,0.18,'×','sl-x','middle'));
    for(let i=0;i<3;i++){const x0=i?arr[i-1]:0,x1=arr[i];if(x1>SHOW)break;F.seg(x1,0.1,x1,0.5,'sl-c2 sl-dash');if(!i)F.seg(0,0.1,0,0.5,'sl-c2 sl-dash');F.seg(x0,0.45,x1,0.45,'sl-c2');if(x1-x0>=0.12)F.text((x0+x1)/2,0.52,'W'+'₁₂₃'[i],'sl-c2','middle');}
    const waits=arr.map((a,i)=>60*(a-(i?arr[i-1]:0))),mw=waits.reduce((a,b)=>a+b,0)/waits.length;
    histo(PA,waits,0,60,3,'sl-bar',0.11);PA.seg(mw,0,mw,0.095,'sl-mean');
    const lt=L*win,km=Math.max(8,Math.ceil(lt+4*Math.sqrt(lt)+2)),fr=new Array(km+1).fill(0);
    cnt.forEach(c=>{if(c<=km)fr[c]++;});
    let ym=0;for(let k=0;k<=km;k++)ym=Math.max(ym,fr[k]/nw,poispmf(lt,k));
    const Y=ym*1.2;
    const PB=SL.plot(B,{x:[-0.6,km+0.6],y:[0,Y],w:300,h:240,xt:xticks(0,km,6),yt:yticks(Y),xl:'mails par fenêtre',yl:'fréquence'});
    leftAxis(PB,-0.6);
    fr.forEach((c,k)=>{if(c)bar(PB,k-0.34,k+0.34,c/nw,'sl-bar');});
    for(let k=0;k<=km;k++)PB.dot(k,poispmf(lt,k),'sl-c3',3.4);
    const mc=cnt.reduce((a,b)=>a+b,0)/nw,vc=cnt.reduce((a,b)=>a+(b-mc)*(b-mc),0)/nw;
    rd(out,[['mails dans l’heure',String(arr.length)],['attente moyenne (théorie 12 s)',SL.fmt(mw,1)+' s','c3'],
      ['compte moyen par fenêtre (théorie '+SL.fmt(lt,2)+')',fx(mc,2)],['variance des comptes (théorie '+SL.fmt(lt,2)+')',fx(vc,2)]]);
  }
  gen();
  SL.slider(document.getElementById('v6sl'),{label:'fenêtre t',min:0.25,max:2,step:0.25,value:0.5,fmt:v=>SL.fmt(v,2)+' min'},v=>{win=v;draw();});
  SL.h('button','tb',document.getElementById('v6ctl'),'▶ une autre heure').onclick=()=>{seed++;gen();draw();};
})();

/* ===== v7 : trois guichets du DMV, en série ou en parallèle ===== */
(function(){
  const host=document.getElementById('v7plot'),out=document.getElementById('v7out'),ctl=document.getElementById('v7ctl'),XM=120;
  const top=SL.h('div','wide',host),bot=SL.h('div','wide',host);
  const U=SL.plot(top,{x:[0,XM],y:[0,3.4],w:600,h:150,xt:[0,15,30,45,60,75,90,105,120],yt:[],xl:'un client (minutes)'});
  top.classList.add('nogrid');
  ['A','B','C'].forEach((n,i)=>P_lbl(n,i));
  function P_lbl(n,i){const e=SL.el('text',{x:(U.sx(0)-6).toFixed(1),y:(U.sy(2.7-i)+4).toFixed(1),'text-anchor':'end',class:'sl-lbl'},U.layer);e.textContent=n;}
  const fresh=runner();let mode=0,vals=[],cur=null,seed=77;
  const draw3=r=>[expo(r,1/15),expo(r,1/15),expo(r,1/15)];
  const tot=w=>mode?Math.min(...w):w[0]+w[1]+w[2];
  function drawClient(){
    U.clear();if(!cur)return;let s=0;const m=Math.min(...cur);
    cur.forEach((d,i)=>{const x0=mode?0:s,x1=Math.min(XM,x0+d),y=2.7-i;
      rect(U,x0,x1,y-0.3,y+0.3,'sl-lane'+(mode&&d===m?' first':''));
      const T=tot(cur);if(x1-x0>11){if(mode){if(!(T>x1-11&&T<x1-0.5))U.text(x1-1,y-0.12,SL.fmt(d,0)+' min','sl-lane-t','end');}else{const c=(x0+x1)/2;if(Math.abs(T-c)>6)U.text(c,y-0.12,SL.fmt(d,0)+' min','sl-lane-t','middle');}}s+=d;});
    U.vline(Math.min(XM,tot(cur)),'sl-mean');
  }
  function drawHist(){
    bot.innerHTML='';const bw=mode?1:5,Y=mode?0.25:0.03;
    const P=SL.plot(bot,{x:[0,XM],y:[0,Y],w:600,h:210,xt:[0,15,30,45,60,75,90,105,120],yt:yticks(Y),xl:'attente de chaque client (minutes)',yl:'densité'});
    histo(P,vals,0,XM,bw,'sl-bar',Y);
    curve(P,mode?(t=>Math.exp(-t/5)/5):(t=>gammapdf(3,1/15,t)),0,XM,'sl-c1',Y);
    const n=vals.length,m=n?vals.reduce((a,b)=>a+b,0)/n:0,sd=n>1?Math.sqrt(vals.reduce((a,b)=>a+(b-m)*(b-m),0)/n):0;
    if(n)P.vline(m,'sl-mean');
    P.text(XM*0.99,Y*0.92,mode?'— Exponentielle(3/15), moyenne 5 min':'— Gamma(3, 1/15), moyenne 45 min','sl-c1','end');
    P.text(XM*0.99,Y*0.82,'│ moyenne des clients servis','sl-c3','end');
    rd(out,[['ce client',cur?SL.fmt(tot(cur),1)+' min':'—'],['clients servis',String(n)],['attente moyenne (théorie '+(mode?'5':'45')+')',SL.fmt(m,1)+' min','c3'],['écart-type (théorie '+(mode?'5':'26')+')',SL.fmt(sd,1)+' min']]);
  }
  function fill(k){const r=rng(seed);vals=[];for(let i=0;i<k;i++){cur=draw3(r);vals.push(tot(cur));}}
  buttons(ctl,['en série : A, puis B, puis C','en parallèle : le premier guichet libre'],i=>{mode=i;fresh();seed=77;fill(200);drawClient();drawHist();});
  SL.h('button','tb',ctl,'▶ 200 autres clients').onclick=()=>{const tk=fresh(),r=rng(++seed);vals=[];let k=0;
    loop(tk,()=>{const n=k<20?1:5;for(let j=0;j<n&&k<200;j++,k++){cur=draw3(r);vals.push(tot(cur));}drawClient();drawHist();return k<200;});};
})();
