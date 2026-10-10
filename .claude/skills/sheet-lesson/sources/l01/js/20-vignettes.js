/* ===== v1 : le même nombre p(k ; θ), lu dans les deux sens ===== */
(function(){
  const ctl=document.getElementById('v1ctl'),host=document.getElementById('v1plot'),out=document.getElementById('v1out'),seqEl=document.getElementById('v1seq');
  const C=[1,10,45,120,210,252,210,120,45,10,1];
  const p=(k,t)=>C[k]*Math.pow(t,k)*Math.pow(1-t,10-k);
  const row=SL.h('div','v-row',host),L=SL.h('div','',row),R=SL.h('div','',row);
  const st={t:0.5,k:7,seq:null,shown:0};
  const scale=m=>[0.3,0.45,0.65,1.05].find(v=>v>=m*1.08)||1.05;
  const ticks=y=>y<=0.3?[0,0.1,0.2,0.3]:y<=0.45?[0,0.2,0.4]:y<=0.65?[0,0.2,0.4,0.6]:[0,0.5,1];
  const fp=x=>x<0.0005?'< 0,001':SL.fmt(x,3);
  function draw(){
    L.innerHTML='';R.innerHTML='';
    const t=st.t,k=st.k,pk=p(k,t);
    SL.h('div','v-tt',L,'probabilité : θ = '+SL.fmt(t,2)+' fixé, k varie');
    let mL=0;for(let j=0;j<=10;j++)mL=Math.max(mL,p(j,t));const yL=scale(mL);
    const A=SL.plot(L,{x:[-0.6,10.6],y:[0,yL],w:300,h:230,xt:[0,2,4,6,8,10],yt:ticks(yL),xl:'k piles sur 10'});
    leftAxis(A,-0.6);
    for(let j=0;j<=10;j++)bar(A,j-0.38,j+0.38,p(j,t),j===k?'sl-bar2':'sl-bar');
    SL.h('div','v-tt',R,'statistique : k = '+k+' observé, θ varie');
    const peak=p(k,k/10),yR=scale(peak);
    const B=SL.plot(R,{x:[0,1],y:[0,yR],w:300,h:230,xt:[0,0.25,0.5,0.75,1],yt:ticks(yR),xl:'θ = P(pile)'});
    curve(B,x=>p(k,x),0,1,'sl-c1',yR);
    B.vline(t,'sl-c4 sl-dash');B.dot(k/10,peak,'hollow sl-c1',5);B.dot(t,pk,'sl-c3',5.5);
    rd(out,[['p(k ; θ), dans les deux panneaux',fp(pk),'c3'],['θ fixé',SL.fmt(t,2)],['k observé',String(k)],['θ qui maximise la courbe',SL.fmt(k/10,1)]]);
    if(st.seq){const s=st.seq.slice(0,st.shown).join(' ');seqEl.innerHTML=s+(st.shown===10?' <small>→ k = '+st.seq.filter(c=>c==='P').length+' piles, tirés avec θ = '+SL.fmt(st.tseq,2)+'</small>':'');}
    else seqEl.innerHTML='<small>aucune séquence tirée</small>';
  }
  const a=SL.h('div','',ctl);
  const sT=SL.slider(a,{label:'θ = P(pile)',min:0.05,max:0.95,step:0.05,value:0.5,fmt:v=>SL.fmt(v,2)},v=>{st.t=v;draw();});
  const sK=SL.slider(a,{label:'k observé',min:0,max:10,step:1,value:7,fmt:v=>String(v)},v=>{st.k=v;if(st.seq&&st.shown===10&&st.seq.filter(c=>c==='P').length!==v)st.seq=null;draw();});
  const fresh=runner();let seed=3;
  SL.h('button','tb',SL.h('div','sl-ctl',ctl),'▶ lancer 10 pièces').onclick=()=>{
    const tk=fresh(),r=rng(seed++);st.seq=[];st.tseq=st.t;for(let i=0;i<10;i++)st.seq.push(r()<st.t?'P':'F');
    const done=()=>{st.shown=10;sK.set(st.seq.filter(c=>c==='P').length);};
    if(SL.reduced){done();return;}
    st.shown=0;let i=0;const step=()=>{if(tk.dead)return;i++;st.shown=i;draw();if(i<10)setTimeout(step,110);else done();};setTimeout(step,60);
  };
  draw();
})();

/* ===== v2 : les cases de Ω, les cases de A, et 1 000 lancers ===== */
(function(){
  const ctl=document.getElementById('v2ctl'),host=document.getElementById('v2plot'),out=document.getElementById('v2out');host.classList.add('nogrid');
  const EV=[{dice:0,f:(a,b)=>a===1||b===1,lab:'deux pièces, au moins un pile'},{dice:0,f:(a,b)=>a===2&&b===2,lab:'deux pièces, aucun pile'},
            {dice:1,f:(a,b)=>a===5||b===5,lab:'deux dés, au moins un 5'},{dice:1,f:(a,b)=>a+b===7,lab:'deux dés, somme 7'}];
  let cur=2,P=null,dots=null,n=0,hits=0,seed=7;const fresh=runner();
  function report(){
    const E=EV[cur],m=E.dice?6:2,N=m*m;let a=0;for(let i=1;i<=m;i++)for(let j=1;j<=m;j++)if(E.f(i,j))a++;
    rd(out,[['#Ω, issues possibles',String(N)],['#A, cas favorables',String(a),'c3'],['P(A) = #A/#Ω',a+'/'+N+' = '+SL.fmt(a/N,3),'c3'],n?['fréquence de A sur '+big(n)+' lancers',SL.fmt(hits/n,3)]:['fréquence de A','aucun lancer']]);
  }
  function setup(k){
    fresh();cur=k;n=0;hits=0;host.innerHTML='';
    const E=EV[k],m=E.dice?6:2,nm=v=>E.dice?String(v):(v===1?'P':'F');
    P=SL.plot(host,{x:[0.5,m+0.5],y:[0.5,m+0.5],w:440,h:432,xt:[],yt:[],xl:E.dice?'premier dé en colonne, second en ligne':'premier lancer en colonne, second en ligne'});
    for(let v=1;v<=m;v++){txt(P.layer,P.sx(v),P.sy(0.5)+15,nm(v),'sl-tick');txt(P.layer,P.sx(0.5)-7,P.sy(v)+4,nm(v),'sl-tick','end');}
    for(let i=1;i<=m;i++)for(let j=1;j<=m;j++)rect(P,i-0.46,i+0.46,j-0.46,j+0.46,E.f(i,j)?'sl-cellp sl-a':'sl-cello',P.layer);
    dots=SL.el('g',{},P.layer);const labs=SL.el('g',{},P.layer);
    for(let i=1;i<=m;i++)for(let j=1;j<=m;j++)txt(labs,P.sx(i),P.sy(j)+(E.dice?4:6),E.dice?'('+i+', '+j+')':nm(i)+nm(j),E.dice?'sl-cell-t':'sl-cell-t big');
    report();
  }
  function throwN(){
    const tk=fresh(),r=rng(seed++),E=EV[cur],m=E.dice?6:2;n=0;hits=0;while(dots.firstChild)dots.removeChild(dots.firstChild);
    loop(tk,()=>{const k=n<40?1:n<200?4:12;for(let j=0;j<k&&n<1000;j++){const a=1+Math.floor(m*r()),b=1+Math.floor(m*r());n++;if(E.f(a,b))hits++;
      SL.el('circle',{cx:P.sx(a-0.42+0.84*r()).toFixed(1),cy:P.sy(b-0.42+0.84*r()).toFixed(1),r:1.9,class:'sl-dot sl-c4 sl-tiny'},dots);}report();return n<1000;});
  }
  const bs=buttons(ctl,EV.map(e=>e.lab),setup);
  SL.h('button','tb',ctl,'▶ lancer 1 000 fois').onclick=throwN;
  bs[2].onclick();
})();

/* ===== v3 : l'arbre, chaque étape multiplie les feuilles ===== */
(function(){
  const ctl=document.getElementById('v3ctl'),host=document.getElementById('v3plot'),out=document.getElementById('v3out');
  const W=560,H=290,ML=14,MR=64,MT=18,MB=40;
  const S=SL.el('svg',{viewBox:`0 0 ${W} ${H}`,class:'sl-plot'},host),G=SL.el('g',{},S);
  const M=[{ks:[2]},{ks:[2,2]},{ks:[2,2,2]},{ks:[2,2,2,2]},{ks:[6,6]}],lab=['1 pièce','2 pièces','3 pièces','4 pièces','deux dés'];
  const DEF=[[0],[0,1],[0,1,0],[0,1,0,1],[2,4]];
  let cur=2,path=DEF[2].slice(),seed=9;const fresh=runner();
  const coin=()=>M[cur].ks[0]===2,nm=v=>coin()?(v===0?'P':'F'):String(v+1);
  const pname=()=>coin()?path.map(nm).join(''):'('+path.map(nm).join(', ')+')';
  function draw(upto){
    while(G.firstChild)G.removeChild(G.firstChild);
    const ks=M[cur].ks,r=ks.length,L=ks.reduce((a,b)=>a*b,1);
    const pre=d=>ks.slice(0,d).reduce((a,b)=>a*b,1),lx=i=>ML+(i+0.5)*(W-ML-MR)/L,ly=d=>MT+d*(H-MT-MB)/r;
    const nx=(d,idx)=>{const s=L/pre(d);return lx(idx*s+(s-1)/2);};
    const pidx=[0];for(let d=0;d<r;d++)pidx.push(pidx[d]*ks[d]+path[d]);
    for(let d=0;d<r;d++){
      for(let idx=0;idx<pre(d);idx++)for(let c=0;c<ks[d];c++){
        const on=d<upto&&idx===pidx[d]&&c===path[d],ch=idx*ks[d]+c;
        const x1=nx(d,idx),y1=ly(d),x2=nx(d+1,ch),y2=ly(d+1);
        SL.el('line',{x1:x1.toFixed(1),y1:y1.toFixed(1),x2:x2.toFixed(1),y2:y2.toFixed(1),class:'sl-tree'+(on?' on':'')},G);
        if(L<=16||d===0||on)txt(G,(x1+x2)/2+(c<ks[d]/2?-10:10),(y1+y2)/2+4,nm(c),'sl-leaf'+(on?' on':''));
      }
      txt(G,W-MR+12,ly(d+1)+4,'× '+ks[d],'sl-qh','start');
    }
    for(let d=0;d<=r;d++)for(let idx=0;idx<pre(d);idx++){
      const on=d<=upto&&idx===pidx[d];
      SL.el('circle',{cx:nx(d,idx).toFixed(1),cy:ly(d).toFixed(1),r:on?4:2.4,class:'sl-dot '+(on?'sl-c3':'sl-c1')},G);}
    for(let i=0;i<L;i++){const on=upto>=r&&i===pidx[r];
      if(L<=16||on){let s='',q=i;for(let d=r-1;d>=0;d--){s=nm(q%ks[d])+(coin()?'':(s?', ':''))+s;q=Math.floor(q/ks[d]);}
        const t=txt(G,lx(i),ly(r)+18,coin()?s:'('+s+')','sl-leaf'+(on?' on':''));if(L===16)t.setAttribute('style','font-size:9px');}}
    txt(G,W-MR+12,ly(r)+18,'= '+L,'sl-qh','start');
    rd(out,[['étapes',String(r)],['options par étape',ks.join(' × ')],['feuilles = séquences',String(L),'c3'],['chemin rouge',upto>=r?pname():'…']]);
  }
  buttons(ctl,lab,k=>{fresh();cur=k;path=DEF[k].slice();draw(M[k].ks.length);});
  SL.h('button','tb',ctl,'▶ une séquence au hasard').onclick=()=>{
    const tk=fresh(),r=rng(seed++),ks=M[cur].ks;path=ks.map(k=>Math.floor(k*r()));
    tween(260*ks.length+200,u=>draw(Math.min(ks.length,Math.floor(u*(ks.length+0.999)))),tk);
  };
  ctl.querySelectorAll('button')[2].onclick();
})();

/* ===== v4 : le paquet qui rétrécit, ou qu'on remplit à nouveau ===== */
(function(){
  const ctl=document.getElementById('v4ctl'),host=document.getElementById('v4plot'),out=document.getElementById('v4out');
  const W=560,H=250,S=SL.el('svg',{viewBox:`0 0 ${W} ${H}`,class:'sl-plot'},host);
  const RK=['A','2','3','4','5','6','7','8','9','10','V','D','R'],SU=['♠','♥','♦','♣'];
  const cw=41,chh=23,x0=(W-13*cw)/2,y0=6,red=i=>{const s=Math.floor(i/13);return s===1||s===2;},name=i=>RK[i%13]+SU[Math.floor(i/13)];
  const cards=[];
  for(let i=0;i<52;i++){const s=Math.floor(i/13),k=i%13;
    const r=SL.el('rect',{x:x0+k*cw+2,y:y0+s*(chh+3),width:cw-4,height:chh,rx:3,class:'sl-card'},S);
    cards.push({r:r,t:txt(S,x0+k*cw+cw/2,y0+s*(chh+3)+16,name(i),'sl-card-t'+(red(i)?' red':''))});}
  const sw=92,sx0=(W-5*sw)/2,sy=y0+4*(chh+3)+30,slots=[];
  for(let j=0;j<5;j++){const x=sx0+j*sw;
    slots.push({r:SL.el('rect',{x:x+8,y:sy,width:sw-16,height:78,rx:4,class:'sl-slot'},S),n:txt(S,x+sw/2,sy+28,'','sl-slot-n'),c:txt(S,x+sw/2,sy+60,'','sl-slot-c')});
    if(j<4)txt(S,x+sw,sy+28,'×','sl-slot-n');
    txt(S,x+sw/2,sy+96,'carte '+(j+1),'sl-pos');}
  let mode=0,dealt=[],shown=5,seed=4;const fresh=runner();
  function render(){
    const gone=mode===0?dealt.slice(0,shown):[],last=shown>0?dealt[shown-1]:-1;
    cards.forEach((c,i)=>{const o=gone.includes(i);c.r.setAttribute('class','sl-card'+(o?' out':mode===1&&i===last?' hl':''));c.t.setAttribute('class','sl-card-t'+(red(i)?' red':'')+(o?' out':''));});
    slots.forEach((s,j)=>{s.n.textContent=String(mode===0?52-j:52);s.c.textContent=j<shown?name(dealt[j]):'';
      s.c.setAttribute('class','sl-slot-c'+(j<shown&&red(dealt[j])?' red':''));s.r.setAttribute('class','sl-slot'+(j<shown?' on':''));});
    const A=big(311875200),B=big(380204032);
    rd(out,mode===0?[['choix à chaque tirage','52·51·50·49·48'],['séquences sans remise',A,'c3'],['avec remise, 52⁵',B]]
                   :[['choix à chaque tirage','52·52·52·52·52'],['séquences avec remise',B,'c3'],['sans remise, 52!/47!',A]]);
  }
  function draw5(r){dealt=[];while(dealt.length<5){const c=Math.floor(52*r());if(mode===1||!dealt.includes(c))dealt.push(c);}}
  draw5(rng(seed++));
  buttons(ctl,['sans remise','avec remise'],k=>{fresh();mode=k;shown=5;render();});
  SL.h('button','tb',ctl,'▶ distribuer 5 cartes').onclick=()=>{
    const tk=fresh();draw5(rng(seed++));
    if(SL.reduced){shown=5;render();return;}
    shown=0;render();const step=()=>{if(tk.dead)return;shown++;render();if(shown<5)setTimeout(step,420);};setTimeout(step,250);
  };
})();

/* ===== v5 : une main, ce sont r! séquences ===== */
(function(){
  const ctl=document.getElementById('v5ctl'),host=document.getElementById('v5plot'),out=document.getElementById('v5out');
  const C=['A','R','D','V','10'],seqs=[],hands=[];
  for(let a=0;a<5;a++)for(let b=0;b<5;b++)for(let c=0;c<5;c++)if(a!==b&&b!==c&&a!==c)seqs.push([a,b,c]);
  for(let a=0;a<5;a++)for(let b=a+1;b<5;b++)for(let c=b+1;c<5;c++)hands.push([a,b,c]);
  const hid=s=>hands.findIndex(h=>h.every(x=>s.includes(x))),col=[];const seen=Array(10).fill(0);
  seqs.forEach(s=>{const h=hid(s);col.push([h,seen[h]++]);});
  const W=560,H=270,ML=92,MT=6,cw=(W-ML-6)/6,rh=26;
  const S=SL.el('svg',{viewBox:`0 0 ${W} ${H}`,class:'sl-plot'},host);
  const labs=hands.map((h,i)=>txt(S,ML-8,MT+i*rh+17,'{'+h.map(x=>C[x]).join(', ')+'}','sl-seq-t','end'));
  const cells=seqs.map(s=>({r:SL.el('rect',{width:cw-6,height:rh-5,rx:3,class:'sl-cell2'},S),t:txt(S,0,0,s.map(x=>C[x]).join(' '),'sl-seq-t')}));
  let u=1,hl=0;const fresh=runner();
  function place(v){
    seqs.forEach((s,p)=>{const r0=Math.floor(p/6),c0=p%6,r1=col[p][0],c1=col[p][1];
      const x=ML+(c0+(c1-c0)*v)*cw+3,y=MT+(r0+(r1-r0)*v)*rh;
      cells[p].r.setAttribute('x',x.toFixed(1));cells[p].r.setAttribute('y',y.toFixed(1));
      cells[p].t.setAttribute('x',(x+(cw-6)/2).toFixed(1));cells[p].t.setAttribute('y',(y+15).toFixed(1));});
    labs.forEach(l=>l.setAttribute('opacity',v.toFixed(2)));
  }
  function paint(){
    seqs.forEach((s,p)=>{const on=col[p][0]===hl;cells[p].r.setAttribute('class','sl-cell2'+(on?' on':''));cells[p].t.setAttribute('class','sl-seq-t'+(on?' on':''));});
    labs.forEach((l,i)=>l.setAttribute('class','sl-seq-t'+(i===hl?' on':'')));
    rd(out,[['séquences, 5 · 4 · 3','60'],['ordres d’une main, 3!','6'],['mains, 60/6','10','c3'],['main surlignée','{'+hands[hl].map(x=>C[x]).join(', ')+'}']]);
  }
  place(1);paint();
  buttons(ctl,['rangées par main','ordre de distribution'],k=>{const tk=fresh(),a=u,b=k===0?1:0;if(a===b){place(b);return;}tween(1000,v=>{u=a+(b-a)*v;place(u);},tk);});
  SL.h('button','tb',ctl,'main suivante').onclick=()=>{hl=(hl+1)%10;paint();};
})();

/* ===== v6 : étoiles et barres ===== */
(function(){
  const ctl=document.getElementById('v6ctl'),host=document.getElementById('v6plot'),out=document.getElementById('v6out');
  const MODES=[{n:4,r:3,nm:['vanille','chocolat','fraise','pistache'],sh:['van.','choc.','fr.','pist.'],start:1},{n:6,r:2,nm:['1','2','3','4','5','6'],sh:['1','2','3','4','5','6'],start:4}];
  function multisets(n,r){const res=[];const rec=(s,cur)=>{if(cur.length===r){res.push(cur.slice());return;}for(let t=s;t<n;t++){cur.push(t);rec(t,cur);cur.pop();}};rec(0,[]);return res;}
  const code=(ms,n)=>{const c=Array(n).fill(0);ms.forEach(t=>c[t]++);return c.map(x=>'★'.repeat(x)).join('|');};
  const W=560,H=300,S=SL.el('svg',{viewBox:`0 0 ${W} ${H}`,class:'sl-plot'},host),G=SL.el('g',{},S);
  let mode=0,idx=1,list=[];
  function draw(){
    while(G.firstChild)G.removeChild(G.firstChild);
    const m=MODES[mode],ms=list[idx],str=code(ms,m.n),L=str.length,sw=46,x0=(W-L*sw)/2;
    const stars=[];
    str.split('').forEach((ch,i)=>{const x=x0+i*sw+sw/2;txt(G,x,46,ch==='★'?'★':'|',ch==='★'?'sl-star':'sl-barg');
      txt(G,x,68,String(i+1),'sl-pos'+(ch==='★'?' on':''));if(ch==='★')stars.push(i+1);});
    const cnt=Array(m.n).fill(0);ms.forEach(t=>cnt[t]++);
    const desc=mode===0?cnt.map((c,t)=>c+' '+m.nm[t]).join(' · '):'les dés montrent {'+ms.map(t=>m.nm[t]).join(', ')+'}';
    txt(G,W/2,94,desc,'sl-qh');
    const cols=mode===0?5:7,rows=Math.ceil(list.length/cols),gw=(W-20)/cols,gh=36;S.setAttribute('viewBox',`0 0 ${W} ${114+rows*gh+2}`);
    list.forEach((q,i)=>{const cx=10+(i%cols)*gw,cy=114+Math.floor(i/cols)*gh,on=i===idx;
      SL.el('rect',{x:(cx+3).toFixed(1),y:cy.toFixed(1),width:(gw-6).toFixed(1),height:(gh-6).toFixed(1),rx:3,class:'sl-cell2'+(on?' on':'')},G);
      txt(G,cx+gw/2,cy+gh/2+1,code(q,m.n),'sl-seq-t'+(on?' on':''));});
    const N=list.length,tot=m.r+m.n-1;
    rd(out,[['étoiles + barres',m.r+' + '+(m.n-1)+' = '+tot+' places'],[(mode===0?'paniers':'résultats')+', C('+tot+', '+m.r+')',String(N),'c3'],['places des étoiles',stars.join(', ')],[(mode===0?'panier':'résultat')+' affiché',mode===0?ms.map(t=>m.sh[t]).join(' '):'{'+ms.map(t=>m.nm[t]).join(', ')+'}']]);
  }
  buttons(ctl,['glaces : 3 boules, 4 parfums','deux dés sans ordre'],k=>{mode=k;list=multisets(MODES[k].n,MODES[k].r);idx=MODES[k].start;draw();});
  SL.h('button','tb',ctl,'▶ panier suivant').onclick=()=>{idx=(idx+1)%list.length;draw();};
})();

/* ===== v7 : le tableau 2 × 2, et un scénario par case ===== */
(function(){
  const ctl=document.getElementById('v7ctl'),host=document.getElementById('v7plot'),out=document.getElementById('v7out');
  const W=560,H=300,ML=118,MT=30,cw=(W-ML-8)/2,ch=(H-MT-8)/2;
  const S=SL.el('svg',{viewBox:`0 0 ${W} ${H}`,class:'sl-plot'},host);
  txt(S,ML+cw/2,MT-10,'avec remise','sl-qh');txt(S,ML+1.5*cw,MT-10,'sans remise','sl-qh');
  txt(S,ML-10,MT+ch/2-4,'l’ordre','sl-qh','end');txt(S,ML-10,MT+ch/2+13,'compte','sl-qh','end');
  txt(S,ML-10,MT+1.5*ch-4,'l’ordre ne','sl-qh','end');txt(S,ML-10,MT+1.5*ch+13,'compte pas','sl-qh','end');
  const CELL=[[{f:'nʳ',i:'product(…, repeat=r)',e:'pièces, plaques, mots de passe'},{f:'n!/(n − r)!',i:'permutations(…, r)',e:'cartes distribuées, podium'}],
              [{f:'C(n + r − 1, r)',i:'combinations_with_replacement',e:'paniers, dés sans ordre',x:'absent chez Brunton'},{f:'C(n, r)',i:'combinations(…, r)',e:'mains, comités, features'}]];
  const R=[[0,0],[0,0]];
  for(let o=0;o<2;o++)for(let m=0;m<2;m++){const x=ML+m*cw,y=MT+o*ch,c=CELL[o][m];
    R[o][m]=SL.el('rect',{x:x+4,y:y+4,width:cw-8,height:ch-8,rx:5,class:'sl-q'},S);
    const tf=txt(S,x+cw/2,y+44,c.f==='nʳ'?'n':c.f,'sl-qf');if(c.f==='nʳ'){const ts=SL.el('tspan',{dy:'-9','font-size':'14'},tf);ts.textContent='r';}txt(S,x+cw/2,y+70,c.i,'sl-qi');txt(S,x+cw/2,y+92,c.e,'sl-qe');if(c.x)txt(S,x+cw/2,y+112,c.x,'sl-qn');}
  const SC=[{l:'plaque',o:0,m:0,how:'26⁴ × 10²',n:45697600},{l:'10 lancers de pièce',o:0,m:0,how:'2¹⁰',n:1024},{l:'podium, 8 coureurs',o:0,m:1,how:'8 × 7 × 6',n:336},
            {l:'main de poker',o:1,m:1,how:'C(52, 5)',n:2598960},{l:'5 features parmi 20',o:1,m:1,how:'C(20, 5)',n:15504},{l:'3 boules, 4 parfums',o:1,m:0,how:'C(6, 3)',n:20}];
  buttons(ctl,SC.map(s=>s.l),k=>{const s=SC[k];
    for(let o=0;o<2;o++)for(let m=0;m<2;m++)R[o][m].setAttribute('class','sl-q'+(o===s.o&&m===s.m?' on':''));
    rd(out,[['l’ordre compte ?',s.o===0?'oui':'non'],['remet-on ?',s.m===0?'oui':'non'],['compte : '+s.how,big(s.n),'c3']]);});
})();
