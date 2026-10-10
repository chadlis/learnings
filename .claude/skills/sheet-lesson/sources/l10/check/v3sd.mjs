function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
for(const n of [1,4,16]){
  const out=[];
  for(let seed=31;seed<40;seed++){const r=rng(seed);const xs=[];for(let k=0;k<100;k++){let s=0;for(let i=0;i<n;i++)s+=1+Math.floor(6*r());xs.push(s/n);}
    const m=xs.reduce((a,b)=>a+b)/100,sd=Math.sqrt(xs.reduce((a,b)=>a+(b-m)**2,0)/99);out.push(sd.toFixed(3));}
  console.log('n',n,'theory',(Math.sqrt(35/12/n)).toFixed(3),out.join(' '));
}
// big check of the generator: 1e6 dice, mean and var
const r=rng(31);let s=0,s2=0;for(let i=0;i<1e6;i++){const d=1+Math.floor(6*r());s+=d;s2+=d*d;}console.log('1e6 dice mean',s/1e6,'var',s2/1e6-(s/1e6)**2);
