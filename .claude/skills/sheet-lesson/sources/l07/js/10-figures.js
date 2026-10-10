/* ===== Figure 1 : le terrain, l'intégrale double comme somme de cases ===== */
(function(){
  /* densité inventée : trois bosses gaussiennes, tronquées au demi-terrain 15 × 14 m (check/c02_court.py) */
  const B=[[0.55,7.5,2.2,1.1,1.0],[0.30,7.5,6.6,1.8,1.0],[0.15,13.6,1.2,0.6,0.7]],Z=0.9844495913993935;
  const f=(x,y)=>{let s=0;B.forEach(b=>{s+=b[0]*Math.exp(-0.5*(((x-b[1])/b[3])**2+((y-b[2])/b[4])**2))/(2*Math.PI*b[3]*b[4]);});return s/Z;};
  const REG=[{n:'la raquette',t:(x,y)=>x>=5&&x<=10&&y<=6,box:[5,10,0,6],ex:'0,608'},
             {n:'le corner droit',t:(x,y)=>x>=12&&y<=3,box:[12,15,0,3],ex:'0,143'},
             {n:'tout le terrain',t:()=>true,box:null,ex:'1'}];
  const SIZES=[1,0.5,0.25],FMAX=0.0809;
  const P=SL.plot(document.getElementById('f1plot'),{x:[0,15],y:[0,14],w:480,h:444,xt:[0,3,6,9,12,15],yt:[0,2,4,6,8,10,12,14],xl:'x (m)'});
  P.svg.querySelector('.sl-grid').style.display='none';
  const top=SL.el('g',{},P.svg),out=document.getElementById('f1out');
  /* les lignes du terrain, au-dessus des cases */
  const ln=(a,b,c,d)=>SL.el('line',{x1:P.sx(a),y1:P.sy(b),x2:P.sx(c),y2:P.sy(d),class:'sl-court'},top);
  SL.el('rect',{x:P.sx(0),y:P.sy(14),width:P.sx(15)-P.sx(0),height:P.sy(0)-P.sy(14),class:'sl-court'},top);
  SL.el('rect',{x:P.sx(5),y:P.sy(6),width:P.sx(10)-P.sx(5),height:P.sy(0)-P.sy(6),class:'sl-court'},top);
  SL.el('circle',{cx:P.sx(7.5),cy:P.sy(1.575),r:P.sx(0.225)-P.sx(0),class:'sl-court'},top);ln(6.6,1.2,8.4,1.2);
  const yc=1.575+Math.sqrt(6.75*6.75-6.6*6.6),arc=[];ln(0.9,0,0.9,yc);ln(14.1,0,14.1,yc);
  const a0=Math.atan2(yc-1.575,-6.6),a1=Math.atan2(yc-1.575,6.6);
  for(let i=0;i<=80;i++){const a=a0+(a1-a0)*i/80;arc.push([P.sx(7.5+6.75*Math.cos(a)),P.sy(1.575+6.75*Math.sin(a))]);}
  SL.el('path',{d:pathOf(arc),class:'sl-court'},top);
  const reg=SL.el('rect',{class:'sl-region'},top);
  const st={r:0,c:0};
  function draw(){
    P.clear();const c=SIZES[st.c],R=REG[st.r];let k=0,s=0,n=0;
    for(let x=c/2;x<15;x+=c)for(let y=c/2;y<14;y+=c){
      const v=f(x,y),inA=R.t(x,y);n++;if(inA){k++;s+=v*c*c;}
      rect(P,x-c/2,x+c/2,y-c/2,y+c/2,inA?'sl-cellA':'sl-cellp').setAttribute('fill-opacity',(0.04+0.8*v/FMAX).toFixed(3));}
    if(R.box){reg.style.display='';reg.setAttribute('x',P.sx(R.box[0]));reg.setAttribute('y',P.sy(R.box[3]));
      reg.setAttribute('width',P.sx(R.box[1])-P.sx(R.box[0]));reg.setAttribute('height',P.sy(R.box[2])-P.sy(R.box[3]));}else reg.style.display='none';
    rd(out,[['cases de '+fx(c,c<1?(c<0.5?2:1):0)+' m de côté',String(n)],['cases dans la région',String(k)],['Σ f · dx dy sur la région',fx(s,3),'c3'],['intégrale exacte',R.ex]]);
  }
  buttons(document.getElementById('f1ctl'),REG.map(r=>r.n),i=>{st.r=i;draw();});
  buttons(document.getElementById('f1ctl2'),['cases de 1 m','0,5 m','0,25 m'],i=>{st.c=i;draw();});
})();

/* ===== Figure 2 : les marges du tableau ===== */
(function(){
  const P=SL.plot(document.getElementById('f2plot'),{x:[0.4,7.6],y:[0.4,7.95],w:500,h:470,xt:[1,2,3,4,5,6],yt:[1,2,3,4,5,6],xl:'x, premier dé'});
  P.svg.querySelector('.sl-grid').style.display='none';
  const out=document.getElementById('f2out');
  const M=[(x,y)=>1,(x,m)=>m===x?x:m>x?1:0];          /* en trente-sixièmes */
  const NAME=['Y, second dé','M, maximum'],YL=['y, second dé','m, maximum'];
  const yl=SL.el('text',{x:48,y:26,class:'sl-lbl'},P.svg);
  let cur=[];for(let x=1;x<=6;x++)for(let y=1;y<=6;y++)cur.push(1);const fresh=runner();let K=0;
  function draw(p){
    P.clear();const col=[0,0,0,0,0,0],row=[0,0,0,0,0,0];let i=0;
    for(let x=1;x<=6;x++)for(let y=1;y<=6;y++,i++){const q=p[i];col[x-1]+=q;row[y-1]+=q;
      rect(P,x-0.46,x+0.46,y-0.46,y+0.46,'sl-cello');
      if(q>0.02)rect(P,x-0.46,x+0.46,y-0.46,y+0.46,'sl-cellp').setAttribute('fill-opacity',(0.06+0.075*q).toFixed(3));
      const r=Math.round(q);P.text(x,y-0.1,r?r+'/36':'0',r?'sl-cell-t':'sl-prod','middle');}
    for(let j=0;j<6;j++){
      rect(P,j+1-0.46,j+1+0.46,7-0.42,7+0.42,'sl-k5 sl-kc');P.text(j+1,6.9,Math.round(col[j])+'/36','sl-cell-t','middle');
      rect(P,7-0.42,7+0.42,j+1-0.46,j+1+0.46,'sl-k5 sl-kc');P.text(7,j+0.9,Math.round(row[j])+'/36','sl-cell-t','middle');}
    P.text(7,6.9,'Σ = 1','sl-cell-t','middle');yl.textContent=YL[K];
    rd(out,[['en haut, la loi de X',col.every(v=>Math.round(v)===6)?'6/36 partout':'?'],
      ['à droite, la loi de '+NAME[K],row.every(v=>Math.round(v)===6)?'6/36 partout':row.map(v=>Math.round(v)).join(', ')+' /36'],
      ['cases vides',String(p.filter(q=>q<0.5).length)]]);
  }
  buttons(document.getElementById('f2ctl'),['deux dés : (X, Y)','premier dé et maximum : (X, M)'],k=>{const tk=fresh(),a=cur.slice(),b=[];K=k;
    for(let x=1;x<=6;x++)for(let y=1;y<=6;y++)b.push(M[k](x,y));
    tween(500,u=>{cur=a.map((v,i)=>v+(b[i]-v)*u);draw(cur);},tk);});
})();

/* ===== Figure 3 : couper la jointe, puis diviser par la marginale ===== */
(function(){
  const a=0.8,s=0.6;
  const P=SL.plot(document.getElementById('f3plot'),{x:[-3.5,4],y:[0,1],w:560,h:270,xt:[-3,-2,-1,0,1,2,3,4],yt:[0,0.25,0.5,0.75,1],xl:'y',yl:'densité'});
  leftAxis(P,-3.5);
  const out=document.getElementById('f3out');
  function draw(x0){
    P.clear();const fx0=phi(x0),slice=y=>fx0*phi((y-a*x0)/s)/s,cond=y=>phi((y-a*x0)/s)/s;
    const pts=[[P.sx(-3.5),P.sy(0)]];for(let i=0;i<=240;i++){const y=-3.5+7.5*i/240;pts.push([P.sx(y),P.sy(slice(y))]);}pts.push([P.sx(4),P.sy(0)]);
    SL.el('path',{d:pathOf(pts)+' Z',class:'sl-area'},P.dyn);
    curve(P,phi,-3.5,4,'sl-c4 sl-dash',1);curve(P,slice,-3.5,4,'sl-c2',1);curve(P,cond,-3.5,4,'sl-c3',1);
    P.text(3.95,0.95,'│ tranche brute f(x₀, y)','sl-c2','end');P.text(3.95,0.87,'│ f(y ∣ x₀), la tranche divisée par son aire','sl-c3','end');P.text(3.95,0.79,'┆ marginale de Y','sl-c4','end');
    rd(out,[['aire de la tranche = f<sub>X</sub>(x₀)',fx(fx0,3),'c3'],['centre de f(y ∣ x₀) = 0,8 x₀',fx(a*x0,2)],['écart-type de f(y ∣ x₀)','0,6'],['pic de f(y ∣ x₀)',fx(1/(s*SQ2PI),3)]]);
  }
  SL.slider(document.getElementById('f3ctl'),{label:'x₀',min:-2.5,max:2.5,step:0.1,value:1.5,fmt:v=>fx(v,1)},draw);
})();

/* ===== Figure 4 : la jointe gaussienne à corrélation ρ contre le produit de ses marginales ===== */
(function(){
  const P=SL.plot(document.getElementById('f4plot'),{x:[-3,3],y:[-3,3],w:420,h:412,xt:[-3,-2,-1,0,1,2,3],yt:[-3,-2,-1,0,1,2,3],xl:'x'});
  const out=document.getElementById('f4out'),LV=[0.14,0.1,0.06,0.02];
  const cp=SL.el('clipPath',{id:'f4clip'},SL.el('defs',{},P.svg));
  SL.el('rect',{x:P.sx(-3),y:P.sy(3),width:P.sx(3)-P.sx(-3),height:P.sy(-3)-P.sy(3)},cp);
  const g=SL.el('g',{'clip-path':'url(#f4clip)'},P.svg),pr=SL.el('g',{},g),jt=SL.el('g',{},g),mk=SL.el('g',{},P.svg);
  const ell=(k,r)=>{const p=[];for(let i=0;i<=120;i++){const t=2*Math.PI*i/120,u=Math.sqrt(1+r)*Math.cos(t),v=Math.sqrt(1-r)*Math.sin(t);p.push([P.sx(k*(u+v)/Math.SQRT2),P.sy(k*(u-v)/Math.SQRT2)]);}return pathOf(p)+' Z';};
  LV.forEach(c=>SL.el('path',{d:ell(Math.sqrt(-2*Math.log(2*Math.PI*c)),0),class:'sl-fn sl-c3 sl-dash sl-thin',fill:'none'},pr));
  const jf=(x,y,r)=>Math.exp(-(x*x-2*r*x*y+y*y)/(2*(1-r*r)))/(2*Math.PI*Math.sqrt(1-r*r));
  [[1,1],[1,-1]].forEach(q=>{SL.el('circle',{cx:P.sx(q[0]),cy:P.sy(q[1]),r:4.5,class:'sl-dot sl-c5'},mk);
    SL.el('text',{x:P.sx(q[0])+10,y:P.sy(q[1])+4,class:'sl-lbl sl-halo'},mk).textContent=q[1]>0?'(1, 1)':'(1, −1)';});
  function draw(r){
    while(jt.firstChild)jt.removeChild(jt.firstChild);
    LV.forEach(c=>SL.el('path',{d:ell(Math.sqrt(-2*Math.log(2*Math.PI*c*Math.sqrt(1-r*r))),r),class:'sl-fn sl-c1',fill:'none'},jt));
    const p=phi(1)*phi(1),a=jf(1,1,r),b=jf(1,-1,r);
    rd(out,[['jointe en (1, 1)',sci(a),'c1'],['produit f<sub>X</sub>(1) f<sub>Y</sub>(1)',fx(p,4)],['jointe / produit en (1, 1)',sig(a/p),'c3'],['jointe / produit en (1, −1)',sig(b/p)]]);
  }
  SL.slider(document.getElementById('f4ctl'),{label:'corrélation ρ',min:-0.9,max:0.9,step:0.05,value:0,fmt:v=>fx(v,2)},draw);
})();
