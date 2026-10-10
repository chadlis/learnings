/* signe moins typographique et milliers séparés, pour les readouts */
function fm(x,d){return SL.fmt(x,d).replace(/^-/,'−');}
function fi(n){return Math.round(n).toLocaleString('fr-FR');}

/* ===== Figure 1 : trois lois de moyenne 10 sous l'hyperbole de Markov ===== */
(function(){
  const out=document.getElementById('f1out');
  const P=SL.plot(document.getElementById('f1plot'),{x:[0,50],y:[0,1.08],w:560,h:270,xt:[0,10,20,30,40,50],yt:[0,0.25,0.5,0.75,1],xl:'seuil a',yl:'P(X ≥ a)'});
  const L=[{n:'exponentielle, moyenne 10',S:a=>Math.exp(-a/10)},
           {n:'uniforme sur [0, 20]',S:a=>a<=0?1:a>=20?0:1-a/20},
           {n:'deux points, 0 et 20',S:a=>a<=0?1:a<=20?0.5:0}];
  const st={l:0,a:20};
  function draw(){
    P.clear();const L0=L[st.l],a=st.a;
    curve(P,x=>10/x,10/1.08,50,'sl-c3',1.08);
    if(st.l===2){P.seg(0,1,0,0.5,'sl-c4');P.seg(0,0.5,20,0.5,'sl-c4');P.seg(20,0.5,20,0,'sl-c4 sl-dash');P.seg(20,0,50,0,'sl-c4');P.dot(20,0.5,'sl-c4',4);P.dot(20,0,'hollow sl-c4',4);}
    else curve(P,L0.S,0,50,'sl-c4',1.08);
    P.vline(a,'sl-dash');
    const p=L0.S(a),b=10/a;
    if(b<=1.08)P.dot(a,b,'sl-c3',5);
    P.dot(a,p,'sl-c4',5);
    P.text(49.5,1.0,'│ borne de Markov E[X]/a = 10/a','sl-c3','end');
    P.text(49.5,0.9,'│ P(X ≥ a), '+L0.n,'sl-c4','end');
    rd(out,[['P(X ≥ a), cette loi',SL.fmt(p,3),'c1'],['borne 10/a',b>=1?SL.fmt(b,2)+' ≥ 1':SL.fmt(b,3),'c3'],['borne / vraie valeur',p>0?SL.fmt(b/p,1):'infini']]);
  }
  buttons(document.getElementById('f1ctl'),L.map(l=>l.n),k=>{st.l=k;draw();});
  SL.slider(document.getElementById('f1sl'),{label:'seuil a',min:1,max:50,step:0.5,value:20,fmt:v=>SL.fmt(v,1)},v=>{st.a=v;draw();});
})();

/* ===== Figure 2 : la matrice de covariance, case par case ===== */
(function(){
  const out=document.getElementById('f2out'),n=6,host=document.getElementById('f2plot');host.classList.add('nogrid');
  const P=SL.plot(host,{x:[-0.2,6.5],y:[0.5,7.1],w:560,h:330,xt:[],yt:[]});
  const ax=P.svg.querySelectorAll('line.sl-axis');ax.forEach(e=>e.remove());
  const sub='₀₁₂₃₄₅₆';
  for(let j=1;j<=n;j++){const t=SL.el('text',{x:P.sx(j).toFixed(1),y:(P.sy(6.62)).toFixed(1),'text-anchor':'middle',class:'sl-tick'},P.layer);t.textContent='X'+sub[j];}
  for(let i=1;i<=n;i++){const t=SL.el('text',{x:P.sx(0.3).toFixed(1),y:(P.sy(7-i)+4).toFixed(1),'text-anchor':'middle',class:'sl-tick'},P.layer);t.textContent='X'+sub[i];}
  const C=[{v:[1,1,1,1,1,1],r:0,lost:'aucune'},{v:[1,1,1,1,1,4],r:0,lost:'la même loi'},{v:[1,1,1,1,1,1],r:0.5,lost:'l’indépendance'},{v:[1,1,1,1,1,1],r:1,lost:'l’indépendance'}];
  function draw(k){
    P.clear();const c=C[k];let d=0,o=0;
    for(let i=1;i<=n;i++)for(let j=1;j<=n;j++){
      const val=i===j?c.v[i-1]:c.r*Math.sqrt(c.v[i-1]*c.v[j-1]),y=7-i;
      if(i===j)d+=val;else o+=val;
      rect(P,j-0.47,j+0.47,y-0.45,y+0.45,'sl-cello');
      if(val>1e-9)rect(P,j-0.47,j+0.47,y-0.45,y+0.45,'sl-cellp').setAttribute('fill-opacity',(0.12+0.13*Math.min(val,4)).toFixed(3));
      P.text(j,y-0.14,SL.fmt(val,2),'sl-prod'+(val>1e-9?' on':''),'middle');
    }
    rd(out,[['diagonale, Σ Var(Xᵢ)',SL.fmt(d,2)],['hors diagonale, Σ Cov',SL.fmt(o,2)],['Var(X̄) = somme / 36',SL.fmt((d+o)/36,3),'c3'],['hypothèse retirée',c.lost]]);
  }
  buttons(document.getElementById('f2ctl'),['i.i.d.','variances inégales','corrélées, ρ = 0,5','copies, ρ = 1'],draw);
})();

/* ===== Figure 3 : un chemin, deux lectures (reprise de p00-04, figure 2) ===== */
(function(){
  const SIG=Math.sqrt(35/12),N0=4,NM=1000,out=document.getElementById('f3out');
  const A=SL.plot(document.getElementById('f3a'),{x:[N0,NM],y:[1,6],w:600,h:210,xt:[200,400,600,800,1000],yt:[2,3,4,5],xl:'n (dés cumulés)',yl:'moyenne cumulée'});
  A.fn(n=>3.5+2*SIG/Math.sqrt(n),'sl-c4 band',300);A.fn(n=>3.5-2*SIG/Math.sqrt(n),'sl-c4 band',300);A.fn(()=>3.5,'sl-c4',2);
  A.label(990,5.55,'┄ ± 2σ/√n autour de μ = 3,5','sl-c4','end');
  const B=SL.plot(document.getElementById('f3b'),{x:[N0,NM],y:[-130,130],w:600,h:210,xt:[200,400,600,800,1000],yt:[-100,-50,0,50,100],xl:'n (dés cumulés)',yl:'somme cumulée − 3,5n'});
  B.fn(n=>2*SIG*Math.sqrt(n),'sl-c4 band',300);B.fn(n=>-2*SIG*Math.sqrt(n),'sl-c4 band',300);
  B.label(990,118,'┄ ± 2σ√n','sl-c4','end');
  const clamp=(v,a,b)=>v<a?a:v>b?b:v;
  function poly(P,pts,cls){let d='';pts.forEach((p,i)=>{d+=(i?' L':'M')+P.sx(p[0]).toFixed(1)+' '+P.sy(p[1]).toFixed(1);});SL.el('path',{d:d,class:'sl-fn '+cls,fill:'none'},P.dyn);}
  let seed=1;
  function path(){
    const r=rng(seed);A.clear();B.clear();let s=0;const pa=[],pb=[];
    for(let i=1;i<=NM;i++){s+=1+Math.floor(6*r());if(i>=N0){pa.push([i,clamp(s/i,1,6)]);pb.push([i,clamp(s-3.5*i,-130,130)]);}}
    poly(A,pa,'sl-c3 thin');poly(B,pb,'sl-c3 thin');
    rd(out,[['moyenne après 1 000 dés',SL.fmt(s/NM,3),'c3'],['écart de la moyenne à 3,5',SL.fmt(Math.abs(s/NM-3.5),3)],['somme − 3 500',fm(s-3.5*NM,0),'c3']]);
  }
  path();
  SL.h('button','tb',document.getElementById('f3ctl'),'nouveau chemin').onclick=()=>{seed++;path();};
})();
