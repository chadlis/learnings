/* ===== Figure 1 (n2) : Var d'une somme = somme de toutes les cases ===== */
(function(){
  const host=document.getElementById('f1plot'),out=document.getElementById('f1out');
  const v=35/12,K=[2,4,6,8,10,12],NM=['pièce','d4','d6','d8','d10','d12'],sub='₀₁₂₃₄₅₆';
  const st={m:0,n:6};
  host.classList.add('nogrid');
  const P=SL.plot(host,{x:[0,12.55],y:[0,7],w:560,h:330,xt:[],yt:[]});
  P.svg.querySelectorAll('line.sl-axis').forEach(l=>l.remove());
  function cov(i,j){const m=st.m;if(m===0)return i===j?v:0;if(m===1)return i===j?(K[i]*K[i]-1)/12:0;if(m===2)return i===j?v:0.5*v;return v;}
  function draw(){
    P.clear();const n=st.n,x0=2.0,y0=6.35;let dg=0,off=0;
    for(let i=0;i<n;i++){
      P.text(x0+i+0.5,y0+0.18,'X'+sub[i+1],'','middle');
      P.text(x0-0.15,y0-i-0.62,'X'+sub[i+1]+(st.m===1?' '+NM[i]:''),'','end');
      for(let j=0;j<n;j++){const c=cov(i,j);if(i===j)dg+=c;else off+=c;
        rect(P,x0+j+0.04,x0+j+0.96,y0-i-0.04,y0-i-0.96,c===0?'sl-cello':(i===j?'sl-k2 sl-kc':'sl-k4 sl-kc'));
        P.text(x0+j+0.5,y0-i-0.62,c===0?'0':SL.fmt(c,2),'sl-cell-t','middle');}}
    /* barre : la somme des cases, diagonale puis hors diagonale, à l'échelle de n² σ² */
    const sc=5.6/(n*n*v),bx=9.6,hd=dg*sc,ho=off*sc;
    rect(P,bx,bx+0.9,0.4,6.0,'sl-cello');
    rect(P,bx,bx+0.9,0.4,0.4+hd,'sl-k2 sl-kc');if(ho>0)rect(P,bx,bx+0.9,0.4+hd,0.4+hd+ho,'sl-k4 sl-kc');
    P.seg(bx-0.15,0.4,bx+1.05,0.4,'');
    P.text(bx+0.45,0.4+hd+ho+0.2,'Var = '+SL.fmt(dg+off,2),'sl-c3','middle');
    P.text(bx+1.05,0.4+hd/2-0.12,'diag.','','start');if(ho>0.25)P.text(bx+1.05,0.4+hd+ho/2-0.12,'hors diag.','','start');
    P.text(bx+0.45,0.05,'échelle : toute la barre = n² × 2,917','','middle').setAttribute('class','sl-lbl sl-tick');
    rd(out,[['Σ diagonale : les variances',SL.fmt(dg,2)],['Σ hors diagonale : les covariances',SL.fmt(off,2)],
      ['Var(X₁ + … + Xₙ), toutes les cases',SL.fmt(dg+off,2),'c3'],['n σ²',st.m===1?'pas de σ² commun':SL.fmt(n*v,2)]]);
  }
  buttons(document.getElementById('f1ctl'),['i.i.d. : n dés','indépendants, lois différentes','même loi, corrélés (ρ = 0,5)','le même dé n fois'],k=>{st.m=k;draw();});
  SL.slider(document.getElementById('f1sl'),{label:'n variables',min:1,max:6,step:1,value:6,fmt:x=>String(x)},x=>{st.n=x;draw();});
})();

/* ===== Figure 2 (n4) : des nuages à ρ variable ===== */
(function(){
  const out=document.getElementById('f2out'),ctl=document.getElementById('f2ctl');
  const r=rng(23),N=300,U=[],Wn=[];for(let i=0;i<N;i++){U.push(gauss(r));Wn.push(gauss(r));}
  const P=SL.plot(document.getElementById('f2plot'),{x:[-6,6],y:[-4.5,4.5],w:560,h:427,xt:[-6,-4,-2,0,2,4,6],yt:[-4,-2,0,2,4],xl:'x',yl:'y'});
  clipTo(P,'f2clip');
  const st={rho:0.6,sy:1};
  function draw(){
    P.clear();const a=st.rho,b=Math.sqrt(Math.max(0,1-a*a)),Y=U.map((u,i)=>st.sy*(a*u+b*Wn[i])),sl=a*st.sy;
    U.forEach((u,i)=>P.dot(u,Y[i],'sl-c2 sl-tiny',2.6));
    P.seg(-6,-6*sl,6,6*sl,'sl-c4');
    const S=stats2(U,Y);
    rd(out,[['ρ réglé',fxm(a,2)],['ρ mesuré sur les 300 points',fxf(S.rho,2)],['Cov = ρ σ<sub>X</sub> σ<sub>Y</sub>',fxm(a*st.sy,2),'c3'],['pente de la droite, ρ σ<sub>Y</sub> / σ<sub>X</sub>',fxm(sl,2)]]);
  }
  SL.slider(ctl,{label:'ρ',min:-1,max:1,step:0.05,value:0.6,fmt:x=>fxm(x,2)},x=>{st.rho=x;draw();});
  SL.slider(ctl,{label:'σ de Y',min:0.5,max:2,step:0.1,value:1,fmt:x=>SL.fmt(x,1)},x=>{st.sy=x;draw();});
})();

/* ===== Figure 3 (n5) : une ellipse, trois curseurs ===== */
(function(){
  const out=document.getElementById('f3out'),ctl=document.getElementById('f3ctl');
  const P=SL.plot(document.getElementById('f3plot'),{x:[-6,6],y:[-4.5,4.5],w:560,h:427,xt:[-6,-4,-2,0,2,4,6],yt:[-4,-2,0,2,4],xl:'x',yl:'y'});
  clipTo(P,'f3clip');
  const st={s1:2,s2:1,th:45};
  function draw(){
    P.clear();const t=st.th*Math.PI/180,c=Math.cos(t),s=Math.sin(t),a=st.s1*st.s1,b=st.s2*st.s2;
    const vx=a*c*c+b*s*s,vy=a*s*s+b*c*c,cv=(a-b)*s*c,rho=cv/Math.sqrt(vx*vy),sl=cv/vx;
    [1,2,3].forEach(k=>ellipse(P,st.s1,st.s2,t,k,'sl-ell'+(k>1?' k2':'')));
    let maj='—';
    if(Math.abs(a-b)>1e-9){const g=a>b?t:t+Math.PI/2;P.seg(-12*Math.cos(g),-12*Math.sin(g),12*Math.cos(g),12*Math.sin(g),'sl-axisline');
      maj=Math.abs(Math.cos(g))<1e-9?'∞':fxm(Math.tan(g),2);}
    P.seg(-6,-6*sl,6,6*sl,'sl-c4');P.dot(0,0,'sl-c3',4);
    rd(out,[['Var X ; Var Y',SL.fmt(vx,2)+' ; '+SL.fmt(vy,2)],['Cov = (σ₁² − σ₂²) sin θ cos θ',fxm(cv,2),'c3'],['ρ',fxm(rho,2)],['pente du grand axe ; de la régression',maj+' ; '+fxm(sl,2)]]);
  }
  SL.slider(ctl,{label:'σ₁ (axe 1)',min:0.5,max:2.5,step:0.1,value:2,fmt:x=>SL.fmt(x,1)},x=>{st.s1=x;draw();});
  SL.slider(ctl,{label:'σ₂ (axe 2)',min:0.5,max:2.5,step:0.1,value:1,fmt:x=>SL.fmt(x,1)},x=>{st.s2=x;draw();});
  SL.slider(ctl,{label:'angle θ',min:-90,max:90,step:5,value:45,fmt:x=>fxm(x,0)+'°'},x=>{st.th=x;draw();});
})();
