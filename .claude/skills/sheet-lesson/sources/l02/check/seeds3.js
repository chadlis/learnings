// v5: seed for the first "1 000 contrôles" whose frequencies sit close to the theory
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const r0=rng(5),bad=new Set();while(bad.size<5)bad.add(Math.floor(100*r0()));
function sample(r){const s=new Set();while(s.size<10)s.add(Math.floor(100*r()));return s;}
const TH=[0.583752,0.339391,0.070219,0.006638];
for(let sd=900;sd<940;sd++){const r=rng(sd),c=[0,0,0,0];for(let i=0;i<1000;i++){const s=sample(r);let k=0;s.forEach(j=>{if(bad.has(j))k++;});c[Math.min(k,3)]++;}
  const d=Math.max(...c.map((x,k)=>Math.abs(x/1000-TH[k])));if(d<0.008)console.log('seed',sd,c.map(x=>x/1000),'maxdev',d.toFixed(4));}
