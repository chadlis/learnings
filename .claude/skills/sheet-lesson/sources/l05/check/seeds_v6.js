function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const expo=(r,l)=>-Math.log(1-r())/l;
for(const seed of [606,1413,980]){const r=rng(seed),a=[];let s=0;for(;;){s+=expo(r,5);if(s>60)break;a.push(s);}
  const w=a.map((x,i)=>60*(x-(i?a[i-1]:0)));const mw=w.reduce((p,q)=>p+q,0)/w.length;
  const out=[];for(const win of [0.5,1,2]){const nw=Math.round(60/win),c=new Array(nw).fill(0);a.forEach(x=>{const j=Math.floor(x/win);if(j<nw)c[j]++;});
    const m=c.reduce((p,q)=>p+q,0)/nw,v=c.reduce((p,q)=>p+(q-m)**2,0)/nw;out.push(win+': '+m.toFixed(2)+'/'+v.toFixed(2)+' first '+c.slice(0,8).join(','));}
  console.log(seed,'n',a.length,'meanwait',mw.toFixed(2),'W1-3 (s)',w.slice(0,3).map(x=>x.toFixed(1)).join('/'),out.join(' | '));}
