function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function gauss(r){let u=0;while(u===0)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r());}
const expo=(r,l)=>-Math.log(1-r())/l;
const out=[];
// v2
let c2=[];for(let seed=1;seed<400;seed++){const r=rng(seed);let k=0,s=0,mx=0;for(let i=0;i<20;i++){let x=1;while(r()>=1/6)x++;s+=x;if(x>=10)k++;mx=Math.max(mx,x);}
  if(k===4&&Math.abs(s/20-6)<0.15&&mx<=30)c2.push([seed,k,s/20,mx]);}
console.log('v2',c2.slice(0,8));
// v3
function v3(seed,lam,ts){const r=rng(seed),L=[];for(let i=0;i<400;i++)L.push(expo(r,lam));return ts.map(t=>L.filter(d=>d>t).length);}
let c3a=[],c3b=[];
for(let seed=1;seed<300;seed++){const a=v3(seed,1/100,[50,100,200]);if(Math.abs(a[0]-242.6)<=2&&Math.abs(a[1]-147.2)<=3&&Math.abs(a[2]-54.1)<=3)c3a.push([seed,a]);
  const b=v3(seed,Math.LN2/138,[138,276,365,917]);if(Math.abs(b[0]-200)<=2&&Math.abs(b[1]-100)<=3&&Math.abs(b[2]-64)<=3&&Math.abs(b[3]-4)<=1)c3b.push([seed,b]);}
console.log('v3 bulbs',c3a.slice(0,6));console.log('v3 polonium',c3b.slice(0,6));
// v4 seed 41 and alternatives
function v4(seed){const r=rng(seed),E=[],W=[];for(let i=0;i<2000;i++){E.push(expo(r,1/1000));W.push(1000+200*gauss(r));}
  const f=(L,s)=>{const R=L.filter(x=>x>s).map(x=>x-s);return [R.length/2000,R.reduce((a,b)=>a+b,0)/R.length];};return [f(E,1000),f(W,1000),f(E,0)];}
console.log('v4 seed41',JSON.stringify(v4(41)));
let c4=[];for(let seed=1;seed<300;seed++){const v=v4(seed);if(Math.abs(v[0][0]-0.3679)<0.005&&Math.abs(v[0][1]-1000)<15&&Math.abs(v[1][0]-0.5)<0.01&&Math.abs(v[1][1]-159.6)<4&&Math.abs(v[2][1]-1000)<15)c4.push([seed,JSON.stringify(v)]);}
console.log('v4',c4.slice(0,5));
// v6
function v6(seed){const r=rng(seed),a=[];let s=0;for(;;){s+=expo(r,5);if(s>60)break;a.push(s);}
  const w=a.map((x,i)=>60*(x-(i?a[i-1]:0)));const mw=w.reduce((p,q)=>p+q,0)/w.length;
  const cnt=new Array(120).fill(0);a.forEach(x=>{const j=Math.floor(x/0.5);if(j<120)cnt[j]++;});const mc=cnt.reduce((p,q)=>p+q,0)/120,vc=cnt.reduce((p,q)=>p+(q-mc)**2,0)/120;
  const g=[a[0],a[1]-a[0],a[2]-a[1]];return {n:a.length,mw,mc,vc,g};}
let c6=[];for(let seed=1;seed<3000;seed++){const v=v6(seed);if(Math.abs(v.n-300)<=6&&Math.abs(v.mw-12)<0.4&&v.g.every(x=>x>=0.15)&&Math.abs(v.vc-2.5)<0.25)c6.push([seed,v.n,v.mw.toFixed(2),v.mc.toFixed(2),v.vc.toFixed(2),v.g.map(x=>x.toFixed(2)).join('/')]);}
console.log('v6',c6.slice(0,8));
// v7
function v7(seed,mode){const r=rng(seed),v=[];for(let i=0;i<200;i++){const w=[expo(r,1/15),expo(r,1/15),expo(r,1/15)];v.push(mode?Math.min(...w):w[0]+w[1]+w[2]);}
  const m=v.reduce((a,b)=>a+b,0)/200,sd=Math.sqrt(v.reduce((a,b)=>a+(b-m)**2,0)/200);return [m.toFixed(2),sd.toFixed(2)];}
console.log('v7 seed3',v7(3,0),v7(3,1));
let c7=[];for(let seed=1;seed<500;seed++){const a=v7(seed,0),b=v7(seed,1);if(Math.abs(a[0]-45)<1&&Math.abs(a[1]-26)<1.2&&Math.abs(b[0]-5)<0.2&&Math.abs(b[1]-5)<0.3)c7.push([seed,a,b]);}
console.log('v7',c7.slice(0,5));
