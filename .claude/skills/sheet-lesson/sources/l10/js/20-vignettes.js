/* ===== v1 : la bascule de Markov, le contrepoids bloqué en 0 ===== */
(function(){
  const out=document.getElementById('v1out');
  const P=SL.plot(document.getElementById('v1plot'),{x:[-9,26],y:[-0.3,1],w:560,h:250,xt:[-5,0,5,10,15,20,25],yt:[],xl:'position x'});
  rect(P,-9,0,-0.3,1,'sl-forbid',P.layer);
  SL.el('text',{x:P.sx(-8.6).toFixed(1),y:P.sy(0.9).toFixed(1),class:'sl-lbl sl-c3'},P.layer).textContent='x < 0 : interdit';
  function draw(p){
    P.clear();
    const c0=p<1?(10-20*p)/(1-p):-1e9,ok=c0>=-1e-9,c=ok?c0:0,mean=20*p+(1-p)*c,th=ok?0:8*Math.tanh((mean-10)/2);
    const cx=P.sx(10),cy=P.sy(0.36);
    const g=SL.el('g',{transform:`rotate(${th.toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})`},P.dyn);
    SL.el('rect',{x:P.sx(-1).toFixed(1),y:(cy-5).toFixed(1),width:(P.sx(21)-P.sx(-1)).toFixed(1),height:5,class:'sl-ruler'},g);
    [[20,p,'p = '+SL.fmt(p,2)],[c,1-p,'1 − p = '+SL.fmt(1-p,2)]].forEach(m=>{if(m[1]<0.004)return;const r=30*Math.sqrt(m[1]);
      SL.el('circle',{cx:P.sx(m[0]).toFixed(1),cy:(cy-5-r).toFixed(1),r:r.toFixed(1),class:'sl-mass'},g);
      const t=SL.el('text',{x:P.sx(m[0]).toFixed(1),y:(cy-11-2*r).toFixed(1),'text-anchor':'middle',class:'sl-lbl sl-halo'},g);t.textContent=m[2];});
    if(!ok){const gx=Math.max(c0,-8.3),r=30*Math.sqrt(1-p);
      SL.el('circle',{cx:P.sx(gx).toFixed(1),cy:(cy-5-r).toFixed(1),r:r.toFixed(1),class:'sl-ghost'},P.dyn);
      const far=c0<-8.3,t=SL.el('text',{x:P.sx(far?-8.8:gx).toFixed(1),y:(P.sy(0.36)+22).toFixed(1),'text-anchor':far?'start':'middle',class:'sl-lbl sl-c3 sl-halo'},P.dyn);t.textContent=(far?'← ':'')+'il faudrait x = '+fm(c0,1);}
    SL.el('path',{d:`M${cx.toFixed(1)} ${cy.toFixed(1)} L${(cx-10).toFixed(1)} ${(cy+22).toFixed(1)} L${(cx+10).toFixed(1)} ${(cy+22).toFixed(1)} Z`,class:'sl-fulcrum'},P.dyn);
    const state=!ok?'bascule : impossible avec X ≥ 0':Math.abs(p-0.5)<1e-9?'cas limite : la loi {0, 20}':'équilibre en 10';
    P.text(25.6,0.92,state,ok?'sl-c1':'sl-c3','end');
    rd(out,[['masse p en 20',SL.fmt(p,2)],['contrepoids 1 − p en',ok?SL.fmt(c0,2):fm(c0,1)+' < 0','c3'],['moyenne de la loi',SL.fmt(mean,2)],['P(X ≥ 20) ≤ 10/20','0,5','c1']]);
  }
  SL.slider(document.getElementById('v1ctl'),{label:'masse p en 20',min:0,max:0.7,step:0.01,value:0.25,fmt:v=>SL.fmt(v,2)},draw);
})();

/* ===== v2 : la part hors de ±kσ, contre 1/k² ===== */
(function(){
  const out=document.getElementById('v2out'),S=Math.sqrt(35/12);
  const P=SL.plot(document.getElementById('v2plot'),{x:[-4.2,4.2],y:[0,1],w:560,h:250,xt:[-4,-3,-2,-1,0,1,2,3,4],yt:[0,0.25,0.5,0.75,1],xl:'écart à μ, en unités de σ',yl:'masse ou densité'});
  const phi=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
  function erfc(x){const t=1/(1+0.3275911*x),y=t*(0.254829592+t*(-0.284496736+t*(1.421413741+t*(-1.453152027+t*1.061405429))));return y*Math.exp(-x*x);}
  const st={l:0,k:2};
  function area(a,b){let d='M'+P.sx(a).toFixed(1)+' '+P.sy(0).toFixed(1);for(let i=0;i<=60;i++){const x=a+(b-a)*i/60;d+=' L'+P.sx(x).toFixed(1)+' '+P.sy(phi(x)).toFixed(1);}d+=' L'+P.sx(b).toFixed(1)+' '+P.sy(0).toFixed(1)+' Z';SL.el('path',{d:d,class:'sl-k3 sl-kc'},P.dyn);}
  function draw(){
    P.clear();const k=st.k;let o=0;
    rect(P,-4.2,-k,0,1,'sl-tail');rect(P,k,4.2,0,1,'sl-tail');
    if(st.l===0){area(-4.2,-k);area(k,4.2);curve(P,phi,-4.2,4.2,'sl-c1',1);o=erfc(k/Math.SQRT2);}
    else if(st.l===1){for(let x=1;x<=6;x++){const z=(x-3.5)/S,far=Math.abs(z)>=k-1e-9;if(far)o+=1/6;bar(P,z-0.09,z+0.09,1/6,far?'sl-bar2':'sl-bar');}}
    else{const m=1/(2*k*k);[[-k,m],[0,1-2*m],[k,m]].forEach(q=>bar(P,q[0]-0.09,q[0]+0.09,q[1],q[0]===0?'sl-bar':'sl-bar2'));o=2*m;}
    P.vline(-k,'sl-c3 sl-dash');P.vline(k,'sl-c3 sl-dash');
    P.text(4.15,0.93,'┆ μ ± kσ','sl-c3','end');
    rd(out,[['k',SL.fmt(k,1)],['hors de ±kσ, cette loi',o>0&&o<0.001?'< 0,1 %':SL.fmt(100*o,1)+' %','c1'],['borne de Chebyshev 1/k²',SL.fmt(100/(k*k),1)+' %','c3']]);
  }
  buttons(document.getElementById('v2ctl'),['normale','dé','trois points'],i=>{st.l=i;draw();});
  SL.slider(document.getElementById('v2sl'),{label:'k',min:1,max:4,step:0.1,value:2,fmt:v=>SL.fmt(v,1)},v=>{st.k=v;draw();});
})();

/* ===== v3 : μ fixe, X̄ la procédure, x̄ la réalisation ===== */
(function(){
  const out=document.getElementById('v3out'),S=Math.sqrt(35/12);
  const P=SL.plot(document.getElementById('v3plot'),{x:[0.5,6.5],y:[0,1],w:560,h:300,xt:[1,2,3,3.5,4,5,6],yt:[],xl:'x̄, moyenne des n dés'});
  const init=[[2,5,1,5],[6,3,4,5],[1,4,3,3]],BW={1:1,4:0.25,16:0.125},CAP=300;
  const st={n:4,xs:[],last:null};const fresh=runner();let seed=37;
  function roll(r){const d=[];for(let i=0;i<st.n;i++)d.push(1+Math.floor(6*r()));return d;}
  function add(d){st.last=d;st.xs.push(d.reduce((a,b)=>a+b,0)/d.length);if(st.xs.length>CAP)st.xs.shift();}
  function draw(){
    P.clear();
    const d=st.last||[],s=22,gap=4,w=d.length*(s+gap)-gap,x0=P.sx(3.5)-w/2,y0=P.sy(0.97);
    d.forEach((v,i)=>{SL.el('rect',{x:(x0+i*(s+gap)).toFixed(1),y:y0.toFixed(1),width:s,height:s,rx:3,class:'sl-die'},P.dyn);
      const t=SL.el('text',{x:(x0+i*(s+gap)+s/2).toFixed(1),y:(y0+s/2+4).toFixed(1),'text-anchor':'middle',class:'sl-cell-t'},P.dyn);t.textContent=String(v);});
    const bw=BW[st.n],cnt=new Map();st.xs.forEach(v=>{const b=Math.round(v/bw);cnt.set(b,(cnt.get(b)||0)+1);});
    let M=1;cnt.forEach(c=>M=Math.max(M,c));
    const avail=P.sy(0)-P.sy(0.64),last=st.xs.length-1;
    if(M<=34){const r=Math.min(4.6,(avail/M-1)/2);stack(P,st.xs,bw,r,i=>i===last?'sl-c1':'sl-c2',true);}
    else{cnt.forEach((c,b)=>bar(P,b*bw-bw*0.42,b*bw+bw*0.42,0.64*c/M,'sl-bar'));P.dot(st.xs[last],0,'sl-c1',5);}
    P.seg(3.5,0,3.5,0.8,'sl-mean');
    P.text(6.45,0.76,'│ μ = 3,5, le paramètre : fixe','sl-c3','end');
    P.text(6.45,0.69,'● une réalisation x̄ par expérience','sl-c2','end');
    const m=st.xs.reduce((a,b)=>a+b,0)/st.xs.length,sd=st.xs.length>1?Math.sqrt(st.xs.reduce((a,b)=>a+(b-m)**2,0)/(st.xs.length-1)):NaN;
    rd(out,[['μ, paramètre fixe','3,5','c3'],['x̄, dernière réalisation',SL.fmt(st.xs[last],4),'c1'],['réalisations de X̄',fi(st.xs.length)],['écart-type des x̄',st.xs.length>=10?SL.fmt(sd,3):'trop peu'],['σ/√n, théorie',SL.fmt(S/Math.sqrt(st.n),3)]]);
  }
  function reset(n){fresh();st.n=n;st.xs=[];if(n===4)init.forEach(add);else{const r=rng(100+n);for(let j=0;j<3;j++)add(roll(r));}draw();}
  buttons(document.getElementById('v3ctl'),['n = 4','n = 1','n = 16'],k=>reset([4,1,16][k]));
  const c2=document.getElementById('v3ctl2');
  SL.h('button','tb',c2,'▶ refaire l’expérience').onclick=()=>{fresh();add(roll(rng(seed++)));draw();};
  SL.h('button','tb',c2,'▶ 100 fois').onclick=()=>{const tk=fresh(),r=rng(seed++);let k=0;loop(tk,()=>{add(roll(r));k++;draw();return k<100;});};
})();

/* ===== v4 : mesures de la vitesse de la lumière, et leur moyenne ===== */
(function(){
  const out=document.getElementById('v4out'),SG=100,NM=300,G=50;
  const P=SL.plot(document.getElementById('v4plot'),{x:[0,NM],y:[-320,320],w:560,h:270,xt:[0,30,100,150,200,250,300],yt:[-300,-200,-100,0,100,200,300],xl:'n, nombre de mesures',yl:'mesure − c (km/s)'});
  const st={law:0,d:[],m:30};let seed=7;const fresh=runner();
  function gen(){const r=rng(seed+(st.law?1003:0)),a=[];for(let i=0;i<NM;i++)a.push(st.law===0?SG*gauss(r):G*Math.tan(Math.PI*(r()-0.5)));st.d=a;}
  function draw(){
    P.clear();const m=st.m,d=st.d;
    if(st.law===0){curve(P,n=>2*SG/Math.sqrt(n),1,NM,'sl-c4 band',320);curve(P,n=>-2*SG/Math.sqrt(n),1,NM,'sl-c4 band',320);}
    for(let i=0;i<m;i++)P.dot(i+1,Math.max(-315,Math.min(315,d[i])),'sl-c2 sl-tiny',2.4);
    let s=0,pd='';for(let i=0;i<m;i++){s+=d[i];const y=Math.max(-320,Math.min(320,s/(i+1)));pd+=(i?' L':'M')+P.sx(i+1).toFixed(1)+' '+P.sy(y).toFixed(1);}
    SL.el('path',{d:pd,class:'sl-fn sl-c3',fill:'none'},P.dyn);
    P.text(296,290,'│ moyenne des n premières mesures','sl-c3','end');if(st.law===0)P.text(296,250,'┄ ± 2σ/√n','sl-c4','end');
    rd(out,[['mesures',String(m)],['moyenne − c',fm(s/m,1)+' km/s','c3'],['± 2σ/√n',st.law===0?SL.fmt(2*SG/Math.sqrt(m),1)+' km/s':'σ infinie'],['dernière mesure − c',fm(d[m-1],0)+' km/s']]);
  }
  buttons(document.getElementById('v4ctl'),['erreurs normales','erreurs de Cauchy'],k=>{fresh();st.law=k;st.m=30;gen();draw();});
  const c2=document.getElementById('v4ctl2');
  SL.h('button','tb',c2,'▶ 270 mesures de plus').onclick=()=>{const tk=fresh();st.m=30;loop(tk,()=>{st.m=Math.min(NM,st.m+3);draw();return st.m<NM;});};
  SL.h('button','tb',c2,'nouvelle série').onclick=()=>{fresh();seed++;st.m=30;gen();draw();};
})();

/* ===== v5 : 4 fois plus d'exemples pour un intervalle 2 fois plus étroit ===== */
(function(){
  const host=document.getElementById('v5plot'),out=document.getElementById('v5out');
  const row=SL.h('div','v-row',host),L=SL.h('div','v-mini',row),R=SL.h('div','',row);
  const S=SL.el('svg',{viewBox:'0 0 220 236',class:'sl-plot sl-mini'},L);
  const cells=[];for(let i=0;i<8;i++)for(let j=0;j<8;j++)cells.push({i:i,j:j,e:SL.el('rect',{x:(13+j*24.5).toFixed(1),y:(8+i*24.5).toFixed(1),width:22,height:22,rx:2,class:'sl-cello'},S)});
  const lab=SL.el('text',{x:110,y:230,'text-anchor':'middle',class:'sl-lbl'},S);
  const P=SL.plot(R,{x:[0.85,0.95],y:[0.4,4.8],w:460,h:250,xt:[0.86,0.88,0.9,0.92,0.94],yt:[],xl:'accuracy'});
  const N=[250,1000,4000,16000],NL=['250','1 000','4 000','16 000'];
  function draw(s){
    const side=1<<s;
    cells.forEach(c=>{const on=c.i<side&&c.j<side;c.e.setAttribute('class',on?'sl-cellp':'sl-cello');if(on)c.e.setAttribute('fill-opacity','0.5');else c.e.removeAttribute('fill-opacity');});
    lab.textContent=NL[s]+' exemples = '+(side*side)+(side>1?' cases':' case');
    P.clear();P.vline(0.9,'sl-c4 sl-dash');
    for(let t=0;t<=s;t++){const y=4.2-t,h=1.96*Math.sqrt(0.09/N[t]),cls=t===s?'sl-c3':'sl-c1';
      P.seg(0.9-h,y,0.9+h,y,cls);P.seg(0.9-h,y-0.12,0.9-h,y+0.12,cls);P.seg(0.9+h,y-0.12,0.9+h,y+0.12,cls);P.dot(0.9,y,cls,4);
      P.text(0.851,y+0.3,'n = '+NL[t]+'   ± '+SL.fmt(100*h,2)+(100*h>=2?' points':' point'),t===s?'sl-c3':'','start');}
    const se=Math.sqrt(0.09/N[s]);
    rd(out,[['exemples annotés n',NL[s]],['SE = √(0,9 × 0,1/n)',SL.fmt(se,4),'c3'],['± 1,96 SE, en points',SL.fmt(196*se,2)],['coût, en multiples de 250',String(side*side)]]);
  }
  const bs=buttons(document.getElementById('v5ctl'),NL.map(x=>'n = '+x),draw);bs[1].onclick();
})();

/* ===== v6 : le plancher ρσ² ===== */
(function(){
  const host=document.getElementById('v6plot'),out=document.getElementById('v6out'),ctl=document.getElementById('v6ctl');
  const row=SL.h('div','v-row',host),L=SL.h('div','',row),R=SL.h('div','v-mini',row);
  const P=SL.plot(L,{x:[0,3.1],y:[0,1.12],w:420,h:260,xt:[],yt:[0,0.25,0.5,0.75,1],xl:'n, échelle log',yl:'Var(X̄) / σ²'});
  [[0,'1'],[1,'10'],[2,'100'],[3,'1 000']].forEach(q=>{const t=SL.el('text',{x:P.sx(q[0]).toFixed(1),y:(P.sy(0)+16).toFixed(1),'text-anchor':'middle',class:'sl-tick'},P.layer);t.textContent=q[1];});
  const B=SL.el('svg',{viewBox:'0 0 200 260',class:'sl-plot sl-mini'},R),bg=SL.el('g',{},B);
  const NS=[1,2,5,10,20,50,100,200,500,1000],st={r:0.5,i:3};
  function draw(){
    P.clear();const r=st.r,n=NS[st.i],v=r+(1-r)/n,x=Math.log10(n);
    curve(P,t=>Math.pow(10,-t),0,3,'sl-c4 band',1.12);
    curve(P,t=>r+(1-r)*Math.pow(10,-t),0,3,'sl-c2',1.12);
    P.seg(0,r,3,r,'sl-c3 sl-dash');P.dot(x,v,'sl-c2',5.5);
    const ly=r>0.7?[0.55,0.47,0.39]:[0.98,0.9,0.82];
    P.text(2.98,ly[0],'┄ ρ = 0 : σ²/n','sl-c4','end');P.text(2.98,ly[1],'│ avec ρ','sl-c2','end');P.text(2.98,ly[2],'┄ plancher ρσ²','sl-c3','end');
    while(bg.firstChild)bg.removeChild(bg.firstChild);
    const Y=y=>230-200*y,own=(1-r)/n;
    SL.el('line',{x1:20,x2:100,y1:230,y2:230,class:'sl-axis'},bg);
    if(r>0)SL.el('rect',{x:34,y:Y(r).toFixed(1),width:44,height:(200*r).toFixed(1),class:'sl-k3 sl-kc'},bg);
    SL.el('rect',{x:34,y:Y(v).toFixed(1),width:44,height:Math.max(0.6,200*own).toFixed(1),class:'sl-k2 sl-kc'},bg);
    const t1=SL.el('text',{x:84,y:(Y(r/2)+4).toFixed(1),class:'sl-lbl sl-c3'},bg);t1.textContent=r>0.04?'commune '+SL.fmt(r,2):'';
    const t2=SL.el('text',{x:84,y:Math.max(14,Math.min(Y(v)+4,Y(r)-10)).toFixed(1),class:'sl-lbl sl-c2'},bg);t2.textContent='propre '+SL.fmt(own,own<0.01?4:3);
    const t3=SL.el('text',{x:56,y:250,'text-anchor':'middle',class:'sl-lbl'},bg);t3.textContent='n = '+String(n).replace('1000','1 000');
    rd(out,[['Var(X̄) / σ²',SL.fmt(v,4),'c3'],['part commune ρσ²',SL.fmt(r,2)+' ('+SL.fmt(100*r/v,0)+' %)'],['part propre (1 − ρ)σ²/n',SL.fmt(own,4)],['n_eff',SL.fmt(1/v,2),'c1']]);
  }
  SL.slider(ctl,{label:'corrélation ρ',min:0,max:1,step:0.05,value:0.5,fmt:v=>SL.fmt(v,2)},v=>{st.r=v;draw();});
  SL.slider(ctl,{label:'n',min:0,max:9,step:1,value:3,fmt:v=>String(NS[v]).replace('1000','1 000')},v=>{st.i=v;draw();});
})();

/* ===== v7 : des fléchettes pour estimer π ===== */
(function(){
  const host=document.getElementById('v7plot'),out=document.getElementById('v7out'),ctl=document.getElementById('v7ctl');
  const row=SL.h('div','v-row',host),L=SL.h('div','',row),R=SL.h('div','',row);
  const A=SL.plot(L,{x:[0,1],y:[0,1.033],w:300,h:300,xt:[0,0.5,1],yt:[0,0.5,1]});
  let d='';for(let i=0;i<=90;i++){const a=Math.PI/2*i/90;d+=(i?' L':'M')+A.sx(Math.cos(a)).toFixed(1)+' '+A.sy(Math.sin(a)).toFixed(1);}
  SL.el('path',{d:d,class:'sl-fn sl-c1',fill:'none'},A.layer);
  const pts=SL.el('g',{},A.layer);
  const NM=5000,q=Math.PI/4;
  const B=SL.plot(R,{x:[0,NM],y:[2.6,3.7],w:300,h:300,xt:[0,2500,5000],yt:[2.8,3,3.2,3.4,3.6],xl:'N',yl:'estimation de π'});
  B.fn(n=>n<40?NaN:Math.PI+8*Math.sqrt(q*(1-q)/n),'sl-c4 band',200);B.fn(n=>n<40?NaN:Math.PI-8*Math.sqrt(q*(1-q)/n),'sl-c4 band',200);B.fn(()=>Math.PI,'sl-c4',2);
  B.label(4950,3.64,'┄ π ± 2 SE','sl-c4','end');
  const st={n:0,k:0,est:[]};let seed=10,r=rng(seed);const fresh=runner();
  function add(m){for(let i=0;i<m&&st.n<NM;i++){const x=r(),y=r(),ins=x*x+y*y<=1;st.n++;if(ins)st.k++;st.est.push(4*st.k/st.n);
    SL.el('circle',{cx:A.sx(x).toFixed(1),cy:A.sy(y).toFixed(1),r:1.8,class:'sl-dot sl-tiny '+(ins?'sl-c4':'sl-c3')},pts);}}
  function draw(){
    B.clear();let pd='';const step=Math.max(1,Math.floor(st.n/600));
    for(let i=9;i<st.n;i+=step){const y=Math.max(2.6,Math.min(3.7,st.est[i]));pd+=(pd?' L':'M')+B.sx(i+1).toFixed(1)+' '+B.sy(y).toFixed(1);}
    if(pd)SL.el('path',{d:pd,class:'sl-fn sl-c3 thin',fill:'none'},B.dyn);
    const e=4*st.k/st.n;
    rd(out,[['fléchettes N',fi(st.n)],['dans le quart de disque',SL.fmt(100*st.k/st.n,1)+' %'],['estimation de π',SL.fmt(e,4),'c3'],['écart à π',SL.fmt(Math.abs(e-Math.PI),4)],['SE théorique',SL.fmt(4*Math.sqrt(q*(1-q)/st.n),4)]]);
  }
  function reset(){fresh();while(pts.firstChild)pts.removeChild(pts.firstChild);st.n=0;st.k=0;st.est=[];r=rng(seed);add(1000);draw();}
  reset();
  SL.h('button','tb',ctl,'+ 100 fléchettes').onclick=()=>{fresh();add(100);draw();};
  SL.h('button','tb',ctl,'▶ jusqu’à 5 000').onclick=()=>{const tk=fresh();loop(tk,()=>{add(60);draw();return st.n<NM;});};
  SL.h('button','tb',ctl,'nouvelle graine').onclick=()=>{seed++;reset();};
})();
