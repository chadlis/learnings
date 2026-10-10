/* ===== v1 : B devient le nouvel univers ===== */
(function(){
  const host=document.getElementById('v1plot'),out=document.getElementById('v1out'),W=560,H=300,SY=258;
  const S=canvas(host,W,H),gG=SL.el('g',{},S),gM=SL.el('g',{},S),gT=SL.el('g',{},S);
  const SUITS=['♣','♦','♥','♠'],VALS=['1','2','3','4','5','6','7','8','9','10','V','D','R'];
  const cards=[];for(let s=0;s<4;s++)for(let v=0;v<13;v++)cards.push({s:s,v:v,A:s===3,x:92+v*29,y:34+s*29,c:26});
  const dice=[];for(let b=1;b<=6;b++)for(let a=1;a<=6;a++)dice.push({a:a,b:b,A:a===3,x:200+(a-1)*33,y:30+(b-1)*33,c:30});
  const M=[{u:'cards',n:'Ω · cartes',B:o=>true,txt:'A = pique'},{u:'cards',n:'sachant noire',B:o=>o.s===0||o.s===3},{u:'cards',n:'sachant rouge',B:o=>o.s===1||o.s===2},
           {u:'dice',n:'Ω · dés',B:o=>true},{u:'dice',n:'sachant 2ᵉ dé = 5',B:o=>o.b===5},{u:'dice',n:'sachant somme = 6',B:o=>o.a+o.b===6}];
  let shown=null;const fresh=runner();
  function grid(u){
    while(gG.firstChild)gG.removeChild(gG.firstChild);while(gT.firstChild)gT.removeChild(gT.firstChild);
    const L=u==='cards'?cards:dice;
    L.forEach(o=>{o.el=box(gG,o.x,o.y,o.c,o.c,'sl-cellv'+(o.A?' sl-k2':''));});
    if(u==='cards'){SUITS.forEach((s,i)=>txt(gT,80,34+i*29+19,s,'sl-sym'+(i===1||i===2?' r':''),'end'));
      VALS.forEach((v,i)=>txt(gT,92+i*29+13,26,v,'sl-tick','middle'));}
    else{for(let a=1;a<=6;a++)txt(gT,200+(a-1)*33+15,22,String(a),'sl-tick','middle');
      for(let b=1;b<=6;b++)txt(gT,188,30+(b-1)*33+20,String(b),'sl-tick','end');
      txt(gT,200+6*33+8,22,'← premier dé','sl-lbl');txt(gT,188,22,'second dé ↓','sl-lbl','end');}
    shown=u;
  }
  function show(k,animate){
    const m=M[k],L=m.u==='cards'?cards:dice;if(shown!==m.u)grid(m.u);
    while(gM.firstChild)gM.removeChild(gM.firstChild);
    const all=k===0||k===3,inB=L.filter(m.B),nA=L.filter(o=>o.A).length,nAB=inB.filter(o=>o.A).length;
    L.forEach(o=>o.el.classList.toggle('sl-fade',!all&&!m.B(o)));
    const tk=fresh();
    if(all){txt(gM,W/2,SY+16,'aucune information : on compte A dans Ω entier','sl-lbl','middle');
      rd(out,[['issues de A',String(nA)],['issues de Ω',String(L.length)],['P(A)',nA+'/'+L.length+' = '+SL.fmt(nA/L.length,3),'c3']]);return;}
    const n=inB.length,cs=Math.min(26,Math.floor((W-40)/n)-2),x0=(W-n*(cs+2))/2;
    txt(gM,W/2,SY-10,'le nouvel univers B : '+n+' issues, chacune de probabilité 1/'+n,'sl-lbl','middle');
    const mv=inB.map((o,i)=>({o:o,e:box(gM,o.x,o.y,o.c,o.c,'sl-cellv'+(o.A?' sl-k2':'')),tx:x0+i*(cs+2),ty:SY}));
    function frame(u){mv.forEach(q=>{const s=q.o.c+(cs-q.o.c)*u;q.e.setAttribute('x',(q.o.x+(q.tx-q.o.x)*u).toFixed(1));q.e.setAttribute('y',(q.o.y+(q.ty-q.o.y)*u).toFixed(1));
      q.e.setAttribute('width',s.toFixed(1));q.e.setAttribute('height',s.toFixed(1));});}
    if(animate)tween(900,frame,tk);else frame(1);
    rd(out,[['issues de A ∩ B',String(nAB)],['issues de B',String(n)],['P(A ∣ B)',nAB+'/'+n+' = '+SL.fmt(nAB/n,3),'c3'],['P(A) sans information','1/'+(m.u==='cards'?'4':'6')]]);
  }
  let first=true;
  buttons(document.getElementById('v1ctl'),M.map(m=>m.n),k=>{show(k,!first);first=false;});
})();

/* ===== v2 : l'arbre des deux cartes ===== */
(function(){
  const host=document.getElementById('v2plot'),out=document.getElementById('v2out'),W=560,H=280;
  const S=canvas(host,W,H),g=SL.el('g',{},S);
  const R={x:24,y:140},L1=[{x:160,y:70,t:'♠'},{x:160,y:210,t:'autre'}],L2=[{x:290,y:35,t:'♠ ♠'},{x:290,y:105,t:'♠ autre'},{x:290,y:175,t:'autre ♠'},{x:290,y:245,t:'autre autre'}];
  const TX=394;
  const CASES=[{n:'sans remise',b1:[[13,52],[39,52]],b2:[[12,51],[39,51],[13,51],[38,51]],leaf:['1/17','13/68','13/68','19/34'],
      ss:'1/17 = 0,0588',sec:'1/17 + 13/68 = 1/4'},
    {n:'avec remise',b1:[[13,52],[39,52]],b2:[[13,52],[39,52],[13,52],[39,52]],leaf:['1/16','3/16','3/16','9/16'],ss:'1/16 = 0,0625',sec:'1/16 + 3/16 = 1/4'}];
  const wOf=o=>o.t.length*7.5+14;
  /* étiquette d'une branche : à gauche du milieu, au-dessus si la branche monte, en dessous si elle descend */
  function branch(a,b,on,lab){const xa=a===R?a.x+5:a.x+wOf(a),xb=b.x;SL.el('line',{x1:xa,y1:a.y,x2:xb,y2:b.y,class:'sl-tree'+(on?' on':'')},g);
    const mx=(xa+xb)/2,my=(a.y+b.y)/2,up=b.y<a.y;txt(g,mx-4,up?my-7:my+15,lab,'sl-mono'+(on?' on':''),'end');}
  function node(o,on){const w=wOf(o);box(g,o.x,o.y-11,w,22,'sl-tcell');txt(g,o.x+w/2,o.y+5,o.t,'sl-sym'+(on?' r':''),'middle');}
  function draw(k){
    while(g.firstChild)g.removeChild(g.firstChild);const C=CASES[k];
    L1.forEach((o,i)=>branch(R,o,i===0,C.b1[i][0]+'/'+C.b1[i][1]));
    L2.forEach((o,j)=>branch(L1[j>>1],o,j===0,C.b2[j][0]+'/'+C.b2[j][1]));
    SL.el('circle',{cx:R.x,cy:R.y,r:5,class:'sl-node'},g);
    L1.forEach((o,i)=>node(o,i===0));
    L2.forEach((o,j)=>{node(o,j===0);const b1=C.b1[j>>1],b2=C.b2[j],v=(b1[0]*b2[0])/(b1[1]*b2[1]);
      txt(g,TX,o.y+5,b1[0]+'/'+b1[1]+' × '+b2[0]+'/'+b2[1]+' = '+SL.fmt(v,4),'sl-mono'+(j===0?' on':''));});
    txt(g,TX,14,'1ʳᵉ carte × 2ᵉ carte','sl-lbl');
    rd(out,[['P(♠ puis ♠)',C.ss,'c3'],['somme des feuilles, '+C.leaf.join(' + '),'1'],['P(seconde carte ♠)',C.sec]]);
  }
  buttons(document.getElementById('v2ctl'),CASES.map(c=>c.n),draw);
})();

/* ===== v3 : Ω en bandes, A mesuré morceau par morceau ===== */
(function(){
  const host=document.getElementById('v3plot'),out=document.getElementById('v3out'),W=560,H=290,X0=40,Y0=24,WW=480,HH=210;
  const S=canvas(host,W,H),g=SL.el('g',{},S);
  const CASES=[{n:'cartes rouges',w:[.25,.25,.25,.25],h:[1,1,0,0],lab:['♥ · ¼','♦ · ¼','♣ · ¼','♠ · ¼'],A:'A = rouge',
      rd:[['cœur, 1 × ¼','0,25'],['carreau, 1 × ¼','0,25'],['trèfle et pique, 0 × ¼','0 et 0'],['P(rouge), la somme','0,5','c3']]},
    {n:'dépistage · 1 %',w:[.01,.99,0,0],h:[.9,.05,0,0],lab:['M · 0,01','sains · 0,99','',''],A:'A = test positif',
      rd:[['malades, 0,9 × 0,01','0,009'],['sains, 0,05 × 0,99','0,0495'],['voie des sains / voie des malades','× 5,5'],['P(+), la somme','0,0585','c3']]},
    {n:'dépistage · 10 %',w:[.1,.9,0,0],h:[.9,.05,0,0],lab:['M · 0,1','sains · 0,9','',''],A:'A = test positif',
      rd:[['malades, 0,9 × 0,1','0,09'],['sains, 0,05 × 0,9','0,045'],['voie des sains / voie des malades','× 0,5'],['P(+), la somme','0,135','c3']]}];
  let cur={w:CASES[0].w.slice(),h:CASES[0].h.slice()},k0=0;const fresh=runner();
  function draw(st,C){
    while(g.firstChild)g.removeChild(g.firstChild);
    let x=X0;
    st.w.forEach((w,i)=>{const pw=w*WW;if(pw<0.05){return;}
      box(g,x,Y0+HH*(1-st.h[i]),Math.max(pw,1.5),HH*st.h[i],'sl-areaA');box(g,x,Y0,pw,HH,'sl-strip');
      if(C.lab[i]){const wide=pw>60;txt(g,wide?x+pw/2:x,Y0+HH+16,C.lab[i],'sl-lbl',wide?'middle':'start');}
      x+=pw;});
    box(g,X0,Y0,WW,HH,'sl-omega');
    txt(g,X0,Y0-8,'Ω : largeur = P(Bᵢ), hauteur rouge = P(A ∣ Bᵢ), '+C.A,'sl-lbl');
    rd(out,C.rd);
  }
  buttons(document.getElementById('v3ctl'),CASES.map(c=>c.n),k=>{const tk=fresh(),a={w:cur.w.slice(),h:cur.h.slice()},C=CASES[k],b={w:C.w,h:C.h};
    if(k===k0){cur={w:b.w.slice(),h:b.h.slice()};draw(cur,C);return;}k0=k;
    tween(800,u=>{cur={w:a.w.map((v,i)=>v+(b.w[i]-v)*u),h:a.h.map((v,i)=>v+(b.h[i]-v)*u)};draw(cur,C);},tk);});
})();

/* ===== v4 : les positifs, une personne par carré ===== */
(function(){
  const host=document.getElementById('v4plot'),out=document.getElementById('v4out'),W=560,H=200;
  const S=canvas(host,W,H),hd=SL.el('g',{},S),g=SL.el('g',{},S);
  const CASES=[{n:'cancer · Brunton 10',N:100000,sick:100,tp:99,fp:999,cols:61,c:8},
    {n:'drogue, test à 90 %',N:1000,sick:100,tp:90,fp:90,cols:30,c:16},
    {n:'drogue, spécificité 0,8',N:1000,sick:100,tp:90,fp:180,cols:30,c:16}];
  const fresh=runner();let first=true;
  function cell(C,i){const r=Math.floor(i/C.cols),q=i%C.cols,step=C.c+1+(C.c>10?1:0);
    return box(g,6+q*step,28+r*step,C.c,C.c,i<C.tp?'sl-pp1':'sl-pp3');}
  function show(k){
    const tk=fresh(),C=CASES[k];while(g.firstChild)g.removeChild(g.firstChild);while(hd.firstChild)hd.removeChild(hd.firstChild);
    txt(hd,6,16,ent(C.N)+' testés · '+ent(C.sick)+' malades, '+ent(C.N-C.sick)+' sains → '+ent(C.tp+C.fp)+' positifs','sl-lbl');
    rd(out,[['malades détectés, en bleu',ent(C.tp),'c1'],['sains mal classés, en rouge',ent(C.fp),'c3'],['P(malade ∣ +)',ent(C.tp)+'/'+ent(C.tp+C.fp)+' = '+pct(C.tp/(C.tp+C.fp))]]);
    const tot=C.tp+C.fp;
    if(first){first=false;for(let i=0;i<tot;i++)cell(C,i);return;}
    let i=0;const per=Math.max(2,Math.ceil(tot/90));
    loop(tk,()=>{for(let j=0;j<per&&i<tot;j++,i++)cell(C,i);return i<tot;});
  }
  buttons(document.getElementById('v4ctl'),CASES.map(c=>c.n),show);
})();

/* ===== v5 : dépister, puis refaire un test ===== */
(function(){
  const host=document.getElementById('v5plot'),out=document.getElementById('v5out'),W=560,H=230,BX=10,BW=360;
  const S=canvas(host,W,H),g=SL.el('g',{},S);
  const CASES=[{n:'cancer',lr:'99',st:[[10000,9990000,'1:999'],[9900,99900,'99:999'],[9801,999,'9 801:999']]},
    {n:'drogue, test à 90 %',lr:'9',st:[[100,900,'1:9'],[90,90,'1:1'],[81,9,'9:1']]},
    {n:'drogue, spécificité 0,8',lr:'4,5',st:[[100,900,'1:9'],[90,180,'1:2'],[81,36,'9:4']]}];
  const ROW=['avant le test','après 1 positif','après 2 positifs'];
  const fresh=runner();let kc=0;
  function draw(C,vis,u){
    while(g.firstChild)g.removeChild(g.firstChild);
    txt(g,BX+BW+18,14,'cote','sl-lbl');txt(g,BX+BW+110,14,'P(malade)','sl-lbl');
    C.st.forEach((s,i)=>{if(i>vis)return;const y=40+i*68,p=s[0]/(s[0]+s[1]);
      let sh=p;if(i===vis&&i>0){const q=C.st[i-1][0]/(C.st[i-1][0]+C.st[i-1][1]);sh=q+(p-q)*u;}
      txt(g,BX,y-8,ROW[i]+' : '+ent(s[0])+' malades, '+ent(s[1])+' sains','sl-lbl');
      const wb=Math.max(2,sh*BW);box(g,BX,y,wb,24,'sl-cellv sl-k1');box(g,BX+wb,y,BW-wb,24,'sl-cellv sl-k2 sl-kc');
      if(i<vis||u>=1){txt(g,BX+BW+18,y+17,s[2],'sl-mono');txt(g,BX+BW+110,y+17,pct(p,2),'sl-mono'+(i===2?' on':''));}
      if(i>0&&(i<vis||u>=1))txt(g,BX+BW+18,y-8,'× '+C.lr,'sl-lbl sl-c3');});
  }
  function show(k){kc=k;const C=CASES[k];fresh();draw(C,2,1);
    rd(out,[['LR⁺ du test',C.lr],['après 1 positif',pct(C.st[1][0]/(C.st[1][0]+C.st[1][1]),2)],['après 2 positifs',pct(C.st[2][0]/(C.st[2][0]+C.st[2][1]),2),'c3']]);}
  const ctl=document.getElementById('v5ctl');
  buttons(ctl,CASES.map(c=>c.n),show);
  SL.h('button','tb',ctl,'▶ rejouer').onclick=()=>{const tk=fresh(),C=CASES[kc];draw(C,0,1);
    const step=v=>{if(v>2||tk.dead)return;setTimeout(()=>{if(tk.dead)return;tween(900,u=>draw(C,v,u),tk,()=>step(v+1));},SL.reduced?0:350);};step(1);};
})();

/* ===== v6 : quelles cases chaque métrique regarde ===== */
(function(){
  const host=document.getElementById('v6plot'),out=document.getElementById('v6out'),W=560,H=236;
  const S=canvas(host,W,H),g=SL.el('g',{},S),N=10000;
  const CX=[150,280,410],RY=[34,92,150],CW=120,CH=50;
  const MET=[{n:'rappel',num:['TP'],den:['TP','FN'],f:'TP / (TP + FN)'},{n:'spécificité',num:['TN'],den:['TN','FP'],f:'TN / (TN + FP)'},
    {n:'précision',num:['TP'],den:['TP','FP'],f:'TP / (TP + FP)'},{n:'accuracy',num:['TP','TN'],den:['TP','FN','FP','TN'],f:'(TP + TN) / N'}];
  const PREV=[.1,.01,.5],TEST=[[.9,.95],[1,0],[0,1]];const st={p:0,t:0,m:2};
  const POS={TP:[0,0],FN:[1,0],FP:[0,1],TN:[1,1]};
  function val(c,m){const v=MET[m].num.reduce((a,k)=>a+c[k],0),d=MET[m].den.reduce((a,k)=>a+c[k],0);return d?v/d:NaN;}
  function draw(){
    while(g.firstChild)g.removeChild(g.firstChild);
    const pr=PREV[st.p],s=TEST[st.t][0],t=TEST[st.t][1],sick=N*pr,heal=N-sick;
    const c={TP:Math.round(sick*s),FN:Math.round(sick*(1-s)),FP:Math.round(heal*(1-t)),TN:Math.round(heal*t)};
    ['test +','test −','total'].forEach((h,i)=>txt(g,CX[i]+CW/2,22,h,'sl-lbl','middle'));
    ['malade','sain','total'].forEach((h,j)=>txt(g,CX[0]-12,RY[j]+CH/2+5,h,'sl-lbl','end'));
    const M=MET[st.m];
    Object.keys(POS).forEach(k=>{const q=POS[k],x=CX[q[0]],y=RY[q[1]];
      box(g,x,y,CW,CH,'sl-tcell');if(M.num.includes(k))box(g,x,y,CW,CH,'sl-num');
      txt(g,x+8,y+15,k,'sl-tick');txt(g,x+CW/2,y+CH/2+10,ent(c[k]),'sl-tval','middle');});
    Object.keys(POS).forEach(k=>{if(M.den.includes(k)){const q=POS[k];box(g,CX[q[0]]+1.5,RY[q[1]]+1.5,CW-3,CH-3,'sl-den');}});
    [[c.TP+c.FN,2,0],[c.FP+c.TN,2,1],[c.TP+c.FP,0,2],[c.FN+c.TN,1,2],[N,2,2]].forEach(z=>{txt(g,CX[z[1]]+CW/2,RY[z[2]]+CH/2+6,ent(z[0]),'sl-mono','middle');});
    const nv=M.num.reduce((a,k)=>a+c[k],0),dv=M.den.reduce((a,k)=>a+c[k],0);
    txt(g,CX[0],RY[2]+CH+18,M.n+' = '+M.f+' = '+ent(nv)+' / '+ent(dv),'sl-lbl');
    const f=m=>{const v=val(c,m);return isNaN(v)?'0/0':fx(v,m===3?4:3);};
    rd(out,MET.map((q,i)=>[q.n+(i===st.m?', surlignée':''),f(i),i===st.m?'c3':'']));
  }
  const ctl=document.getElementById('v6ctl'),r1=SL.h('div','sl-ctl',ctl),r2=SL.h('div','sl-ctl',ctl),r3=SL.h('div','sl-ctl',ctl);
  buttons(r1,['10 % de malades','1 %','50 %'],k=>{st.p=k;draw();});
  buttons(r2,['test 0,90 / 0,95','toujours +','toujours −'],k=>{st.t=k;draw();});
  const bm=buttons(r3,MET.map(m=>m.n),k=>{st.m=k;draw();});bm[2].onclick();
})();

/* ===== v7 : la grille 4 × 13 de Brunton ===== */
(function(){
  const host=document.getElementById('v7plot'),out=document.getElementById('v7out'),W=560,H=180;
  const S=canvas(host,W,H),gG=SL.el('g',{},S),gH=SL.el('g',{},S);
  const SUITS=['♣','♦','♥','♠'],VALS=['1','2','3','4','5','6','7','8','9','10','V','D','R'],X0=70,Y0=30,CW=32,CH=30,GP=3;
  const cells=[];for(let s=0;s<4;s++)for(let v=0;v<13;v++){const e=box(gG,X0+v*(CW+GP),Y0+s*(CH+GP),CW,CH,'sl-cellv'+(s===3?' sl-k2':''));cells.push({s:s,v:v,e:e});}
  SUITS.forEach((s,i)=>txt(gG,X0-10,Y0+i*(CH+GP)+21,s,'sl-sym'+(i===1||i===2?' r':''),'end'));
  VALS.forEach((v,i)=>txt(gG,X0+i*(CW+GP)+CW/2,Y0-8,v,'sl-tick','middle'));
  const B=[{n:'dame',f:c=>c.v===11,ab:'1/52',pp:'1/4 × 1/13 = 1/52',c:'1/4',ok:true},{n:'trois',f:c=>c.v===2,ab:'1/52',pp:'1/4 × 1/13 = 1/52',c:'1/4',ok:true},
    {n:'figure (V, D, R)',f:c=>c.v>=10,ab:'3/52',pp:'1/4 × 3/13 = 3/52',c:'1/4',ok:true},{n:'noire',f:c=>c.s===0||c.s===3,ab:'1/4',pp:'1/4 × 1/2 = 1/8',c:'1/2',ok:false},
    {n:'cœur',f:c=>c.s===2,ab:'0',pp:'1/4 × 1/4 = 1/16',c:'0',ok:false}];
  buttons(document.getElementById('v7ctl'),B.map(b=>b.n),k=>{const b=B[k];while(gH.firstChild)gH.removeChild(gH.firstChild);
    cells.forEach(c=>{c.e.classList.toggle('sl-fade',!b.f(c));if(b.f(c)&&c.s===3)box(gH,X0+c.v*(CW+GP)+1,Y0+c.s*(CH+GP)+1,CW-2,CH-2,'sl-hit');});
    txt(gH,X0,Y0+4*(CH+GP)+16,'A = pique, la ligne du bas ; B = '+b.n+' ; A ∩ B entouré de rouge','sl-lbl');
    rd(out,[['P(A ∩ B)',b.ab],['P(A) P(B) = '+b.pp.split(' = ')[0],b.pp.split(' = ')[1]],['P(A ∣ B), contre P(A) = 1/4',b.c,'c3'],[k===4?'verdict (A et B disjoints)':'verdict',b.ok?'indépendants':'dépendants']]);});
})();

/* ===== v8 : la guirlande et les disques de secours ===== */
(function(){
  const host=document.getElementById('v8plot'),out=document.getElementById('v8out'),W=560,H=250,p=0.05,q=0.001;
  const S=canvas(host,W,H),g=SL.el('g',{},S);
  const st={mode:0,n:10,cc:false,fail:null,shock:false,runs:0,ko:0};let seed=7;const fresh=runner();
  function wire(x1,y1,x2,y2,ok){SL.el('line',{x1:x1,y1:y1,x2:x2,y2:y2,class:'sl-wire'},g);}
  function comp(x,y,w,h,ko){box(g,x-w/2,y-h/2,w,h,'sl-box'+(ko?' ko':''));if(ko)txt(g,x,y+5,'✕','sl-ko','middle');}
  function exact(){const n=st.n,base=st.mode?Math.pow(p,n):1-Math.pow(1-p,n);return st.cc?q+(1-q)*base:base;}
  function draw(){
    while(g.firstChild)g.removeChild(g.firstChild);
    const n=st.n,f=st.fail||new Array(n).fill(false),down=st.shock||(st.mode?f.every(x=>x):f.some(x=>x));
    SL.el('circle',{cx:20,cy:125,r:5,class:'sl-node'},g);SL.el('circle',{cx:540,cy:125,r:5,class:'sl-node'},g);
    if(st.mode===0){const span=440/n,w=Math.min(34,span-10);
      for(let i=0;i<n;i++){const cx=60+span*(i+0.5);wire(i?60+span*i-(span-w)/2:20,125,cx-w/2,125);comp(cx,125,w,30,f[i]);}
      wire(60+span*n-(span-w)/2,125,540,125);}
    else{const span=210/n,h=Math.min(26,span-4);wire(20,125,150,125);wire(410,125,540,125);
      SL.el('line',{x1:150,y1:20+span/2,x2:150,y2:20+span*(n-0.5),class:'sl-wire'},g);SL.el('line',{x1:410,y1:20+span/2,x2:410,y2:20+span*(n-0.5),class:'sl-wire'},g);
      for(let i=0;i<n;i++){const cy=20+span*(i+0.5);wire(150,cy,262,cy);wire(298,cy,410,cy);comp(280,cy,36,h,f[i]);}}
    if(st.shock)txt(g,280,244,'surtension : tout tombe d’un coup','sl-ko','middle');
    txt(g,20,13,st.runs?'dernier système tiré\u00a0: '+(down?'coupé':'le courant passe'):'',down?'sl-ko':'sl-lbl');
    rd(out,[['P(panne), exacte',sci(exact()),'c3'],['systèmes tirés',st.runs?ent(st.runs):'aucun'],['dont en panne',st.runs?String(st.ko):'·'],['fréquence observée',st.runs?SL.fmt(st.ko/st.runs,3):'·']]);
  }
  function reset(){fresh();st.fail=null;st.shock=false;st.runs=0;st.ko=0;draw();}
  const ctl=document.getElementById('v8ctl');
  buttons(ctl,['série','parallèle'],k=>{st.mode=k;reset();});
  const cb=SL.h('button','tb',ctl,'cause commune : non');cb.onclick=()=>{st.cc=!st.cc;cb.textContent='cause commune : '+(st.cc?'oui, 1 ‰':'non');cb.setAttribute('aria-pressed',String(st.cc));run.textContent=st.cc?'▶ 20 000 systèmes':'▶ 1 000 systèmes';reset();};
  const run=SL.h('button','tb',ctl,'▶ 1 000 systèmes');
  /* avec la cause commune, 1 000 tirages ne montrent rien (0 panne une fois sur trois) : on en tire 20 000 */
  run.onclick=()=>{const tk=fresh(),r=rng(seed++),N=st.cc?20000:1000,per=N/50;st.runs=0;st.ko=0;
    loop(tk,()=>{for(let j=0;j<per&&st.runs<N;j++){st.shock=st.cc&&r()<q;st.fail=[];for(let i=0;i<st.n;i++)st.fail.push(r()<p);
      const down=st.shock||(st.mode?st.fail.every(x=>x):st.fail.some(x=>x));st.runs++;if(down)st.ko++;}draw();return st.runs<N;});};
  SL.slider(document.getElementById('v8sl'),{label:'composants n',min:1,max:10,step:1,value:10,fmt:v=>String(v)},v=>{st.n=v;reset();});
})();

/* ===== v9 : trois paires indépendantes, un triplet qui ne l'est pas ===== */
(function(){
  const host=document.getElementById('v9plot'),out=document.getElementById('v9out'),W=560,H=200;
  const S=canvas(host,W,H),g=SL.el('g',{},S),X0=170,Y0=40,CW=150,CH=64;
  const OUT=[{a:'face',b:'face',m:'ABC'},{a:'pile',b:'face',m:'B'},{a:'face',b:'pile',m:'A'},{a:'pile',b:'pile',m:'C'}];
  const pos=[[0,0],[1,0],[0,1],[1,1]];
  const SEL=[{n:'A ∩ B',e:'AB',pr:'1/2 × 1/2 = 1/4',v:'1/4',ok:true},{n:'A ∩ C',e:'AC',pr:'1/2 × 1/2 = 1/4',v:'1/4',ok:true},{n:'B ∩ C',e:'BC',pr:'1/2 × 1/2 = 1/4',v:'1/4',ok:true},
    {n:'A ∩ B ∩ C',e:'ABC',pr:'1/2 × 1/2 × 1/2 = 1/8',v:'1/4',ok:false},{n:'C sachant A ∩ B',e:'ABC',cond:true}];
  txt(S,X0+CW,22,'première pièce : face │ pile','sl-lbl','middle');
  ['face','pile'].forEach((s,j)=>txt(S,X0-12,Y0+j*(CH+8)+CH/2+5,'2ᵉ pièce '+s,'sl-lbl','end'));
  buttons(document.getElementById('v9ctl'),SEL.map(s=>s.n),k=>{const s=SEL[k];while(g.firstChild)g.removeChild(g.firstChild);
    OUT.forEach((o,i)=>{const x=X0+pos[i][0]*(CW+8),y=Y0+pos[i][1]*(CH+8),hit=s.e.split('').every(c=>o.m.includes(c));
      box(g,x,y,CW,CH,'sl-cellv');if(hit){box(g,x,y,CW,CH,'sl-num');box(g,x+1.5,y+1.5,CW-3,CH-3,'sl-hit');}
      txt(g,x+CW/2,y+24,'('+o.a+', '+o.b+') · ¼','sl-lbl','middle');
      txt(g,x+CW/2,y+48,o.m.split('').join(' '),'sl-sym','middle');});
    if(s.cond)rd(out,[['P(C ∣ A ∩ B)','1','c3'],['P(C) seul','1/2'],['verdict','A et B décident C']]);
    else rd(out,[['P('+s.n+')',s.v,'c3'],['produit des probabilités',s.pr],['verdict',s.ok?'égal':'différent']]);});
})();
