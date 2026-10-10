// review checks with the page's rng: v2 seed 84 for the three laws (r = rng(seed + 100 k), 800 points)
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function gauss(r){let u=0;while(u===0)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r());}
const LAW=[r=>[gauss(r),gauss(r)],r=>[-2+4*r(),-2+4*r()],r=>{for(;;){const x=-2+4*r(),y=-2+4*r();if(x*x+y*y<4)return [x,y];}}];
for(const seed of [51,84,1860,3163]){
  for(let k=0;k<3;k++){const r=rng(seed+100*k);const c=new Array(14).fill(0);
    for(let i=0;i<800;i++){const p=LAW[k](r);const j=Math.floor((p[0]+3.5)/0.5);if(j>=0&&j<14)c[j]++;}
    console.log('seed',seed,'law',k,'bins -3.5..3.5 (%):',c.map(v=>(100*v/800).toFixed(1)).join(' '),'| [0,0.5]',(100*c[7]/800).toFixed(1),'[1.5,2]',(100*c[10]/800).toFixed(1));}
}
