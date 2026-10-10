import math, numpy as np
from scipy import stats
lam=5
for t in [0.05,0.1,0.2,1/3,0.5,1,2,20]:
    p0=math.exp(-lam*t); p1=lam*t*math.exp(-lam*t); b=5*math.exp(-5*t)
    print(f"t={t:.3f} P0={p0:.4g} P1={p1:.4g} ratio={p1/p0:.3g} brunton5e^-5t={b:.4g} P2={(lam*t)**2/2*p0:.4g}")
print("brunton >1 for t <", math.log(5)/5, "min =", 60*math.log(5)/5, "s")
print("20 min: e^-100", math.exp(-100), "count Poisson(100)")
print("mean gap 5/min in s", 60/5)
# LLM API lambda=20/s
L=20
print("gap mean ms",1000/L,"P(gap<10ms)",1-math.exp(-L*0.01),"P(gap>100ms)",math.exp(-L*0.1))
print("100ms window Poisson(2): P0",stats.poisson.pmf(0,2),"P>=5",stats.poisson.sf(4,2), "P>=6", stats.poisson.sf(5,2))
for c in [25,28,29,30,31,32]: print("per second P(N>",c,")",stats.poisson.sf(c,L))
print("q99",stats.poisson.ppf(0.99,L),"q999",stats.poisson.ppf(0.999,L), "q95", stats.poisson.ppf(0.95,L))
print("normal approx 20+2.33*sqrt20", 20+2.326*math.sqrt(20))
# per minute
print("per minute mean 1200 sd", math.sqrt(1200))
# simulation: counts per window from exp gaps
r=np.random.default_rng(0); T=np.cumsum(r.exponential(1/lam, 600_000))
H=int(T[-1])-1; c=np.histogram(T[T<H],bins=np.arange(0,H+1e-9,1.0))[0]
print("counts per 1-min window mean",c.mean(),"var",c.var(),"P0",(c==0).mean(),"theory",math.exp(-5))
