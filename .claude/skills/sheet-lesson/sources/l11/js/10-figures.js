/* ===== Figure 1 : la fonction de répartition exacte de Zₙ contre Φ ===== */
(function(){
  const P=SL.plot(document.getElementById('f1plot'),{x:[-3,3],y:[0,1],w:560,h:270,xt:[-3,-2,-1,0,1,2,3],yt:[0,0.25,0.5,0.75,1],xl:'z',yl:'P(Zₙ ≤ z)'});
  leftAxis(P,-3);
  P.fn(PhiN,'sl-c3');
  const out=document.getElementById('f1out'),st={law:0,n:4};
  function draw(){
    P.clear();const n=st.n;let a,m,s;
    if(st.law===0){a=diceLaw(n);m=3.5*n;s=SIGD*Math.sqrt(n);}else{a=binomLaw(n,0.5);m=n/2;s=Math.sqrt(n)/2;}
    const zs=[],Fs=[];let F=0,gap=0,gz=0,gF=0,jump=0;
    for(let v=0;v<a.length;v++){const q=a[v];if(q<1e-15)continue;const z=(v-m)/s,ph=PhiN(z);
      if(Math.abs(F-ph)>gap){gap=Math.abs(F-ph);gz=z;gF=F;}
      F+=q;if(Math.abs(F-ph)>gap){gap=Math.abs(F-ph);gz=z;gF=F;}
      jump=Math.max(jump,q);zs.push(z);Fs.push(F);}
    let i=0,F0=0;while(i<zs.length&&zs[i]<-3){F0=Fs[i];i++;}
    let d='M'+P.sx(-3).toFixed(1)+' '+P.sy(F0).toFixed(1);
    for(;i<zs.length&&zs[i]<=3;i++)d+=' H'+P.sx(zs[i]).toFixed(1)+' V'+P.sy(Fs[i]).toFixed(1);
    d+=' H'+P.sx(3).toFixed(1);
    SL.el('path',{d:d,class:'sl-fn sl-c1',fill:'none'},P.dyn);
    if(Math.abs(gz)<=3)P.seg(gz,gF,gz,PhiN(gz),'gap');
    P.text(-2.9,0.86,'— Φ(z), la normale','sl-c3','start');
    P.text(-2.9,0.78,'— Fₙ(z), la fonction de répartition','sl-c1','start');
    P.text(-2.9,0.71,'   exacte de Zₙ','sl-c1','start');
    P.text(-2.9,0.62,'▮ l’écart maximal','sl-c5','start');
    rd(out,[['écart maximal |Fₙ − Φ|',fixed(gap,3),'c3'],['plus haute marche, max P(Sₙ = s)',fixed(jump,3)],['loi, n',(st.law?'pièce':'dé')+', n = '+n]]);
  }
  buttons(document.getElementById('f1ctl'),['dé','pièce'],k=>{st.law=k;draw();});
  SL.slider(document.getElementById('f1sl'),{label:'n (lancers)',min:1,max:100,step:1,value:4,fmt:v=>String(v)},v=>{st.n=v;draw();});
})();

/* ===== Figure 2 : moyenne de n exponentielles, loi exacte (Gamma) contre normale ===== */
(function(){
  const NS=[1,2,5,10,30,100],X=[0,3];
  const P=SL.plot(document.getElementById('f2plot'),{x:X,y:[0,1.1],w:560,h:250,xt:[0,0.5,1,1.5,2,2.5,3],yt:[],xl:'moyenne x̄ de n attentes (μ = 1)'});
  const out=document.getElementById('f2out');
  function simpson(f,a,b){if(b<=a)return 0;const N=4000,h=(b-a)/N;let s=f(a)+f(b);for(let i=1;i<N;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3;}
  function draw(k){
    const n=NS[k],se=1/Math.sqrt(n),g=x=>gammaMean(x,n);P.clear();
    let M=1/(se*Math.sqrt(2*Math.PI));for(let i=0;i<=900;i++)M=Math.max(M,g(X[1]*i/900));
    curve(P,x=>g(x)/M,0,X[1],'sl-c4',1.1);
    curve(P,x=>phiN((x-1)/se)/se/M,0,X[1],'sl-c3 dashfn',1.1);
    const lo=1-1.96*se,hi=1+1.96*se;
    if(lo>0)P.seg(lo,0,lo,0.86,'sl-dash');P.seg(hi,0,hi,0.86,'sl-dash');
    if(hi>2.2)P.text(hi-0.03,0.55,'μ + 1,96 SE','','end');else P.text(hi+0.03,0.55,'μ + 1,96 SE','','start');
    P.text(2.97,1.02,'— moyenne exacte (loi Gamma)','sl-c4','end');
    P.text(2.97,0.92,'┄ normale N(1, 1/n)','sl-c3','end');
    const left=lo>0?simpson(g,0,lo):0,right=1-simpson(g,0,hi);
    rd(out,[['asymétrie de x̄ = 2/√n',fixed(2/Math.sqrt(n),2)],['au-delà de μ + 1,96 SE (normale : 2,5 %)',pct(right),'c3'],['en deçà de μ − 1,96 SE (normale : 2,5 %)',pct(left)]]);
  }
  SL.slider(document.getElementById('f2sl'),{label:'n (attentes)',min:0,max:5,step:1,value:3,fmt:v=>String(NS[v])},draw);
})();

/* ===== Figure 3 : proportion observée d'un événement rare, p = 0,02 ===== */
(function(){
  const NS=[20,100,500,5000],p=0.02,X=[-0.04,0.125];
  const P=SL.plot(document.getElementById('f3plot'),{x:X,y:[0,1.1],w:560,h:250,xt:[-0.04,-0.02,0,0.02,0.04,0.06,0.08,0.1,0.12],yt:[],xl:'proportion observée p̂'});
  const out=document.getElementById('f3out');
  function draw(k){
    const n=NS[k],q=1-p,se=Math.sqrt(p*q/n),a=binomLaw(n,p),h=1/n;P.clear();
    let M=1/(se*Math.sqrt(2*Math.PI));const xs=[],ps=[];
    for(let j=0;j<=n;j++){const x=j/n;if(x>X[1]+h)break;xs.push(x);ps.push(a[j]);M=Math.max(M,a[j]/h);}
    /* des dents fines tant que le pas est large : la loi de p̂ est un peigne, pas une densité */
    const w=Math.min(0.42*h,0.0025);
    if(P.sx(h)-P.sx(0)>=3.2)xs.forEach((x,i)=>{if(x-w>=X[0]&&x+w<=X[1]&&ps[i]>1e-9)bar(P,x-w,x+w,Math.min(ps[i]/h/M,1.1),'sl-bar');});
    else lattice(P,xs,ps,h,1/M,X,1.1,'sl-bar');
    curve(P,x=>phiN((x-p)/se)/se/M,X[0],X[1],'sl-c3 dashfn',1.1);
    P.vline(p,'sl-dash');P.text(p+0.002,1.03,'p = 0,02','','start');
    const below=PhiN(-p/se);
    if(below>0.001)P.text(-0.0385,0.93,'p̂ < 0 : impossible','sl-c3','start');
    P.text(0.123,0.93,'▮ loi exacte de p̂','sl-c2','end');P.text(0.123,0.83,'┄ normale N(p, p(1 − p)/n)','sl-c3','end');
    rd(out,[['np, succès attendus',SL.fmt(n*p,1)],['P(aucun succès) = 0,98ⁿ',pct(Math.pow(q,n))],['masse de la normale sous 0',pct(below),'c3'],['asymétrie de p̂',fixed((1-2*p)/Math.sqrt(n*p*q),2)]]);
  }
  SL.slider(document.getElementById('f3sl'),{label:'n (lignes)',min:0,max:3,step:1,value:1,fmt:v=>NS[v].toLocaleString('fr-FR')},draw);
})();

/* ===== Figure 4 : couverture exacte de Wald et de Wilson, en fonction de p puis de np ===== */
(function(){
  const NS=[30,100,1000],CL=['sl-c1','sl-c2','sl-c5'],Z=1.959963984540054;
  const host=document.getElementById('f4plot'),out=document.getElementById('f4out');
  function bounds(n,kind){const lo=new Float64Array(n+1),hi=new Float64Array(n+1);
    for(let k=0;k<=n;k++){const f=k/n;
      if(kind===0){const h=Z*Math.sqrt(f*(1-f)/n);lo[k]=f-h;hi[k]=f+h;}
      else{const c=(f+Z*Z/(2*n))/(1+Z*Z/n),h=Z/(1+Z*Z/n)*Math.sqrt(f*(1-f)/n+Z*Z/(4*n*n));lo[k]=c-h;hi[k]=c+h;}}
    return [lo,hi];}
  function cover(n,p,B){const lp=Math.log(p),lq=Math.log(1-p);let c=0;
    for(let k=0;k<=n;k++)if(B[0][k]<=p&&p<=B[1][k])c+=Math.exp(LF[n]-LF[k]-LF[n-k]+k*lp+(n-k)*lq);return c;}
  const G=320,L0=Math.log10(0.002),L1=Math.log10(0.5),PS=[];
  for(let i=0;i<=G;i++)PS.push(Math.pow(10,L0+(L1-L0)*i/G));
  const B=[[],[]],CV=[[],[]];
  [0,1].forEach(kind=>NS.forEach((n,j)=>{B[kind][j]=bounds(n,kind);CV[kind][j]=PS.map(p=>cover(n,p,B[kind][j]));}));
  const RP=[L0,L1],RN=[-1,Math.log10(500)];
  const TP=[[0.002,0.005,0.01,0.02,0.05,0.1,0.2,0.5],['0,002','0,005','0,01','0,02','0,05','0,1','0,2','0,5']];
  const TN=[[0.1,0.3,1,3,10,30,100,300],['0,1','0,3','1','3','10','30','100','300']];
  const st={u:0,kind:0};const fresh=runner();
  function frame(u){
    st.u=u;host.innerHTML='';
    const a=RP[0]+(RN[0]-RP[0])*u,b=RP[1]+(RN[1]-RP[1])*u;
    const P=SL.plot(host,{x:[a,b],y:[0,1.04],w:560,h:280,xt:[],yt:[0,0.2,0.4,0.6,0.8,1],
      xl:u<0.5?'prévalence p (échelle log)':'succès attendus np (échelle log)'});
    leftAxis(P,a);
    if(u===0||u===1){const T=u?TN:TP;logTicksX(P,T[0],T[1],0,1.04);}
    if(u===0){const x=Math.log10(0.02);P.seg(x,0,x,1.04,'sl-dash');P.text(x+0.03,0.06,'p = 0,02','','start');}
    if(u===1){const x=1;P.seg(x,0,x,1.04,'sl-dash');P.text(x+0.03,0.06,'np = 10','','start');}
    P.seg(a,0.95,b,0.95,'sl-mean');
    NS.forEach((n,j)=>{const sh=u*Math.log10(n),c=CV[st.kind][j];let d='';
      for(let i=0;i<=G;i++){const x=Math.log10(PS[i])+sh;if(x<a||x>b)continue;d+=(d?' L':'M')+P.sx(x).toFixed(1)+' '+P.sy(c[i]).toFixed(1);}
      if(d)SL.el('path',{d:d,class:'sl-fn thin '+CL[j],fill:'none'},P.dyn);});
    const xr=b-(b-a)*0.01;
    P.text(xr,0.47,'couverture réelle ('+(st.kind?'Wilson':'Wald')+')','','end');
    P.text(xr,0.38,'— n = 30','sl-c1','end');P.text(xr,0.29,'— n = 100','sl-c2','end');P.text(xr,0.2,'— n = 1 000','sl-c5','end');
    const np=u>=0.5;
    const th=st.kind?1:10;let lo=1,hi=0;NS.forEach((n,j)=>PS.forEach((p,i)=>{if(n*p>=th){lo=Math.min(lo,CV[st.kind][j][i]);hi=Math.max(hi,CV[st.kind][j][i]);}}));
    rd(out,NS.map((n,j)=>{const p=np?2/n:0.02;return ['n = '+n.toLocaleString('fr-FR')+(np?', np = 2':', p = 0,02'),pct(cover(n,p,B[st.kind][j])),j===0?'c3':''];}).concat([[(st.kind?'Wilson':'Wald')+', min – max dès np ≥ '+th,fixed(100*lo,1)+' – '+fixed(100*hi,1)+' %']]));
  }
  buttons(document.getElementById('f4ctl'),['axe : la prévalence p','axe : les succès attendus np'].map(s=>s.replace(' :',' :')),k=>{
    const tk=fresh(),u0=st.u;if(u0===k){frame(k);return;}tween(900,v=>frame(v<1?u0+(k-u0)*v:k),tk);});
  buttons(document.getElementById('f4ctl2'),['Wald','Wilson'],k=>{st.kind=k;frame(st.u);});
})();
