/* ===== outils propres à l03 ===== */
const ent=v=>String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const fx=(x,d)=>Number(x).toFixed(d).replace('.',',');
const pct=(v,d)=>fx(v*100,d===undefined?1:d)+' %';
const vpp=(pr,se,sp)=>se*pr/(se*pr+(1-sp)*(1-pr));
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
const supn=k=>(k<0?'⁻':'')+String(Math.abs(k)).split('').map(c=>SUP[+c]).join('');
/* 9,8 × 10⁻¹⁴ ; au-dessus de 0,01 on écrit le nombre */
function sci(x,d){if(x===0)return '0';if(x>=0.01)return SL.fmt(x,d===undefined?3:d);const e=Math.floor(Math.log10(x)),m=x/Math.pow(10,e);
  return (Math.abs(m-1)<0.005?'':fx(m,1)+' × ')+'10'+supn(e);}
const cote=o=>o<1?'1:'+SL.fmt(1/o,1/o>=100?0:1):SL.fmt(o,o>=100?0:2)+':1';
/* un SVG nu, en pixels, pour les schémas qui n'ont pas d'axes */
function canvas(host,W,H){return SL.el('svg',{viewBox:`0 0 ${W} ${H}`,class:'sl-plot'},host);}
function txt(parent,x,y,s,cls,anchor){const t=SL.el('text',{x:x.toFixed?x.toFixed(1):x,y:y.toFixed?y.toFixed(1):y,class:cls||'sl-lbl','text-anchor':anchor||'start'},parent);t.textContent=s;return t;}
function box(parent,x,y,w,h,cls){return SL.el('rect',{x:x.toFixed(1),y:y.toFixed(1),width:Math.max(0,w).toFixed(1),height:Math.max(0,h).toFixed(1),class:cls},parent);}
function noAxes(P){P.svg.querySelectorAll('line.sl-axis').forEach(l=>l.remove());}
/* graduations posées à la main quand l'abscisse est un log */
function logticks(P,pairs,ytop,y0){const g=SL.el('g',{class:'sl-grid'},P.layer);const yb=y0===undefined?0:y0;
  pairs.forEach(function(pl){const X=P.sx(Math.log10(pl[0]));
    SL.el('line',{x1:X,x2:X,y1:P.sy(ytop),y2:P.sy(yb)},g);
    const tx=SL.el('text',{x:X,y:P.sy(yb)+16,'text-anchor':'middle',class:'sl-tick'},P.layer);tx.textContent=pl[1];});}

/* ===== Figure 1 : le même numérateur, deux dénominateurs ===== */
(function(){
  const host=document.getElementById('f1plot'),out=document.getElementById('f1out');host.classList.add('nogrid');
  const P=SL.plot(host,{x:[0,1],y:[0,1],w:500,h:492,xt:[],yt:[]});noAxes(P);
  const X0=P.sx(0),Y0=P.sy(1),WW=P.sx(1)-P.sx(0),HH=P.sy(0)-P.sy(1);
  const cp=SL.el('clipPath',{id:'f1clip'},P.svg);SL.el('rect',{x:X0,y:Y0,width:WW,height:HH},cp);
  const g=SL.el('g',{'clip-path':'url(#f1clip)'},P.svg),inner=SL.el('g',{},g),lab=SL.el('g',{},P.svg);
  const A=[0.1,0.6,0.2,0.8],st={c:0.6,w:0.4,z:0};const fresh=runner();
  function rectXY(r,cls){const a=P.sx(r[0]),b=P.sx(r[1]),c=P.sy(r[3]),d=P.sy(r[2]);
    return SL.el('rect',{x:a.toFixed(1),y:c.toFixed(1),width:Math.max(0,b-a).toFixed(1),height:Math.max(0,d-c).toFixed(1),class:cls,'vector-effect':'non-scaling-stroke'},inner);}
  function Bbox(){return [Math.max(0,st.c-st.w/2),Math.min(1,st.c+st.w/2),0.3,0.9];}
  function draw(){
    while(inner.firstChild)inner.removeChild(inner.firstChild);while(lab.firstChild)lab.removeChild(lab.firstChild);
    const B=Bbox(),I=[Math.max(A[0],B[0]),Math.min(A[1],B[1]),Math.max(A[2],B[2]),Math.min(A[3],B[3])];
    const aA=(A[1]-A[0])*(A[3]-A[2]),aB=(B[1]-B[0])*(B[3]-B[2]),aI=Math.max(0,I[1]-I[0])*Math.max(0,I[3]-I[2]);
    rectXY([0,1,0,1],'sl-omega');rectXY(A,'sl-setA');rectXY(B,'sl-setB');if(aI>0)rectXY(I,'sl-setAB');
    /* zoom : l'image de B devient le carré entier */
    const u=st.z,bx=P.sx(B[0]),by=P.sy(B[3]),bw=P.sx(B[1])-bx,bh=P.sy(B[2])-by;
    const s1=1+u*(WW/bw-1),s2=1+u*(HH/bh-1),tx=bx+u*(X0-bx)-s1*bx,ty=by+u*(Y0-by)-s2*by;
    inner.setAttribute('transform',`translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s1.toFixed(4)} ${s2.toFixed(4)})`);
    if(u<0.5){txt(lab,P.sx(0.02),P.sy(0.97),'Ω, aire 1','sl-lbl');txt(lab,P.sx(A[0])+6,P.sy(A[2])-8,'A','sl-c2');txt(lab,P.sx(B[1])-6,P.sy(B[3])+16,'B','sl-c4','end');}
    else txt(lab,X0+8,Y0+18,'B est devenu l’univers\u202f; A ∩ B en occupe '+pct(aI/aB,0),'sl-lbl');
    rd(out,[['P(A)',fx(aA,2)],['P(B)',fx(aB,2)],['P(A ∩ B), le numérateur commun',fx(aI,2)],
      ['P(A ∣ B) = P(A ∩ B) / P(B)',fx(aI/aB,2),'c3'],['P(B ∣ A) = P(A ∩ B) / P(A)',fx(aI/aA,2),'c1']]);
  }
  const ctl=document.getElementById('f1ctl'),zb=SL.h('button','tb',ctl,'zoomer sur B');
  zb.onclick=()=>{const tk=fresh(),a=st.z,b=a<0.5?1:0;zb.textContent=b?'revenir à Ω':'zoomer sur B';zb.setAttribute('aria-pressed',String(!!b));
    tween(900,v=>{st.z=a+(b-a)*v;draw();},tk);};
  const sl=document.getElementById('f1sl');
  SL.slider(sl,{label:'position de B',min:0.2,max:0.8,step:0.01,value:0.6,fmt:v=>SL.fmt(v,2)},v=>{st.c=v;draw();});
  SL.slider(sl,{label:'largeur de B',min:0.1,max:0.6,step:0.01,value:0.4,fmt:v=>SL.fmt(v,2)},v=>{st.w=v;draw();});
})();

/* ===== Figure 2 : les effectifs (portée de p00-03, figure 1) ===== */
(function(){
  const N=100000;
  const P=SL.plot(document.getElementById('f2plot'),{x:[0,1],y:[0,1],w:620,h:340});noAxes(P);
  const out=document.getElementById('f2out'),st={prev:.001,se:.99,sp:.99};
  const ROWS=[{y0:.78,y1:.90},{y0:.44,y1:.56},{y0:.10,y1:.22}],FL=3;
  function hbar(row,parts,scale){
    const y0=ROWS[row].y0,y1=ROWS[row].y1,key=parts.map(p=>scale==='sqrt'?Math.sqrt(Math.max(p.n,0)):Math.max(p.n,0));
    const tot=key.reduce((a,b)=>a+b,0)||1,Xa=P.sx(0),Wpx=P.sx(1)-Xa,brut=key.map(k=>k/tot*Wpx);
    const manque=brut.reduce((a,w)=>a+Math.max(0,FL-w),0),large=brut.reduce((a,w)=>a+Math.max(0,w-FL),0)||1;
    const w=brut.map(v=>v<FL?FL:v-(v-FL)*manque/large);let x=Xa;
    parts.forEach(function(p,i){SL.el('rect',{x:x,y:P.sy(y1),width:w[i],height:P.sy(y0)-P.sy(y1),class:'sl-dot '+p.cls},P.dyn);x+=w[i];});
    let lx=Xa;const ly=P.sy(y0)+14;
    parts.forEach(function(p){const s=p.lab+' · '+ent(p.n);
      SL.el('rect',{x:lx,y:ly-9,width:9,height:9,class:'sl-dot '+p.cls},P.dyn);
      txt(P.dyn,lx+14,ly,s,'sl-tick');lx+=14+s.length*7+22;});
  }
  function title(row,s){txt(P.dyn,P.sx(0),P.sy(ROWS[row].y1)-9,s,'sl-lbl');}
  function draw(){
    P.clear();
    const cas=N*st.prev,sains=N-cas,TP=cas*st.se,FN=cas-TP,FP=sains*(1-st.sp),TN=sains-FP,pos=TP+FP,neg=FN+TN,v=TP/pos,vn=TN/neg;
    title(0,'La population testée · '+ent(N)+' personnes');
    hbar(0,[{n:cas,cls:'sl-c1',lab:'malades'},{n:sains,cls:'sl-c2',lab:'sains'}],'sqrt');
    title(1,'Les positifs · '+ent(pos)+'  —  P(malade ∣ +) = '+pct(v));
    hbar(1,[{n:TP,cls:'sl-c1',lab:'vrais positifs'},{n:FP,cls:'sl-c3',lab:'faux positifs'}],'lin');
    title(2,'Les négatifs · '+ent(neg)+'  —  P(sain ∣ −) = '+pct(vn,3));
    hbar(2,[{n:FN,cls:'sl-c5',lab:'faux négatifs'},{n:TN,cls:'sl-c2',lab:'vrais négatifs'}],'lin');
    rd(out,[['vrais positifs',ent(TP),'c1'],['faux positifs',ent(FP),'c3'],['positifs au total',ent(pos)],
      ['P(malade ∣ +), la VPP',pct(v),'c3'],['faux négatifs',ent(FN)],['P(sain ∣ −), la VPN',pct(vn,3)]]);
  }
  const host=document.getElementById('f2sl');
  const sPrev=SL.slider(host,{label:'prévalence',min:-3,max:Math.log10(.5),step:.01,value:-3,fmt:v=>pct(Math.pow(10,v),v<-2.4?2:1)},v=>{st.prev=Math.pow(10,v);draw();});
  const sSe=SL.slider(host,{label:'sensibilité',min:.60,max:.99,step:.01,value:.99},v=>{st.se=v;draw();});
  const sSp=SL.slider(host,{label:'spécificité',min:.75,max:.999,step:.001,value:.99},v=>{st.sp=v;draw();});
  const pre=[['cancer · Brunton 10',-3,.99,.99],['drogue · Brunton 11',-1,.90,.90],['drogue, spécificité 0,8',-1,.90,.80],['dépistage · 1 %',-2,.90,.95],['consultation · 10 %',-1,.90,.95]];
  buttons(document.getElementById('f2pre'),pre.map(q=>q[0]),k=>{const q=pre[k];sSe.set(q[2]);sSp.set(q[3]);sPrev.set(q[1]);});
})();

/* ===== Figure 3 : l'échelle des cotes (portée de p00-03, figure 3) ===== */
(function(){
  const P=SL.plot(document.getElementById('f3plot'),{x:[-3.25,2.25],y:[0,1],w:620,h:270,xt:[],yt:[],xl:'cote (log)'});
  {const ax=P.svg.querySelectorAll('line.sl-axis');if(ax[1])ax[1].remove();}  /* l'axe vertical en x = 0 (cote 1:1) n'a pas de sens ici */
  logticks(P,[[.001,'1:1000'],[.01,'1:100'],[.1,'1:10'],[1,'1:1'],[10,'10:1'],[100,'100:1']],1);
  const YA=.74,YB=.26;
  [[YA,.14,'avant le test, la population','sl-c1'],[YB,-.19,'après le test, le patient','sl-c3']].forEach(function(r){
    SL.el('line',{x1:P.sx(-3.25),x2:P.sx(2.25),y1:P.sy(r[0]),y2:P.sy(r[0]),class:'sl-axis'},P.layer);
    P.label(2.2,r[0]+r[1],r[2],r[3],'end');});
  const out=document.getElementById('f3out'),st={prev:.001,lr:99};
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function draw(){
    P.clear();
    const a=st.prev/(1-st.prev),b=a*st.lr,xa=clamp(Math.log10(a),-3.2,2.2),xb=clamp(Math.log10(b),-3.2,2.2);
    P.arrow(xa,YA,xb,YB,'gain');P.dot(xa,YA,'sl-c1',6);P.dot(xb,YB,'sl-c3',6);
    P.text((xa+xb)/2+.18,.56,'× LR = '+SL.fmt(st.lr,1),'sl-halo','start');
    P.text(clamp(xa,-2.85,1.85),YA+.07,cote(a),'sl-c1','middle');
    P.text(clamp(xb,-2.85,1.85),YB-.09,cote(b),'sl-c3','middle');
    rd(out,[['cote a priori',cote(a)],['LR appliqué','× '+SL.fmt(st.lr,1)],['cote a posteriori',cote(b)],
      ['P(malade ∣ +) après le test',pct(b/(1+b)),'c3'],['P(malade) avant, la prévalence',pct(st.prev,2)],['croyance multipliée par','× '+SL.fmt((b/(1+b))/st.prev,2)]]);
  }
  const host=document.getElementById('f3sl');
  SL.slider(host,{label:'prévalence',min:-3,max:Math.log10(.5),step:.01,value:-3,fmt:v=>pct(Math.pow(10,v),v<-2.4?2:1)},v=>{st.prev=Math.pow(10,v);draw();});
  SL.slider(host,{label:'LR⁺',min:1,max:100,step:.5,value:99,fmt:v=>SL.fmt(v,1)},v=>{st.lr=v;draw();});
})();

/* ===== Figure 4 : doubler la cote ne double pas la probabilité ===== */
(function(){
  const P=SL.plot(document.getElementById('f4plot'),{x:[0,1],y:[0,1.04],w:560,h:330,xt:[0,.2,.4,.6,.8,1],yt:[0,.2,.4,.6,.8,1],xl:'p de départ',yl:'p après × k sur la cote'});
  const out=document.getElementById('f4out'),st={k:2,p:.5};
  P.seg(0,0,1,1,'sl-link');
  P.label(.98,.13,'── vraie p : kp / (1 + (k − 1)p)','sl-c1','end');P.label(.98,.05,'┄┄ k × p, la fausse intuition','sl-c3','end');
  let cur=null;
  function draw(){
    if(cur)cur.remove();const k=st.k,p=st.p,f=x=>k*x/(1+(k-1)*x);
    cur=P.fn(f,'sl-c1',200);P.clear();
    P.seg(0,0,Math.min(1,1/k),Math.min(1,k),'sl-c3 sl-dash');
    const q=f(p),naive=k*p;
    if(naive<=1.04){P.seg(p,q,p,Math.min(naive,1.04),'sl-c3');P.dot(p,Math.min(naive,1.04),'hollow sl-c3',5);}
    P.dot(p,q,'sl-c1',6);
    const c=p/(1-p);
    rd(out,[['p de départ',SL.fmt(p,2)],['cote → cote × k',SL.fmt(c,c<1?3:2)+' → '+SL.fmt(k*c,k*c<1?3:2)],['nouvelle p',SL.fmt(q,3),'c1'],
      ['k × p, faux',naive>1?fx(naive,2)+' > 1':SL.fmt(naive,3),'c3'],['p multipliée par',SL.fmt(k/(1+(k-1)*p),2)]]);
  }
  const host=document.getElementById('f4sl');
  SL.slider(host,{label:'facteur k',min:1,max:10,step:.5,value:2,fmt:v=>'× '+SL.fmt(v,1)},v=>{st.k=v;draw();});
  SL.slider(host,{label:'p de départ',min:.01,max:.95,step:.01,value:.5,fmt:v=>SL.fmt(v,2)},v=>{st.p=v;draw();});
})();

/* ===== Figure 5 : la précision en fonction de la prévalence (portée de p00-03, figure 2) ===== */
(function(){
  const XMIN=-3,XMAX=Math.log10(.5),SE=.90;
  const P=SL.plot(document.getElementById('f5plot'),{x:[XMIN,XMAX],y:[0,1.05],w:620,h:300,xt:[],yt:[.25,.5,.75,1],xl:'prévalence (log)',yl:'précision = VPP'});
  logticks(P,[[.001,'0,1 %'],[.003,'0,3 %'],[.01,'1 %'],[.03,'3 %'],[.1,'10 %'],[.3,'30 %']],1.05);
  P.fn(u=>vpp(Math.pow(10,u),SE,.95),'sl-c2');
  const out=document.getElementById('f5out');let cur=null;
  function draw(sp){
    if(cur)cur.remove();cur=P.fn(u=>vpp(Math.pow(10,u),SE,sp),'sl-c1');P.clear();
    [[.01,'1 %'],[.1,'10 %']].forEach(function(mk){const u=Math.log10(mk[0]),y=vpp(mk[0],SE,sp);
      P.vline(u,'chord');P.dot(u,y,'sl-c1',5);P.text(u+0.04,1.0,mk[1],'sl-c3','start');});
    rd(out,[['précision à 1 %',pct(vpp(.01,SE,sp)),'c3'],['précision à 10 %',pct(vpp(.1,SE,sp)),'c3'],['rappel, inchangé',SL.fmt(SE,2)],
      ['FPR = 1 − spécificité',pct(1-sp,2)],['LR⁺ = sens / (1 − spéc)',SL.fmt(SE/(1-sp),1)],['prévalence où précision = 50 %',pct((1-sp)/(SE+1-sp),2)]]);
  }
  SL.slider(document.getElementById('f5sl'),{label:'spécificité',min:.80,max:.999,step:.001,value:.95},draw);
})();

/* ===== Figure 6 : ajouter des composants, avec ou sans cause commune ===== */
(function(){
  const P=SL.plot(document.getElementById('f6plot'),{x:[0.5,10.5],y:[-14.5,2.2],w:560,h:330,xt:[1,2,3,4,5,6,7,8,9,10],yt:[],xl:'n, nombre de composants'});
  noAxes(P);SL.el('line',{x1:P.sx(0.5),x2:P.sx(10.5),y1:P.sy(-14.5),y2:P.sy(-14.5),class:'sl-axis'},P.layer);
  const g=SL.el('g',{class:'sl-grid'},P.layer);
  [0,-2,-4,-6,-8,-10,-12,-14].forEach(e=>{SL.el('line',{x1:P.sx(0.5),x2:P.sx(10.5),y1:P.sy(e),y2:P.sy(e)},g);
    txt(P.layer,P.sx(0.5)-6,P.sy(e)+4,e===0?'1':'10'+supn(e),'sl-tick','end');});
  txt(P.layer,P.sx(0.62),P.sy(1.4),'── série','sl-lbl sl-c3');txt(P.layer,P.sx(2.4),P.sy(1.4),'── parallèle','sl-lbl sl-c4');txt(P.layer,P.sx(4.4),P.sy(1.4),'── parallèle avec cause commune q','sl-lbl sl-c2');
  const out=document.getElementById('f6out'),st={p:.05,q:-3};
  /* une courbe qui sort par le bas est coupée au bord de l'axe, jamais bornée : un palier ferait croire à un plancher */
  function line(vals,cls){const Y=vals.map(v=>Math.log10(v)),B=-14.5;let d='';
    for(let i=0;i<Y.length;i++){if(Y[i]>=B){d+=(d?' L':'M')+P.sx(i+1).toFixed(1)+' '+P.sy(Y[i]).toFixed(1);}
      else{if(i>0&&Y[i-1]>=B){const t=(Y[i-1]-B)/(Y[i-1]-Y[i]);d+=' L'+P.sx(i+t).toFixed(1)+' '+P.sy(B).toFixed(1);}break;}}
    SL.el('path',{d:d,class:'sl-fn '+cls,fill:'none'},P.dyn);Y.forEach((y,i)=>{if(y>=B)P.dot(i+1,y,cls,3.5);});}
  function draw(){
    P.clear();const p=st.p,q=Math.pow(10,st.q),n=[1,2,3,4,5,6,7,8,9,10];
    const se=n.map(k=>1-Math.pow(1-p,k)),pa=n.map(k=>Math.pow(p,k)),cc=n.map(k=>q+(1-q)*Math.pow(p,k));
    P.seg(0.5,st.q,10.5,st.q,'sl-c2 sl-dash');
    line(se,'sl-c3');line(cc,'sl-c2');line(pa,'sl-c4');
    rd(out,[['série, n = 10',sci(se[9]),'c3'],['parallèle, n = 10',sci(pa[9])],['parallèle + cause commune',sci(cc[9])],['le plancher q',sci(q)]]);
  }
  const host=document.getElementById('f6sl');
  SL.slider(host,{label:'panne p',min:.01,max:.2,step:.01,value:.05,fmt:v=>SL.fmt(v,2)},v=>{st.p=v;draw();});
  SL.slider(host,{label:'cause q',min:-7,max:-2,step:1,value:-3,fmt:v=>'10'+supn(v)},v=>{st.q=v;draw();});
})();
