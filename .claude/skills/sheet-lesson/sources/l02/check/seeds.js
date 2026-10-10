// find seeds for the JS rng (same as KIT/helpers.js) used in the vignettes
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
// v4: room of 60 birthdays; first 23 should contain exactly one shared pair
function room(seed){const r=rng(seed);return Array.from({length:60},()=>Math.floor(365*r()));}
function pairs(days,n){let k=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(days[i]===days[j])k++;return k;}
for(let s=1;s<40;s++){const d=room(s);console.log('v4 seed',s,'n=23 pairs',pairs(d,23),'n=10',pairs(d,10),'n=40',pairs(d,40),'n=60',pairs(d,60));}
