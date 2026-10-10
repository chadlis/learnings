/* ===== outils propres à l02 ===== */
function fx(x,d){return x.toFixed(d).replace('.',',');}
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';function sup(n){return String(n).split('').map(c=>SUP[+c]).join('');}
function comb(n,k){if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r;}

/* ===== Figure 1 : trois conséquences, trois découpages disjoints ===== */
(function(){
  const P=SL.plot(document.getElementById('f1plot'),{x:[0,1],y:[0,1],w:560,h:210,xt:[0,0.2,0.4,0.6,0.8,1],yt:[],xl:'aire = probabilité'});
  const out=document.getElementById('f1out'),PB=0.6,st={m:0,a:0.3};
  function piece(x0,x1,cls,txt){if(x1-x0<1e-9)return;rect(P,x0,x1,0.4,0.76,cls);if(txt&&x1-x0>0.075)P.text((x0+x1)/2,0.54,txt,'l2-pl','middle');}
  function draw(){
    P.clear();const a=st.a;
    if(st.m===0){
      piece(0,a,'sl-k2 sl-kc','A');piece(a,1,'sl-k5 sl-kc','Aᶜ');
      P.text(0.5,0.86,'Ω = A ∪ Aᶜ, deux morceaux disjoints','','middle');
      P.text(0.5,0.16,'P(A) + P(Aᶜ) = '+fx(a,2)+' + '+fx(1-a,2)+' = 1 = P(Ω)','l2-eqt','middle');
      rd(out,[['P(A)',fx(a,2)],['P(Aᶜ) = 1 − P(A)',fx(1-a,2),'c3'],['P(A) + P(Aᶜ), axiomes 3 et 1','1']]);
    }else if(st.m===1){
      piece(0,a,'sl-k2 sl-kc','A');piece(a,PB,'sl-k4 sl-kc','B ∩ Aᶜ');piece(PB,1,'l2-rest','');
      rect(P,0,PB,0.37,0.79,'l2-bbox');
      P.text(PB/2,0.86,'B, d’aire 0,6, contient A','sl-c4','middle');
      P.text(0.5,0.16,'P(B) = P(A) + P(B ∩ Aᶜ) = '+fx(a,2)+' + '+fx(PB-a,2)+' ≥ P(A)','l2-eqt','middle');
      rd(out,[['P(A)',fx(a,2)],['P(B ∩ Aᶜ) ≥ 0, axiome 2',fx(PB-a,2)],['P(B) = P(A) + P(B ∩ Aᶜ)','0,6','c3']]);
    }else{
      piece(0,1,'sl-k5 sl-kc','Ω tout entier');
      P.text(0.5,0.86,'∅ n’a aucune issue, il n’y a rien à peindre','','middle');
      P.text(0.5,0.16,'Ω = Ω ∪ ∅, disjoints, donc P(Ω) = P(Ω) + P(∅)','l2-eqt','middle');
      rd(out,[['P(Ω)','1'],['P(Ω ∪ ∅) = P(Ω) + P(∅)','1 = 1 + P(∅)'],['P(∅)','0','c3']]);
    }
  }
  const f1sl=document.getElementById('f1sl');
  buttons(document.getElementById('f1ctl'),['complément','monotonie, A ⊆ B','l’impossible, ∅'],k=>{st.m=k;f1sl.style.display=k===2?'none':'';draw();});
  SL.slider(document.getElementById('f1sl'),{label:'P(A)',min:0.05,max:0.55,step:0.01,value:0.3,fmt:v=>fx(v,2)},v=>{st.a=v;draw();});
})();

/* ===== Figure 2 : deux modèles, un test set de 100 exemples ===== */
(function(){
  const P=SL.plot(document.getElementById('f2plot'),{x:[-0.6,19.6],y:[-0.6,5.5],w:560,h:220,xt:[],yt:[]});
  P.svg.querySelectorAll('line.sl-axis').forEach(l=>l.remove());
  const out=document.getElementById('f2out'),r=rng(7),perm=[...Array(100).keys()];
  for(let i=99;i>0;i--){const j=Math.floor(r()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]];}
  const xy=i=>[i%20,4-Math.floor(i/20)];
  P.label(-0.4,5.0,'● A seul se trompe','sl-c2','start');P.label(5.4,5.0,'● B seul','sl-c4','start');P.label(9.0,5.0,'● les deux','sl-c3','start');P.label(13.0,5.0,'○ aucun ne se trompe','','start');
  function draw(c){
    P.clear();const A=new Set(perm.slice(0,10)),B=new Set(perm.slice(0,c).concat(perm.slice(10,10+8-c)));
    for(let i=0;i<100;i++){const[x,y]=xy(i),a=A.has(i),b=B.has(i);
      P.dot(x,y,a&&b?'sl-c3':a?'sl-c2':b?'sl-c4':'hollow l2-ok',a||b?7:5.5);}
    rd(out,[['A se trompe','10'],['B se trompe','8'],['les deux, c',String(c)],['au moins un, 10 + 8 − c',String(18-c),'c3'],['aucun ne se trompe',String(82+c)]]);
  }
  SL.slider(document.getElementById('f2ctl'),{label:'les deux se trompent, c',min:0,max:8,step:1,value:5,fmt:v=>String(v)},draw);
})();

/* ===== Figure 3 : P(partage) selon n ===== */
(function(){
  const P=SL.plot(document.getElementById('f3plot'),{x:[0,80],y:[0,1],w:560,h:290,xt:[0,10,20,30,40,50,60,70,80],yt:[0,0.25,0.5,0.75,1],xl:'n personnes',yl:'probabilité'});
  const out=document.getElementById('f3out'),N=80,ex=[0],ap=[0],me=[0];let q=1;
  for(let n=1;n<=N;n++){q*=(365-(n-1))/365;ex.push(1-q);ap.push(1-Math.pow(364/365,n*(n-1)/2));me.push(1-Math.pow(364/365,n-1));}
  function path(arr,cls){let d='';for(let n=1;n<=N;n++)d+=(d?' L':'M')+P.sx(n).toFixed(1)+' '+P.sy(arr[n]).toFixed(1);SL.el('path',{d:d,class:'sl-fn '+cls,fill:'none'},P.layer);}
  SL.el('line',{x1:P.sx(0),x2:P.sx(80),y1:P.sy(0.5),y2:P.sy(0.5),class:'sl-seg sl-dash'},P.layer);
  path(me,'sl-c5');path(ap,'sl-c4 l2-dashfn');path(ex,'sl-c1');
  P.label(79,0.42,'— exacte','sl-c1','end');P.label(79,0.34,'- - paires supposées indépendantes','sl-c4','end');P.label(79,0.26,'— quelqu’un a ton anniversaire','sl-c5','end');
  function draw(n){
    P.clear();P.vline(n,'sl-c3 sl-dash');
    P.dot(n,ex[n],'sl-c1',5);P.dot(n,ap[n],'hollow sl-c4',5);P.dot(n,me[n],'sl-c5',4.5);
    rd(out,[['n personnes, paires',n+'\u202f; '+(n*(n-1)/2)],['P(partage) exacte',fx(ex[n],4),'c3'],['paires supposées indépendantes',fx(ap[n],4)],['écart, exacte − tirets',fx(ex[n]-ap[n],4)],['quelqu’un a ton anniversaire',fx(me[n],4)]]);
  }
  SL.slider(document.getElementById('f3ctl'),{label:'n personnes',min:2,max:80,step:1,value:23,fmt:v=>String(v)},draw);
})();

/* ===== Figure 4 : hypergéométrique contre binomiale ===== */
(function(){
  const NN=100,K=5,out=document.getElementById('f4out');
  const P=SL.plot(document.getElementById('f4plot'),{x:[-0.6,6.6],y:[0,1],w:560,h:260,xt:[0,1,2,3,4,5],yt:[0,0.25,0.5,0.75,1],xl:'k, défectueuses dans l’échantillon',yl:'P(X = k)'});
  leftAxis(P,-0.6);
  SL.el('text',{x:P.sx(6).toFixed(1),y:(P.sy(0)+16).toFixed(1),'text-anchor':'middle',class:'sl-tick'},P.layer).textContent='≥ 6';
  P.label(6.5,0.94,'▮ sans remise, hypergéométrique','sl-c2','end');P.label(6.5,0.86,'▮ avec remise, binomiale (n, 0,05)','sl-c1','end');
  function draw(n){
    P.clear();const h=[],b=[];
    for(let k=0;k<=6;k++){h.push(k<=Math.min(n,K)?comb(K,k)*comb(NN-K,n-k)/comb(NN,n):0);b.push(k<=n?comb(n,k)*Math.pow(0.05,k)*Math.pow(0.95,n-k):0);}
    let bt=0;for(let k=0;k<6;k++)bt+=b[k];b[6]=Math.max(0,1-bt);
    for(let k=0;k<=6;k++){if(h[k]>0)bar(P,k-0.36,k-0.02,h[k],'sl-bar');if(b[k]>1e-9)bar(P,k+0.02,k+0.36,b[k],'sl-bar3');}
    rd(out,[['P(aucun défaut), sans remise',fx(h[0],3),'c3'],['avec remise, 0,95'+sup(n),fx(b[0],3)],['E[X] = nK/N',fx(n*K/NN,2)]]);
  }
  SL.slider(document.getElementById('f4ctl'),{label:'taille n de l’échantillon',min:1,max:60,step:1,value:10,fmt:v=>String(v)},draw);
})();

/* ===== Figure 5 : la planche de Galton ===== */
(function(){
  const R=10,out=document.getElementById('f5out');
  const P=SL.plot(document.getElementById('f5plot'),{x:[-0.7,10.7],y:[0,2.14],w:560,h:400,xt:[0,1,2,3,4,5,6,7,8,9,10],yt:[],xl:'case k = nombre de rebonds à droite'});
  leftAxis(P,-0.7);
  const pegY=i=>2.0-i*0.096;
  for(let i=0;i<R;i++)for(let j=0;j<=i;j++)SL.el('circle',{cx:P.sx(5-i/2+j).toFixed(1),cy:P.sy(pegY(i)).toFixed(1),r:2.8,class:'l2-peg'},P.layer);
  for(let k=0;k<=R+1;k++)SL.el('line',{x1:P.sx(k-0.5).toFixed(1),x2:P.sx(k-0.5).toFixed(1),y1:P.sy(0).toFixed(1),y2:P.sy(1.0).toFixed(1),class:'l2-bin'},P.layer);
  const st={p:0.5,counts:new Array(R+1).fill(0),balls:[],planned:0};let r=rng(3),seed=3;const fresh=runner();
  function path(){const xs=[5],ys=[2.12];let k=0;for(let i=0;i<R;i++){xs.push(5-i/2+k);ys.push(pegY(i)+0.035);if(r()<st.p)k++;}xs.push(k);ys.push(0.04);return {xs:xs,ys:ys,k:k,t:0};}
  function pmf(k){return comb(R,k)*Math.pow(st.p,k)*Math.pow(1-st.p,R-k);}
  function draw(){
    P.clear();const landed=st.counts.reduce((a,b)=>a+b,0);let pm=0;for(let k=0;k<=R;k++)pm=Math.max(pm,pmf(k));
    const sc=0.92/Math.max(1,st.planned*pm,Math.max(...st.counts));
    for(let k=0;k<=R;k++){if(st.counts[k])bar(P,k-0.38,k+0.38,st.counts[k]*sc,'sl-bar');if(landed)P.dot(k,landed*pmf(k)*sc,'hollow sl-c3',4);}
    st.balls.forEach(b=>{const s=Math.min(R,Math.floor(b.t)),u=b.t-s,x=b.xs[s]+(b.xs[s+1]-b.xs[s])*u,y=b.ys[s]+(b.ys[s+1]-b.ys[s])*u;P.dot(x,y,'l2-ball',4.2);});
    const mean=landed?st.counts.reduce((a,c,k)=>a+c*k,0)/landed:0;
    rd(out,[['billes arrivées',String(landed)],['part en case 5',landed?fx(st.counts[5]/landed,3):'—'],['théorie, case 5',fx(pmf(5),3),'c3'],['case moyenne (théorie 10p = '+fx(10*st.p,1)+')',landed?fx(mean,2):'—']]);
  }
  function instant(n){for(let i=0;i<n;i++)st.counts[path().k]++;st.planned+=n;}
  function reset(){fresh();st.counts.fill(0);st.balls=[];st.planned=0;r=rng(seed=3);instant(200);draw();}
  const ctl=document.getElementById('f5ctl');
  SL.h('button','tb',ctl,'▶ lâcher 200 billes').onclick=()=>{
    if(SL.reduced){instant(200);draw();return;}
    const tk=fresh();st.balls=st.balls.filter(b=>b.t<R+1);st.planned+=200;let left=200;
    loop(tk,()=>{if(left>0){st.balls.push(path());left--;}
      st.balls.forEach(b=>b.t+=0.34);st.balls=st.balls.filter(b=>{if(b.t>=R+1){st.counts[b.k]++;return false;}return true;});
      draw();return left>0||st.balls.length>0;});};
  SL.h('button','tb',ctl,'vider').onclick=()=>{fresh();st.counts.fill(0);st.balls=[];st.planned=0;draw();};
  SL.slider(document.getElementById('f5sl'),{label:'p, rebond à droite',min:0.1,max:0.9,step:0.05,value:0.5,fmt:v=>fx(v,2)},v=>{st.p=v;reset();});
})();
