// replicate the page's rng/gauss to pick seeds whose initial state sits close to theory
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function gauss(r){let u=0;while(u===0)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r());}
// v2: gaussian law k=0, r=rng(seed+0), 800 points; band [0,0.5)
let best=[];
for(let seed=1;seed<60;seed++){const r=rng(seed);let k=0,k2=0;const n=800;for(let i=0;i<n;i++){const x=gauss(r),y=gauss(r);if(x>=0&&x<0.5)k++;if(x>=1.5&&x<2)k2++;}
  best.push([Math.abs(k/n-0.1915)+Math.abs(k2/n-0.0441),seed,k/n,k2/n]);}
best.sort((a,b)=>a[0]-b[0]);console.log('v2',best.slice(0,4));
// v2 square (seed+100) and disk (seed+200): check closeness too for the best seeds
// v3: seed, 3000 points, band |x-1.5|<0.15
best=[];
for(let seed=1;seed<80;seed++){const r=rng(seed);let nb=0,m=0,q=0;for(let i=0;i<3000;i++){const x=gauss(r),y=0.8*x+0.6*gauss(r);if(Math.abs(x-1.5)<0.15){nb++;m+=y;q+=y*y;}}
  const mb=m/nb,sb=Math.sqrt(q/nb-mb*mb);best.push([Math.abs(mb-1.19)+Math.abs(sb-0.604),seed,nb,mb,sb]);}
best.sort((a,b)=>a[0]-b[0]);console.log('v3',best.slice(0,4));
// v4: centre (seed+0) and ring (seed+50); 400 darts; share r<1 before and after shuffle
best=[];
for(let seed=1;seed<80;seed++){let err=0,info=[];for(const mode of [0,1]){const r=rng(seed+50*mode),X=[],Y=[];
  for(let i=0;i<400;i++){if(mode===0){X.push(gauss(r));Y.push(gauss(r));}else{const R=2+0.2*gauss(r),t=2*Math.PI*r();X.push(R*Math.cos(t));Y.push(R*Math.sin(t));}}
  const p=[...Array(400).keys()];for(let i=399;i>0;i--){const j=Math.floor(r()*(i+1));[p[i],p[j]]=[p[j],p[i]];}
  let b=0,a=0;for(let i=0;i<400;i++){if(X[i]**2+Y[i]**2<1)b++;if(X[i]**2+Y[p[i]]**2<1)a++;}
  if(mode===0)err+=Math.abs(b/400-0.393)+Math.abs(a/400-0.393);else err+=Math.abs(a/400-0.087);info.push([b/400,a/400]);}
  best.push([err,seed,JSON.stringify(info)]);}
best.sort((a,b)=>a[0]-b[0]);console.log('v4',best.slice(0,4));
// v6: seed, 1000 darts; ring [1,1.25) share and [0,0.25)
best=[];
for(let seed=1;seed<80;seed++){const r=rng(seed);let k=0,k0=0;for(let i=0;i<1000;i++){const x=gauss(r),y=gauss(r),R=Math.hypot(x,y);if(R>=1&&R<1.25)k++;if(R<0.25)k0++;}
  best.push([Math.abs(k/1000-0.1487)+Math.abs(k0/1000-0.0308),seed,k/1000,k0/1000]);}
best.sort((a,b)=>a[0]-b[0]);console.log('v6',best.slice(0,4));
