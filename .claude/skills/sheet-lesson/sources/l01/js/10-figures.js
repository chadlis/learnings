/* ===== figure 1 (n2) : compter les cases, ou mesurer leur aire ===== */
(function(){
  const host=document.getElementById('f1plot'),out=document.getElementById('f1out');host.classList.add('nogrid');
  const P=SL.plot(host,{x:[0,1],y:[0,1],w:440,h:432,xt:[],yt:[],xl:'premier dé en colonne, second en ligne'});
  function draw(q){
    P.clear();
    const w=[1,2,3,4,5,6].map(f=>f===5?q:(1-q)/5),c=[0];w.forEach(v=>c.push(c[c.length-1]+v));
    for(let i=0;i<6;i++)for(let j=0;j<6;j++){
      const inA=i===4||j===4;
      rect(P,c[i]+0.004,c[i+1]-0.004,c[j]+0.004,c[j+1]-0.004,inA?'sl-cellp sl-a':'sl-cello');
    }
    for(let i=0;i<6;i++){const m=(c[i]+c[i+1])/2;
      txt(P.dyn,P.sx(m),P.sy(0)+15,String(i+1),'sl-tick');
      txt(P.dyn,P.sx(0)-7,P.sy(m)+4,String(i+1),'sl-tick','end');}
    const pa=1-(1-q)*(1-q);
    rd(out,[['compter les cases, #A/#Ω','11/36 = 0,306'],['aire de A = P(A)',SL.fmt(pa,3),'c3'],['P(5) sur chaque dé',Math.abs(q-1/6)<1e-6?'1/6':SL.fmt(q,2)],['aire de la case (5, 5)',SL.fmt(q*q,3)]]);
  }
  SL.slider(document.getElementById('f1ctl'),{label:'P(5) par dé',min:1/6,max:0.5,step:1/60,value:1/6,fmt:v=>Math.abs(v-1/6)<1e-6?'1/6':SL.fmt(v,2)},draw);
})();

/* ===== figure 2 (n4) : le rapport des deux formules, P(r tirages tous différents) ===== */
(function(){
  const ctl=document.getElementById('f2ctl'),sdiv=document.getElementById('f2sl'),host=document.getElementById('f2plot'),out=document.getElementById('f2out');
  const N=[{n:6,R:8,r:3,lab:'n = 6, un dé'},{n:26,R:14,r:4,lab:'n = 26, des lettres'},{n:52,R:16,r:5,lab:'n = 52, des cartes'},{n:365,R:60,r:23,lab:'n = 365, des jours'}];
  const ratio=(n,r)=>{let p=1;for(let i=0;i<r;i++)p*=(n-i)/n;return p;};
  const perm=(n,r)=>{let p=1;for(let i=0;i<r;i++)p*=(n-i);return p;};
  function show(k){
    const L=N[k];host.innerHTML='';sdiv.innerHTML='';
    const dt=L.R<=16?2:10,xt=[];for(let t=0;t<=L.R;t+=dt)xt.push(t);
    const P=SL.plot(host,{x:[0,L.R+0.6],y:[0,1.08],w:560,h:260,xt:xt,yt:[0,0.25,0.5,0.75,1],xl:'r, nombre de tirages'});
    P.label(L.R+0.5,1.0,'● P(r tirages, tous différents)','sl-c2','end');
    function draw(r){
      P.clear();P.seg(0,0.5,L.R+0.6,0.5,'sl-dash');
      for(let s=1;s<=L.R;s++)P.dot(s,ratio(L.n,s),s===r?'sl-c3':'sl-c2',s===r?6:3.2);
      P.seg(r,0,r,0.92,'sl-c3 sl-dash');
      rd(out,[['n<sup>r</sup>, avec remise',big(Math.pow(L.n,r))],['n!/(n − r)!, tous différents',big(perm(L.n,r))],['rapport = P(tous différents)',SL.fmt(ratio(L.n,r),3),'c3']]);
    }
    SL.slider(sdiv,{label:'r tirages',min:1,max:L.R,step:1,value:L.r,fmt:v=>String(v)},draw);
  }
  const bs=buttons(ctl,N.map(x=>x.lab),show);bs[1].onclick();
})();

/* ===== figure 3 (n5) : les 1 024 séquences de dix lancers, par nombre de piles ===== */
(function(){
  const C=[1,10,45,120,210,252,210,120,45,10,1];
  const out=document.getElementById('f3out');
  const P=SL.plot(document.getElementById('f3plot'),{x:[-0.6,10.6],y:[0,290],w:560,h:270,xt:[0,1,2,3,4,5,6,7,8,9,10],yt:[0,50,100,150,200,250],xl:'k, nombre de piles sur 10'});
  leftAxis(P,-0.6);
  P.label(10.5,276,'barre k : C(10, k) séquences','','end');
  const st={mode:0,k:5};
  function draw(){
    P.clear();let s=0;
    C.forEach((c,k)=>{const on=st.mode===0?k>=st.k:k===st.k;if(on)s+=c;bar(P,k-0.36,k+0.36,c,on?'sl-bar2':'sl-bar');P.text(k,c+6,String(c),'','middle');});
    rd(out,[[(st.mode===0?'au moins ':'exactement ')+st.k+' pile'+(st.k>1?'s':''),big(s)+' séquences','c3'],['toutes les séquences, 2¹⁰',big(1024)],['probabilité',s+'/1024 = '+SL.fmt(s/1024,3),'c3']]);
  }
  buttons(document.getElementById('f3ctl'),['au moins k piles','exactement k piles'],m=>{st.mode=m;draw();});
  SL.slider(document.getElementById('f3sl'),{label:'k',min:0,max:10,step:1,value:5,fmt:v=>String(v)},v=>{st.k=v;draw();});
})();

/* ===== figure 4 (n7) : les quatre cas sur deux dés ===== */
(function(){
  const host=document.getElementById('f4plot'),out=document.getElementById('f4out');host.classList.add('nogrid');
  const P=SL.plot(host,{x:[0.5,6.5],y:[0.5,6.5],w:440,h:432,xt:[1,2,3,4,5,6],yt:[1,2,3,4,5,6],xl:'premier dé en colonne, second en ligne'});
  const M=[
    {lab:'ordonné, avec remise : 36',f:(i,j)=>true,ro:[['cases retenues','36','c3'],['formule','6² = 36'],['on compte','(d₁, d₂) ordonnés']]},
    {lab:'ordonné, sans remise : 30',f:(i,j)=>i!==j,ro:[['cases retenues','30','c3'],['formule','6 × 5 = 30'],['retirés','les 6 doubles']]},
    {lab:'sans ordre ni remise : 15',f:(i,j)=>j>i,ro:[['cases retenues','15','c3'],['formule','C(6, 2) = 15'],['depuis les 30','30/2! = 15']]},
    {lab:'sans ordre, avec remise : 21',f:(i,j)=>j>=i,ro:[['cases retenues','21','c3'],['formule','C(7, 2) = 21'],['depuis les 36','36/2! = 18 ≠ 21'],['au moins un 5','11/36, pas 6/21']]}];
  function draw(k){
    P.clear();const m=M[k];
    for(let i=1;i<=6;i++)for(let j=1;j<=6;j++){
      const on=m.f(i,j);rect(P,i-0.46,i+0.46,j-0.46,j+0.46,on?'sl-cellp sl-a':'sl-cello');
      const lab=k>=2&&on?'{'+i+', '+j+'}':'('+i+', '+j+')';
      if(k===3&&on){P.text(i,j+0.06,lab,'sl-cell-t','middle');P.text(i,j-0.3,i===j?'1/36':'2/36','sl-cell-t','middle');}
      else P.text(i,j-0.1,lab,'sl-cell-t'+(on?'':' sl-off'),'middle');
    }
    rd(out,m.ro);
  }
  buttons(document.getElementById('f4ctl'),M.map(m=>m.lab),draw);
})();
