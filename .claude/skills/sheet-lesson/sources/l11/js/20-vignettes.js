/* ===== v1 : n dés, une moyenne, mille fois ; axe brut et axe zoomé ===== */
(function(){
  const NS=[1,2,4,10,30,100],R=1000,host=document.getElementById('v1plot'),out=document.getElementById('v1out');
  const A=SL.plot(SL.h('div','',host),{x:[0.5,6.5],y:[0,2.8],w:560,h:170,xt:[1,2,3,3.5,4,5,6],yt:[0,1,2],xl:'x̄, la moyenne des n dés (axe brut)'});
  leftAxis(A,0.5);
  const B=SL.plot(SL.h('div','',host),{x:[-4,4],y:[0,0.52],w:560,h:170,xt:[-4,-3,-2,-1,0,1,2,3,4],yt:[0,0.2,0.4],xl:'z = (x̄ − 3,5)/(σ/√n), l’axe zoomé'});
  leftAxis(B,-4);
  const fresh=runner();let n=4,seed=1,S=[];
  function sample(r,k){const v=[];for(let i=0;i<k;i++){let s=0;for(let j=0;j<n;j++)s+=1+Math.floor(6*r());v.push(s);}return v;}
  function draw(){
    A.clear();B.clear();const k=S.length,se=SIGD/Math.sqrt(n),hz=1/(n*se);
    curve(A,x=>phiN((x-3.5)/se)/se,0.5,6.5,'sl-c3',2.8);curve(B,phiN,-4,4,'sl-c3',0.52);
    A.text(6.45,2.55,'— normale N(3,5 ; σ²/n)','sl-c3','end');B.text(3.95,0.46,'— N(0, 1)','sl-c3','end');
    if(!k){rd(out,[['expériences','aucune']]);return;}
    const cnt=new Map();let sx=0,sxx=0,in1=0;
    S.forEach(s=>{cnt.set(s,(cnt.get(s)||0)+1);const x=s/n;sx+=x;sxx+=x*x;if(Math.abs((x-3.5)/se)<=1)in1++;});
    /* classes de g sommes voisines (largeur ≥ 0,25 en z) : sinon 1 000 tirages sur 150 barres font des dents de scie */
    const g=Math.max(1,Math.ceil(0.25/hz)),grp=new Map();
    cnt.forEach((c,s)=>{const j=Math.floor((s-n)/g);grp.set(j,(grp.get(j)||0)+c);});
    grp.forEach((c,j)=>{const s0=n+j*g,xc=(s0+(g-1)/2)/n,q=c/k,w=g/n,z=(xc-3.5)/se,wz=g*hz;
      bar(A,xc-0.42*w,xc+0.42*w,Math.min(q/w,2.8),'sl-bar');
      if(Math.abs(z)+0.42*wz<=4)bar(B,z-0.42*wz,z+0.42*wz,Math.min(q/wz,0.52),'sl-bar');});
    const m=sx/k,sd=Math.sqrt(Math.max(0,sxx/k-m*m)*k/Math.max(1,k-1));
    rd(out,[['expériences',String(k)],['SE = σ/√n',fixed(se,3)],['écart-type des x̄ tirés',fixed(sd,3)],['écart-type des z tirés',fixed(sd/se,3),'c1'],['z dans ±1 (normale : 68,3 %)',pct(in1/k)]]);
  }
  SL.slider(document.getElementById('v1sl'),{label:'n (dés par expérience)',min:0,max:5,step:1,value:2,fmt:v=>String(NS[v])},v=>{fresh();n=NS[v];S=sample(rng(seed),R);draw();});
  SL.h('button','tb',document.getElementById('v1ctl'),'▶ refaire 1 000 expériences').onclick=()=>{
    const tk=fresh(),r=rng(++seed);S=[];loop(tk,()=>{S=S.concat(sample(r,25));draw();return S.length<R;});};
})();

/* ===== v2 : trois lois, le même n, standardisées ===== */
(function(){
  const host=document.getElementById('v2plot'),out=document.getElementById('v2out');host.className='v-row three';
  const X=[-3.6,4.4],Y=0.62,names=['dés','exponentielles','Bernoulli(0,02)'];
  const Ps=names.map(()=>SL.plot(SL.h('div','',host),{x:X,y:[0,Y],w:300,h:210,xt:[-3,-2,-1,0,1,2,3,4],yt:[],xl:'z'}));
  Ps.forEach(P=>leftAxis(P,X[0]));
  function draw(n){
    Ps.forEach(P=>P.clear());
    const a=diceLaw(n),m=3.5*n,s=SIGD*Math.sqrt(n),xs=[],ps=[];
    for(let v=n;v<=6*n;v++){xs.push((v-m)/s);ps.push(a[v]);}
    lattice(Ps[0],xs,ps,1/s,1,X,Y);
    const se=1/Math.sqrt(n);curve(Ps[1],z=>se*gammaMean(1+z*se,n),X[0],X[1],'sl-c2',Y);
    const b=binomLaw(n,0.02),sd=Math.sqrt(n*0.02*0.98),xb=[],pb=[];
    for(let k=0;k<=n;k++){const z=(k-n*0.02)/sd;if(z>X[1]+1)break;xb.push(z);pb.push(b[k]);}
    lattice(Ps[2],xb,pb,1/sd,1,X,Y);
    Ps.forEach((P,i)=>{curve(P,phiN,X[0],X[1],'sl-c3 thin',Y);P.text(X[0]+0.2,0.56,n+' '+names[i],'','start');});
    rd(out,[['asymétrie, dés','0'],['asymétrie, exponentielles',fixed(2/Math.sqrt(n),2)],['asymétrie, Bernoulli',fixed(0.96/Math.sqrt(n*0.0196),2)],['échantillons sans succès',pct(Math.pow(0.98,n))]]);
  }
  buttons(document.getElementById('v2ctl'),['n = 30','n = 100','n = 500'],k=>draw([30,100,500][k]));
})();

/* ===== v3 : la même loi, lue en somme et en moyenne ===== */
(function(){
  const host=document.getElementById('v3plot'),out=document.getElementById('v3out');
  const A=SL.plot(SL.h('div','',host),{x:[0,420],y:[0,1.18],w:560,h:170,xt:[0,50,100,150,200,250,300,350,400],yt:[],xl:'somme Sₙ des n dés'});
  const B=SL.plot(SL.h('div','',host),{x:[0.5,6.5],y:[0,1.18],w:560,h:170,xt:[1,2,3,3.5,4,5,6],yt:[],xl:'moyenne X̄ₙ = Sₙ/n'});
  leftAxis(B,0.5);
  function brk(P,a,b){P.seg(a,1.08,b,1.08,'bracket');P.seg(a,1.04,a,1.12,'bracket');P.seg(b,1.04,b,1.12,'bracket');}
  function shape(P,xs,hs,h,X){const px=Math.abs(P.sx(h)-P.sx(0));
    if(px>=3.2){xs.forEach((x,i)=>bar(P,x-0.42*h,x+0.42*h,hs[i],'sl-bar'));return;}
    let d='M'+P.sx(xs[0]).toFixed(1)+' '+P.sy(0).toFixed(1);xs.forEach((x,i)=>{d+=' L'+P.sx(x).toFixed(1)+' '+P.sy(hs[i]).toFixed(1);});
    d+=' L'+P.sx(xs[xs.length-1]).toFixed(1)+' '+P.sy(0).toFixed(1)+' Z';SL.el('path',{d:d,class:'sl-bar'},P.dyn);}
  function draw(n){
    A.clear();B.clear();const a=diceLaw(n),xs=[],hs=[],xm=[];let M=0;
    for(let s=n;s<=6*n;s++)M=Math.max(M,a[s]);
    for(let s=n;s<=6*n;s++){xs.push(s);xm.push(s/n);hs.push(a[s]/M);}
    shape(A,xs,hs,1);shape(B,xm,hs,1/n);
    const m=3.5*n,sd=SIGD*Math.sqrt(n),sm=SIGD/Math.sqrt(n);
    curve(A,s=>phiN((s-m)/sd)/sd/M,0,420,'sl-c3 dashfn',1.18);
    brk(A,m-sd,m+sd);brk(B,3.5-sm,3.5+sm);
    const lx=m>210?6:414,la=m>210?'start':'end';
    A.text(lx,0.93,'┄ normale N(nμ, nσ²)','sl-c3',la);A.text(lx,0.8,'├┤ de −σ à +σ autour du centre','',la);
    rd(out,[['n',String(n)],['E[Sₙ] = 3,5 n',SL.fmt(m,1)],['σ(Sₙ) = 1,708 √n',fixed(sd,2),'c1'],['σ(X̄ₙ) = 1,708/√n',fixed(sm,3)],['largeur relative σ(Sₙ)/E[Sₙ]',pct(sd/m)]]);
  }
  const sl=SL.slider(document.getElementById('v3sl'),{label:'n (dés)',min:1,max:100,step:1,value:100,fmt:v=>String(v)},v=>draw(v));
  const fresh=runner();sl.input.addEventListener('input',()=>fresh());
  SL.h('button','tb',document.getElementById('v3ctl'),'▶ de 1 à 100').onclick=()=>{const tk=fresh();
    if(SL.reduced){sl.set(100);return;}const t0=performance.now();
    loop(tk,()=>{const u=Math.min(1,(performance.now()-t0)/4500),v=Math.max(1,Math.round(100*u));if(v!==sl.get())sl.set(v);return u<1;});};
})();

/* ===== v4 : une moyenne qui ne se resserre pas ===== */
(function(){
  const NS=[1,10,100,1000],X=[-4,4],R=2000,host=document.getElementById('v4plot'),out=document.getElementById('v4out');
  const P=SL.plot(host,{x:X,y:[0,1.14],w:560,h:240,xt:[-4,-3,-2,-1,0,1,2,3,4],yt:[],xl:'moyenne de n mesures, centrée'});
  leftAxis(P,X[0]);
  const cache={},st={c:0,k:2};
  function gen(c,n){const key=c+'_'+n;if(cache[key])return cache[key];const r=rng(1000*c+n+7),v=new Float64Array(R);
    for(let i=0;i<R;i++){let s=0;
      if(c===0){for(let j=0;j<n;j++)s+=Math.tan(Math.PI*(r()-0.5));v[i]=s/n;}
      else if(c===1){v[i]=1+Math.floor(6*r())-3.5;}
      else if(c===2){const C=gauss(r);for(let j=0;j<n;j++)s+=gauss(r);v[i]=SIGD*(Math.sqrt(0.05)*C+Math.sqrt(0.95)*s/n);}
      else{for(let j=0;j<n;j++)s+=1+Math.floor(6*r());v[i]=s/n-3.5;}}
    return cache[key]=v;}
  /* une échelle commune : le cas choisi monte à 0,9 ; la référence, plus concentrée, peut dépasser le cadre */
  function hist(v){const h=new Map();let far=0,outside=0,M=0;
    v.forEach(x=>{if(Math.abs(x)>0.5)far++;if(Math.abs(x)>4){outside++;return;}const b=Math.round(x/0.1);h.set(b,(h.get(b)||0)+1);});
    h.forEach(c=>M=Math.max(M,c));return {h:h,M:M,far:far/v.length,out:outside/v.length};}
  function paint(H,sc,cls){H.h.forEach((c,b)=>bar(P,b*0.1-0.045,b*0.1+0.045,Math.min(c*sc,1.14),cls));}
  function draw(){
    P.clear();const n=NS[st.k],ref=hist(gen(3,n)),cur=st.c===3?ref:hist(gen(st.c,n)),sc=0.9/cur.M;
    if(st.c!==3)paint(ref,sc,'sl-ref');paint(cur,sc,'sl-bar');
    P.vline(0.5,'sl-dash');P.vline(-0.5,'sl-dash');
    P.text(3.95,1.06,'▮ le cas choisi','sl-c2','end');P.text(3.95,0.96,'▮ référence : dés indépendants','','end');
    rd(out,[['n',String(n)],['à plus de 0,5 du centre',pct(cur.far),'c3'],['référence i.i.d., même n',pct(ref.far)],['hors du cadre ±4',pct(cur.out)]]);
  }
  buttons(document.getElementById('v4ctl'),['Cauchy','un dé recopié','corrélées, ρ = 0,05','indépendants'],c=>{st.c=c;draw();});
  SL.slider(document.getElementById('v4sl'),{label:'n (mesures)',min:0,max:3,step:1,value:2,fmt:v=>NS[v].toLocaleString('fr-FR')},v=>{st.k=v;draw();});
})();

/* ===== v5 : 25 sondages, l'intervalle bouge, la vraie part reste ===== */
(function(){
  const N=25,n=1000,p=0.52,host=document.getElementById('v5plot'),out=document.getElementById('v5out');
  const P=SL.plot(host,{x:[0.44,0.6],y:[0,27],w:560,h:300,xt:[0.44,0.46,0.48,0.5,0.52,0.54,0.56,0.58,0.6],yt:[],xl:'part de A dans le sondage'});
  leftAxis(P,0.44);
  const fresh=runner();let seed=1;
  function polls(r){const L=[];for(let i=0;i<N;i++){let k=0;for(let j=0;j<n;j++)if(r()<p)k++;
    const f=k/n,h=1.96*Math.sqrt(f*(1-f)/n);L.push([f,f-h,f+h]);}return L;}
  function draw(L,m){
    P.clear();P.vline(0.5,'sl-dash');P.vline(p,'sl-mean');
    P.text(p+0.001,26.1,'vraie part 0,52','sl-c3','start');P.text(0.499,26.1,'50 %','','end');
    let hit=0,c5=0,half=0;
    for(let i=0;i<m;i++){const f=L[i][0],lo=L[i][1],hi=L[i][2],ok=lo<=p&&p<=hi;if(ok)hit++;if(lo<=0.5&&0.5<=hi)c5++;half+=(hi-lo)/2;
      P.seg(lo,i+1,hi,i+1,'sl-ci'+(ok?'':' miss'));P.dot(f,i+1,ok?'sl-c1':'sl-c3',3.4);}
    rd(out,[['contiennent la vraie part 0,52',hit+' / '+m,'c1'],['contiennent 50 %, indécidables',c5+' / '+m],['demi-largeur moyenne 1,96 SE',m?fixed(half/m,3):'—']]);
  }
  let L=polls(rng(seed));draw(L,N);
  SL.h('button','tb',document.getElementById('v5ctl'),'▶ 25 nouveaux sondages').onclick=()=>{const tk=fresh();L=polls(rng(++seed));
    if(SL.reduced){draw(L,N);return;}const t0=performance.now();
    loop(tk,()=>{const m=Math.min(N,1+Math.floor((performance.now()-t0)/90));draw(L,m);return m<N;});};
})();
