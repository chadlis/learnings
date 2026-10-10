// Same generator as KIT/helpers.js, to choose seeds whose initial state is typical.
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function gauss(r){let u=0;while(u===0)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r());}
// fig3: final sum deviation after 1000 dice, and max |mean-3.5| after n=100
console.log('fig3 seeds (seed, S-3500, |mean-3.5| at end)');
for(let seed=1;seed<=20;seed++){const r=rng(seed);let s=0;for(let i=1;i<=1000;i++)s+=1+Math.floor(6*r());console.log(seed,(s-3500).toFixed(0),Math.abs(s/1000-3.5).toFixed(3));}
// v7: estimate of pi after 1000 darts
const q=Math.PI/4,se=4*Math.sqrt(q*(1-q)/1000);
console.log('v7 seeds (seed, est after 1000, z, est after 5000, z5000)');
for(let seed=1;seed<=20;seed++){const r=rng(seed);let k=0,e1=0;for(let n=1;n<=5000;n++){const x=r(),y=r();if(x*x+y*y<=1)k++;if(n===1000)e1=4*k/n;}
  console.log(seed,e1.toFixed(4),((e1-Math.PI)/se).toFixed(2),(4*k/5000).toFixed(4),((4*k/5000-Math.PI)/(se/Math.sqrt(5))).toFixed(2));}
// v4: mean of 30 and 300 gaussian measurements (sd 100), seeds 7..
console.log('v4 seeds (seed, mean30, mean300)');
for(let seed=1;seed<=12;seed++){const r=rng(seed);let s=0,m30=0;for(let i=1;i<=300;i++){s+=100*gauss(r);if(i===30)m30=s/30;}console.log(seed,m30.toFixed(1),(s/300).toFixed(1));}
// v4 Cauchy: seeds+1000, running mean range
console.log('v4 cauchy (seed, mean30, mean300, max|x| first 300)');
for(let seed=1;seed<=12;seed++){const r=rng(seed+1000);let s=0,m30=0,mx=0;for(let i=1;i<=300;i++){const x=50*Math.tan(Math.PI*(r()-0.5));mx=Math.max(mx,Math.abs(x));s+=x;if(i===30)m30=s/30;}console.log(seed,m30.toFixed(1),(s/300).toFixed(1),mx.toFixed(0));}
