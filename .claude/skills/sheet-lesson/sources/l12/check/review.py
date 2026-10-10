import numpy as np, math, cmath
from scipy.stats import norm
mu,sd,a,b,q=69,3,70.5,72,0.5
F=lambda x:norm.cdf(x,mu,sd); zone=F(b)-F(a)
def cont(lo,hi):
    s=0
    for u,v,c in ((-1e9,a,1),(a,b,1-q),(b,1e9,1)):
        L,H=max(lo,u),min(hi,v)
        if H>L: s+=c*(F(H)-F(L))
    return s
for w in (0.5,0.25,0.1):
    ordinary=cont(72-w/2,72+w/2)/w; bar=ordinary+q*zone/w
    print(f"w={w}: bar={bar:.4f}  0.075/w={0.075/w:.3f}  ordinary part={ordinary:.4f}  0.075/w+0.06={0.075/w+0.06:.3f}")
# mutual independence counterexample
S=[(x,y,x*y) for x in (1,-1) for y in (1,-1)]
MS=np.mean([math.exp(sum(s)) for s in S]); print('M_S(1)=',MS,'cosh^3=',math.cosh(1)**3)
# pairwise independence check
import itertools
print('pairwise: P(X=1,Z=1)=',sum(1 for s in S if s[0]==1 and s[2]==1)/4)
# n6 ex3
print('t^3/(3 sqrt 10)=',1/(3*math.sqrt(10)))
# phi(t)=M(it) for N(0,1)
t=1.3; print('M(it)=',cmath.exp((1j*t)**2/2),'e^{-t^2/2}=',math.exp(-t*t/2))
# |e^{i theta}|
print(abs(cmath.exp(1j*2.7)))
# n ln(1+a_n/n) -> a
for n in (10,100,1000): an=0.5+1/math.sqrt(n); print(n, n*math.log(1+an/n), an)
