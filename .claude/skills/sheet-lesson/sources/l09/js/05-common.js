/* ===== l09 : outils propres à la leçon ===== */
/* nombres : vrai signe moins, décimales fixes (fxf) ou zéros de fin retirés (fxm), signe explicite (fxs) */
function fxm(x,d){const s=SL.fmt(Math.abs(x),d);return (x<0&&s!=='0'?'−':'')+s;}
function fxs(x,d){const s=SL.fmt(Math.abs(x),d);return s==='0'?'0':(x<0?'−':'+')+s;}
function fxf(x,d){const s=Math.abs(x).toFixed(d);return (x<0&&parseFloat(s)!==0?'−':'')+s.replace('.',',');}
/* le dessin dynamique ne sort pas du cadre du graphe */
function clipTo(P,id){const cp=SL.el('clipPath',{id:id},P.svg);SL.el('rect',{x:44,y:16,width:P.W-58,height:P.H-50},cp);P.dyn.setAttribute('clip-path','url(#'+id+')');}
/* ellipse de demi-axes k·s1, k·s2, tournée de th (radians), centrée en (cx, cy) */
function ellipse(P,s1,s2,th,k,cls,cx,cy){cx=cx||0;cy=cy||0;const c=Math.cos(th),s=Math.sin(th);let d='';
  for(let i=0;i<=96;i++){const t=2*Math.PI*i/96,u=k*s1*Math.cos(t),v=k*s2*Math.sin(t);d+=(i?' L':'M')+P.sx(cx+u*c-v*s).toFixed(1)+' '+P.sy(cy+u*s+v*c).toFixed(1);}
  return SL.el('path',{d:d+' Z',class:cls},P.dyn);}
/* moyennes, covariance, variances (divisées par n) et corrélation d'un nuage */
function stats2(xs,ys){const n=xs.length;let mx=0,my=0;for(let i=0;i<n;i++){mx+=xs[i];my+=ys[i];}mx/=n;my/=n;
  let c=0,vx=0,vy=0;for(let i=0;i<n;i++){const a=xs[i]-mx,b=ys[i]-my;c+=a*b;vx+=a*a;vy+=b*b;}
  return {mx:mx,my:my,cov:c/n,vx:vx/n,vy:vy/n,rho:c/Math.sqrt(vx*vy)};}
/* nuage gaussien : demi-axes s1, s2, tourné de deg degrés, centré en (cx, cy), graine fixe */
function cloud(seed,s1,s2,deg,n,cx,cy){const r=rng(seed),t=deg*Math.PI/180,c=Math.cos(t),s=Math.sin(t),X=[],Y=[];
  for(let i=0;i<n;i++){const u=s1*gauss(r),v=s2*gauss(r);X.push(cx+u*c-v*s);Y.push(cy+u*s+v*c);}return {x:X,y:Y};}
