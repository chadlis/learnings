/* ===== l01 : outils propres à la leçon ===== */
const NB=' ';
/* entier groupé par trois, ou mantisse × 10^e au-delà du milliard (HTML : pour rd) */
function big(x){if(x<1e9)return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g,NB);
  let e=Math.floor(Math.log10(x)),m=x/Math.pow(10,e);if(m>=9.995){m/=10;e++;}return SL.fmt(m,2)+' × 10<sup>'+e+'</sup>';}
function txt(parent,x,y,s,cls,anchor){const t=SL.el('text',{x:(+x).toFixed(1),y:(+y).toFixed(1),'text-anchor':anchor||'middle',class:cls||'sl-lbl'},parent);t.textContent=s;return t;}
