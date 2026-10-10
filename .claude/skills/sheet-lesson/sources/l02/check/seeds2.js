function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const r0=rng(5),bad=new Set();while(bad.size<5)bad.add(Math.floor(100*r0()));
console.log('bad',[...bad]);
function sample(r){const s=new Set();while(s.size<10)s.add(Math.floor(100*r()));return s;}
for(let sd=1;sd<12;sd++){const s=sample(rng(sd));let k=0;s.forEach(i=>{if(bad.has(i))k++;});console.log('v5 seed',sd,'k',k);}
// v2 initial: 100 darts with rng(1) in each mode: fraction in A
const X0=20,Y0=20,W=520,H=260,RD=Math.sqrt(0.2*W*H/Math.PI);
for(const [a,t] of [[0.5,'c'],[0.7,'c'],[0.2,'d']]){const r=rng(1);let n=0;for(let i=0;i<100;i++){const x=X0+r()*W,y=Y0+r()*H;const ins=t==='d'?Math.hypot(x-(X0+W/2),y-(Y0+H/2))<RD:x<X0+a*W;if(ins)n++;}console.log('v2 mode',a,'in A of 100:',n);}
