/* ===== v1 : chaque opération est une région (Venn des trois lancers, grille de deux pièces) ===== */
(function(){
  const host=document.getElementById('v1plot'),out=document.getElementById('v1out');
  const row=SL.h('div','v-row',host),L=SL.h('div','',row),R=SL.h('div','v-mini',row);
  const S=SL.el('svg',{viewBox:'0 0 330 236',class:'sl-plot'},L),G=SL.el('svg',{viewBox:'0 0 220 236',class:'sl-plot sl-mini'},R);
  const defs=SL.el('defs',{},S),cp=SL.el('clipPath',{id:'l2v1clip'},defs);SL.el('circle',{cx:202,cy:112,r:80},cp);
  const fillG=SL.el('g',{class:'l2-ong'},S);
  SL.el('rect',{x:6,y:6,width:318,height:224,class:'l2-frame'},S);
  SL.el('circle',{cx:128,cy:112,r:80,class:'l2-edge'},S);SL.el('circle',{cx:202,cy:112,r:80,class:'l2-edge'},S);
  [['Ω',18,26],['A',62,40],['B',268,40]].forEach(t=>{const e=SL.el('text',{x:t[1],y:t[2],'text-anchor':'middle',class:'l2-name'},S);e.textContent=t[0];});
  const pos={FFF:[80,102],FFP:[80,130],FPF:[165,102],FPP:[165,130],PPF:[250,102],PPP:[250,130],PFF:[42,216],PFP:[288,216]};
  const els={};Object.keys(pos).forEach(w=>{const e=SL.el('text',{x:pos[w][0],y:pos[w][1],'text-anchor':'middle',class:'l2-el'},S);e.textContent=w;els[w]=e;});
  const cells={};[['FF',50,46],['FP',128,46],['PF',50,124],['PP',128,124]].forEach(c=>{
    const r=SL.el('rect',{x:c[1],y:c[2],width:76,height:76,class:'l2-cell'},G);
    const t=SL.el('text',{x:c[1]+38,y:c[2]+44,'text-anchor':'middle',class:'l2-ct'},G);t.textContent=c[0];cells[c[0]]=r;});
  [['F',36,89],['P',36,167],['F',88,36],['P',166,36]].forEach(t=>{const e=SL.el('text',{x:t[1],y:t[2],'text-anchor':'middle',class:'l2-name'},G);e.textContent=t[0];});
  SL.el('text',{x:20,y:24,'text-anchor':'middle',class:'sl-lbl'},G).textContent='1er \\ 2e';
  SL.el('text',{x:128,y:224,'text-anchor':'middle',class:'sl-lbl'},G).textContent='A = ligne F, B = colonne P';
  const inA=w=>w[0]==='F',inB=w=>w[1]==='P';
  const ops=[
    {n:'A',w:'1er lancer F',f:w=>inA(w),fill:()=>[['c',128]]},
    {n:'B',w:'2e lancer P',f:w=>inB(w),fill:()=>[['c',202]]},
    {n:'A ∪ B',w:'1er F ou 2e P',f:w=>inA(w)||inB(w),fill:()=>[['c',128],['c',202]]},
    {n:'A ∩ B',w:'1er F et 2e P',f:w=>inA(w)&&inB(w),fill:()=>[['clip',128]]},
    {n:'Aᶜ',w:'1er lancer P',f:w=>!inA(w),fill:()=>[['r'],['h',128]]},
    {n:'(A ∪ B)ᶜ',w:'ni 1er F, ni 2e P',f:w=>!(inA(w)||inB(w)),fill:()=>[['r'],['h',128],['h',202]]}];
  function show(i){
    const o=ops[i];while(fillG.firstChild)fillG.removeChild(fillG.firstChild);
    o.fill().forEach(f=>{if(f[0]==='r')SL.el('rect',{x:6,y:6,width:318,height:224,class:'l2-sol'},fillG);
      else if(f[0]==='c')SL.el('circle',{cx:f[1],cy:112,r:80,class:'l2-sol'},fillG);
      else if(f[0]==='h')SL.el('circle',{cx:f[1],cy:112,r:80,class:'l2-hole'},fillG);
      else SL.el('circle',{cx:f[1],cy:112,r:80,class:'l2-sol','clip-path':'url(#l2v1clip)'},fillG);});
    let k=0;Object.keys(els).forEach(w=>{const on=o.f(w);if(on)k++;els[w].setAttribute('class','l2-el'+(on?' on':''));});
    let m=0;Object.keys(cells).forEach(w=>{const on=o.f(w);if(on)m++;cells[w].setAttribute('class','l2-cell'+(on?' on':''));});
    rd(out,[['événement',o.n],['en mots',o.w],['trois lancers',k+(k>1?' issues':' issue')+' sur 8'],['deux pièces',m+(m>1?' cases':' case')+' sur 4'],['probabilité',k+'/8 = '+fx(k/8,2),'c3']]);
  }
  buttons(document.getElementById('v1ctl'),ops.map(o=>o.n),show);
})();

/* ===== v2 : la fléchette, la probabilité est une aire ===== */
(function(){
  const host=document.getElementById('v2plot'),out=document.getElementById('v2out');
  const S=SL.el('svg',{viewBox:'0 0 560 300',class:'sl-plot'},host);
  const X0=20,Y0=20,W=520,H=260,RD=Math.sqrt(0.2*W*H/Math.PI);
  const zone=SL.el('g',{},S),darts=SL.el('g',{},S),labs=SL.el('g',{},S);
  SL.el('rect',{x:X0,y:Y0,width:W,height:H,class:'l2-frame'},S);
  const modes=[{n:'pièce juste',a:0.5,t:'coin'},{n:'pièce truquée, 0,7',a:0.7,t:'coin'},{n:'un disque A',a:0.2,t:'disk'}];
  const st={m:0,d:[],in:0};const fresh=runner();let seed=1;
  function inA(x,y){const M=modes[st.m];return M.t==='disk'?Math.hypot(x-(X0+W/2),y-(Y0+H/2))<RD:x<X0+M.a*W;}
  function txt(x,y,s,cls,anc){const e=SL.el('text',{x:x,y:y,'text-anchor':anc||'middle',class:cls||'l2-big'},labs);e.textContent=s;
    try{const bb=e.getBBox();if(bb.width){const r=SL.el('rect',{x:(bb.x-5).toFixed(1),y:(bb.y-2).toFixed(1),width:(bb.width+10).toFixed(1),height:(bb.height+4).toFixed(1),rx:3,class:'l2-tbg'},labs);labs.insertBefore(r,e);}}catch(err){}}
  function board(){
    while(zone.firstChild)zone.removeChild(zone.firstChild);while(labs.firstChild)labs.removeChild(labs.firstChild);
    const M=modes[st.m];
    if(M.t==='disk'){SL.el('circle',{cx:X0+W/2,cy:Y0+H/2,r:RD,class:'l2-zoneA'},zone);
      txt(X0+W/2,Y0+H/2+5,'A, aire 0,2');txt(X0+14,Y0+24,'Aᶜ, aire 0,8','l2-big','start');}
    else{const xa=X0+M.a*W;SL.el('rect',{x:X0,y:Y0,width:M.a*W,height:H,class:'l2-zoneA'},zone);
      SL.el('line',{x1:xa,x2:xa,y1:Y0,y2:Y0+H,class:'l2-cut'},zone);
      txt(X0+M.a*W/2,Y0+H/2+5,'A = face, aire '+fx(M.a,1));txt(xa+(1-M.a)*W/2,Y0+H/2+5,'Aᶜ = pile, aire '+fx(1-M.a,1));}
  }
  function add(r,n){for(let i=0;i<n;i++){const x=X0+r()*W,y=Y0+r()*H,a=inA(x,y);st.d.push(a);if(a)st.in++;
    SL.el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:3,class:'l2-dart'+(a?' in':'')},darts);}}
  function readout(){const n=st.d.length,M=modes[st.m];
    rd(out,[['fléchettes',String(n)],['fréquence dans A',fx(st.in/n,3)],['P(A), aire de A',fx(M.a,1),'c3'],['fréquence hors de A',fx((n-st.in)/n,3)]]);}
  function reset(){fresh();while(darts.firstChild)darts.removeChild(darts.firstChild);st.d=[];st.in=0;board();add(rng(1),100);readout();}
  buttons(document.getElementById('v2ctl'),modes.map(m=>m.n),k=>{st.m=k;reset();});
  SL.h('button','tb',document.getElementById('v2ctl'),'▶ lancer 500 fléchettes').onclick=()=>{
    const tk=fresh(),r=rng(100+(seed++));let left=500;loop(tk,()=>{const k=Math.min(10,left);add(r,k);left-=k;readout();return left>0;});};
})();

/* ===== v3 : le chevauchement compté deux fois ===== */
(function(){
  const host=document.getElementById('v3plot'),out=document.getElementById('v3out');
  const st={m:0,s:1};
  const RK=['A','2','3','4','5','6','7','8','9','10','V','D','R'],SU=['♥','♦','♣','♠'];
  function draw(){
    host.innerHTML='';const S=SL.el('svg',{viewBox:'0 0 560 '+(st.m?200:190),class:'sl-plot'},host);
    let cells=[];
    if(st.m===0){const C=['FF','FP','PF','PP'];
      ['F','P'].forEach((r,i)=>C.forEach((c,j)=>cells.push({x:70+j*112,y:30+i*76,w:104,h:68,lab:r+c,a:r==='F',b:c[0]==='P'})));
      ['FF','FP','PF','PP'].forEach((c,j)=>{const t=SL.el('text',{x:70+j*112+52,y:20,'text-anchor':'middle',class:'sl-lbl'},S);t.textContent='2e et 3e\u00a0: '+c;});
      ['1er F','1er P'].forEach((c,i)=>{const t=SL.el('text',{x:34,y:30+i*76+39,'text-anchor':'middle',class:'sl-lbl'},S);t.textContent=c;});
    }else{
      SU.forEach((s,i)=>RK.forEach((r,j)=>cells.push({x:52+j*38,y:28+i*40,w:35,h:37,lab:'',a:i===0,b:r==='R'})));
      RK.forEach((r,j)=>{const t=SL.el('text',{x:52+j*38+17.5,y:20,'text-anchor':'middle',class:'sl-lbl'},S);t.textContent=r;});
      SU.forEach((s,i)=>{const t=SL.el('text',{x:34,y:28+i*40+24,'text-anchor':'middle',class:'l2-suit'+(i<2?' red':'')},S);t.textContent=s;});
    }
    let nA=0,nB=0,nAB=0,tot=0,twos=0;
    cells.forEach(c=>{const v=(c.a?1:0)+(st.s>=1&&c.b?1:0)-(st.s>=2&&c.a&&c.b?1:0);
      if(c.a)nA++;if(c.b)nB++;if(c.a&&c.b)nAB++;tot+=v;if(v===2)twos++;
      const bOn=st.s>=1&&c.b,cls=c.a&&bOn?'l2-ab':c.a?'l2-a':bOn?'l2-b':'l2-cell';
      SL.el('rect',{x:c.x,y:c.y,width:c.w,height:c.h,class:cls},S);
      if(c.lab){const t=SL.el('text',{x:c.x+c.w/2,y:c.y+16,'text-anchor':'middle',class:'l2-el'},S);t.textContent=c.lab;}
      if(v>0){const t=SL.el('text',{x:c.x+c.w/2,y:c.y+c.h/2+(c.lab?14:6),'text-anchor':'middle',class:'l2-tally'+(v===2?' two':'')},S);t.textContent=String(v);}});
    const N=cells.length,u=nA+nB-nAB;
    const cnt=st.s===0?String(nA):st.s===1?nA+' + '+nB+' = '+(nA+nB):(nA+nB)+' − '+nAB+' = '+u;
    const pr=st.s===0?['P(A)',nA+'/'+N]:st.s===1?['P(A) + P(B), faux',(nA+nB)+'/'+N]:['P(A ∪ B)',u+'/'+N+' ≈ '+fx(u/N,3),'c3'];
    rd(out,[['A\u00a0: '+(st.m?'les cœurs':'1er lancer F')+', B\u00a0: '+(st.m?'les rois':'2e lancer P'),st.m?'52 cartes':'8 issues'],['cases comptées',cnt],['cases comptées deux fois',String(twos)],pr]);
  }
  buttons(document.getElementById('v3ctl'),['trois lancers','52 cartes'],k=>{st.m=k;draw();});
  const bs=buttons(document.getElementById('v3step'),['1. compter A','2. ajouter B','3. retirer A ∩ B'],k=>{st.s=k;draw();});
  bs[1].onclick();
})();

/* ===== v4 : n personnes, n(n − 1)/2 paires ===== */
(function(){
  const host=document.getElementById('v4plot'),out=document.getElementById('v4out');
  const S=SL.el('svg',{viewBox:'0 0 560 310',class:'sl-plot'},host);
  const chords=SL.el('g',{},S),match=SL.el('g',{},S),ppl=SL.el('g',{},S);
  const CX=280,CY=155,RR=130,MO=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'],ML=[31,28,31,30,31,30,31,31,30,31,30,31];
  function date(d){let m=0;while(d>=ML[m]){d-=ML[m];m++;}return (d+1)+' '+MO[m];}
  const st={n:23,days:[],seed:1,sim:null};const fresh=runner();
  function room(seed){const r=rng(seed);return Array.from({length:60},()=>Math.floor(365*r()));}
  function pt(i,n){const a=-Math.PI/2+2*Math.PI*i/n;return [CX+RR*Math.cos(a),CY+RR*Math.sin(a)];}
  function pnone(n){let q=1;for(let k=0;k<n;k++)q*=(365-k)/365;return q;}
  function drawChords(){while(chords.firstChild)chords.removeChild(chords.firstChild);const n=st.n;chords.setAttribute('opacity',Math.min(1,320/(n*(n-1)/2)).toFixed(3));
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const a=pt(i,n),b=pt(j,n);SL.el('line',{x1:a[0].toFixed(1),y1:a[1].toFixed(1),x2:b[0].toFixed(1),y2:b[1].toFixed(1),class:'l2-chord'},chords);}}
  function drawRoom(days){while(match.firstChild)match.removeChild(match.firstChild);while(ppl.firstChild)ppl.removeChild(ppl.firstChild);
    const n=st.n,hit=new Set(),shared=[];let k=0;
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(days[i]===days[j]){k++;hit.add(i);hit.add(j);if(!shared.includes(days[i]))shared.push(days[i]);
      const a=pt(i,n),b=pt(j,n);SL.el('line',{x1:a[0].toFixed(1),y1:a[1].toFixed(1),x2:b[0].toFixed(1),y2:b[1].toFixed(1),class:'l2-match'},match);}
    for(let i=0;i<n;i++){const a=pt(i,n);SL.el('circle',{cx:a[0].toFixed(1),cy:a[1].toFixed(1),r:n>40?4.5:6,class:'l2-p'+(hit.has(i)?' hit':'')},ppl);}
    return {k:k,shared:shared};}
  function readout(res){const n=st.n,pairs=n*(n-1)/2;
    const ds=res.shared.length?res.shared.slice(0,2).map(date).join(', ')+(res.shared.length>2?', +'+(res.shared.length-2):''):'aucun';
    rd(out,[['paires, n(n − 1)/2',String(pairs)],['paires qui partagent, cette salle',String(res.k)],['jours partagés',ds],
      ['salles avec un partage',st.sim?fx(st.sim.hit/st.sim.n,3)+' sur '+st.sim.n:'pas encore lancées'],['P(partage) exacte',fx(1-pnone(n),3),'c3']]);}
  function redraw(){drawChords();readout(drawRoom(st.days));}
  st.days=room(st.seed);
  const ctl=document.getElementById('v4ctl');
  SL.h('button','tb',ctl,'tirer une autre salle').onclick=()=>{fresh();st.seed++;st.days=room(st.seed);st.sim=null;readout(drawRoom(st.days));};
  SL.h('button','tb',ctl,'▶ 1 000 salles').onclick=()=>{const tk=fresh(),r=rng(500+st.seed);st.sim={n:0,hit:0};let last=null;
    loop(tk,()=>{for(let b=0;b<20&&st.sim.n<1000;b++){const d=Array.from({length:60},()=>Math.floor(365*r()));const seen=new Set();let h=false;
        for(let i=0;i<st.n;i++){if(seen.has(d[i])){h=true;break;}seen.add(d[i]);}st.sim.n++;if(h)st.sim.hit++;last=d;}
      readout(drawRoom(last));return st.sim.n<1000;});};
  SL.slider(document.getElementById('v4sl'),{label:'n personnes',min:2,max:60,step:1,value:23,fmt:v=>String(v)},v=>{fresh();st.n=v;st.sim=null;redraw();});
})();

/* ===== v5 : un lot de 100 pièces, 5 défectueuses, 10 tirées ===== */
(function(){
  const host=document.getElementById('v5plot'),out=document.getElementById('v5out');
  const row=SL.h('div','v-row',host),L=SL.h('div','v-mini l2-lot',row),R=SL.h('div','',row);
  const S=SL.el('svg',{viewBox:'0 0 264 264',class:'sl-plot'},L);
  const r0=rng(5),bad=new Set();while(bad.size<5)bad.add(Math.floor(100*r0()));
  const cell=[];for(let i=0;i<100;i++){const x=4+(i%10)*26,y=4+Math.floor(i/10)*26;
    SL.el('rect',{x:x,y:y,width:22,height:22,rx:2,class:bad.has(i)?'l2-bad':'l2-good'},S);
    cell.push(SL.el('rect',{x:x-2,y:y-2,width:26,height:26,rx:3,class:'l2-pick',style:'display:none'},S));}
  const P=SL.plot(R,{x:[-0.6,3.6],y:[-0.09,0.7],w:470,h:264,xt:[],yt:[0,0.2,0.4,0.6],yl:'part des contrôles'});
  leftAxis(P,-0.6);
  const TH=[0.583752,0.339391,0.070219,0.006638];
  ['0','1','2','≥ 3'].forEach((t,k)=>SL.el('text',{x:P.sx(k).toFixed(1),y:(P.sy(0)+16).toFixed(1),'text-anchor':'middle',class:'sl-tick'},P.layer).textContent=t);
  SL.el('text',{x:P.sx(3.55).toFixed(1),y:(P.sy(0.66)).toFixed(1),'text-anchor':'end',class:'sl-lbl'},P.layer).textContent='○ théorie';
  const st={k:0,n:0,c:[0,0,0,0]};const fresh=runner();let seed=2,cseed=924;
  function sample(r){const s=new Set();while(s.size<10)s.add(Math.floor(100*r()));return s;}
  function show(s){let k=0;cell.forEach((c,i)=>{c.style.display=s.has(i)?'':'none';});s.forEach(i=>{if(bad.has(i))k++;});return k;}
  function draw(){P.clear();for(let k=0;k<4;k++){if(st.n)bar(P,k-0.3,k+0.3,st.c[k]/st.n,'sl-bar');P.dot(k,TH[k],'hollow sl-c3',5);}
    rd(out,[['défectueuses dans cet échantillon',String(st.k)],['contrôles',st.n?String(st.n):'aucun'],['aucun défaut vu (théorie 0,584)',st.n?fx(st.c[0]/st.n,3):'—'],['un défaut (théorie 0,339)',st.n?fx(st.c[1]/st.n,3):'—']]);}
  st.k=show(sample(rng(2)));draw();
  const ctl=document.getElementById('v5ctl');
  SL.h('button','tb',ctl,'tirer 10 pièces').onclick=()=>{fresh();st.k=show(sample(rng(10+(seed++))));draw();};
  SL.h('button','tb',ctl,'▶ 1 000 contrôles').onclick=()=>{const tk=fresh(),r=rng(cseed++);st.n=0;st.c=[0,0,0,0];
    loop(tk,()=>{let s=null;for(let b=0;b<25&&st.n<1000;b++){s=sample(r);let k=0;s.forEach(i=>{if(bad.has(i))k++;});st.c[Math.min(k,3)]++;st.n++;}
      st.k=show(s);draw();return st.n<1000;});};
})();

/* ===== v6 : le triangle de Pascal, chaque case est la somme des deux du dessus ===== */
(function(){
  const host=document.getElementById('v6plot'),out=document.getElementById('v6out');
  const S=SL.el('svg',{viewBox:'0 0 560 300',class:'sl-plot'},host);
  const RM=8,cx=(r,k)=>280+(k-r/2)*58,cy=r=>14+r*32;
  const arrows=SL.el('g',{},S),cells=[];
  for(let r=0;r<=RM;r++){cells.push([]);for(let k=0;k<=r;k++){const g=SL.el('g',{},S);
    const b=SL.el('rect',{x:(cx(r,k)-25).toFixed(1),y:cy(r),width:50,height:25,rx:3,class:'l2-pc'},g);
    const t=SL.el('text',{x:cx(r,k).toFixed(1),y:cy(r)+17,'text-anchor':'middle',class:'l2-pt'},g);t.textContent=String(comb(r,k));cells[r].push({g:g,b:b});}}
  const st={n:4,k:2,upto:RM};const fresh=runner();
  function draw(){
    while(arrows.firstChild)arrows.removeChild(arrows.firstChild);const n=st.n,k=Math.min(st.k,n);
    for(let r=0;r<=RM;r++)for(let j=0;j<=r;j++){const c=cells[r][j];c.g.style.opacity=r<=st.upto?'1':'0';
      let cls='l2-pc';if(r===n)cls+=' row';if(r===n-1&&(j===k-1||j===k))cls+=' par';if(r===n&&j===k)cls+=' tgt';c.b.setAttribute('class',cls);}
    [k-1,k].forEach(j=>{if(j<0||j>n-1)return;SL.el('line',{x1:cx(n-1,j).toFixed(1),y1:cy(n-1)+25,x2:(cx(n,k)+(j<k?-7:7)).toFixed(1),y2:cy(n)-1,class:'sl-seg sl-arrow','marker-end':'url(#sl-ah)'},arrows);});
    const a=comb(n-1,k-1),b=comb(n-1,k),rowv=[];for(let j=0;j<=n;j++)rowv.push(comb(n,j));
    rd(out,[['ligne '+n+', les coefficients de (x + y)'+sup(n),rowv.join(' ')],['somme de la ligne',(1<<n)+' = 2'+sup(n)],['C('+n+', '+k+') = les deux du dessus',comb(n,k)+' = '+a+' + '+b,'c3']]);
  }
  const sl=document.getElementById('v6sl'),dn=SL.h('div','',sl),dk=SL.h('div','',sl);
  const ks=SL.slider(dk,{label:'position k',min:0,max:4,step:1,value:2,fmt:v=>String(v)},v=>{if(v>st.n){ks.set(st.n);return;}st.k=v;draw();});
  SL.slider(dn,{label:'ligne n',min:1,max:8,step:1,value:4,fmt:v=>String(v)},v=>{st.n=v;ks.input.max=v;ks.set(Math.min(st.k,v));});
  SL.h('button','tb',document.getElementById('v6ctl'),'▶ construire ligne par ligne').onclick=()=>{const tk=fresh();
    if(SL.reduced){st.upto=RM;draw();return;}const t0=performance.now();st.upto=-1;draw();
    loop(tk,()=>{const u=Math.floor((performance.now()-t0)/450);if(u!==st.upto){st.upto=Math.min(RM,u);draw();}return st.upto<RM;});};
})();

/* ===== v7 : servir les comités un par un ===== */
(function(){
  const host=document.getElementById('v7plot'),out=document.getElementById('v7out');
  const S=SL.el('svg',{viewBox:'0 0 560 240',class:'sl-plot'},host);
  const BX=[{x:28,w:140,s:2},{x:200,w:180,s:3},{x:412,w:140,s:2}],BY=140,poolY=42,poolX=i=>100+i*60;
  const lab=[];BX.forEach((b,j)=>{SL.el('rect',{x:b.x,y:BY,width:b.w,height:70,rx:4,class:'l2-box'+(j===1?'':' pair')},S);
    const t=SL.el('text',{x:b.x+b.w/2,y:BY-10,'text-anchor':'middle',class:'sl-lbl'},S);lab.push(t);});
  for(let i=0;i<7;i++)SL.el('circle',{cx:100+i*60,cy:poolY,r:16,class:'l2-ghost'},S);
  SL.el('text',{x:12,y:poolY+5,'text-anchor':'start',class:'sl-lbl'},S).textContent='au départ';
  const seat=(j,s)=>[BX[j].x+BX[j].w*(s+0.5)/BX[j].s,BY+35];
  const P=[];for(let i=0;i<7;i++){const g=SL.el('g',{},S);SL.el('circle',{r:16,class:'sl-mass'},g);const t=SL.el('text',{y:4,'text-anchor':'middle',class:'sl-mass-t'},g);t.textContent=String(i+1);P.push(g);}
  const st={perm:[0,1,2,3,4,5,6],same:false,phase:3};const fresh=runner();let seed=4;
  function target(i){const p=st.perm.indexOf(i);if(p<2)return seat(0,p);if(p<5)return seat(1,p-2);return seat(2,p-5);}
  function phaseOf(i){const p=st.perm.indexOf(i);return p<2?0:p<5?1:2;}
  function place(u){for(let i=0;i<7;i++){const ph=phaseOf(i),a=[poolX(i),poolY],b=target(i);let v=ph<Math.floor(u)?1:ph>Math.floor(u)?0:u-Math.floor(u);
      v=v<.5?2*v*v:1-Math.pow(-2*v+2,2)/2;P[i].setAttribute('transform','translate('+(a[0]+(b[0]-a[0])*v).toFixed(1)+' '+(a[1]+(b[1]-a[1])*v).toFixed(1)+')');}}
  function readout(u){const done=Math.floor(u);
    lab[0].textContent=st.same?'binôme, 2 places':'comité 1, 2 places';lab[1].textContent='comité 2, 3 places';lab[2].textContent=st.same?'binôme, 2 places':'comité 3, 2 places';
    rd(out,[['1er comité, C(7, 2)',done>=1?'21':'…'],['2e, C(5, 3) parmi les 5 restantes',done>=2?'10':'…'],['3e, C(2, 2), les 2 dernières',done>=3?'1':'…'],
      [st.same?'répartitions, 210 / 2!':'répartitions, 21 × 10 × 1',done>=3?(st.same?'105':'210'):'…','c3']]);}
  function shuffle(r){const a=[0,1,2,3,4,5,6];for(let i=6;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  st.perm=shuffle(rng(3));place(3);readout(3);
  const ctl=document.getElementById('v7ctl');
  SL.h('button','tb',ctl,'▶ distribuer au hasard').onclick=()=>{const tk=fresh();st.perm=shuffle(rng(seed++));
    if(SL.reduced){place(3);readout(3);return;}const t0=performance.now();
    loop(tk,()=>{const u=Math.min(3,(performance.now()-t0)/700);place(u);readout(u);return u<3;});};
  const tg=SL.h('button','tb',ctl,'comités de 2 interchangeables');tg.setAttribute('aria-pressed','false');
  tg.onclick=()=>{st.same=!st.same;tg.setAttribute('aria-pressed',String(st.same));readout(3);place(3);};
})();
