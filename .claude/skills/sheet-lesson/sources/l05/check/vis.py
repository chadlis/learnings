import math, numpy as np
from scipy import stats
# v1 readouts
for n,p in [(1000,1e-3),(10000,0.002)]:
    lam=n*p; sd=math.sqrt(n*p*(1-p)); k=np.arange(0,80)
    b=stats.binom.pmf(k,n,p); po=stats.poisson.pmf(k,lam); nd=stats.norm.pdf(k,lam,sd)
    print(n,p,"lam",lam,"normal<0 %.3g%%"%(100*stats.norm.cdf(0,lam,sd)),"max|pois-bin| %.2g"%np.abs(po-b).max(),"max|norm-bin| %.3g"%np.abs(nd-b).max(), "peak pmf",b.max(),"norm peak",stats.norm.pdf(lam,lam,sd))
# bathtub
eta1,k1,h0,eta3,k3=1000,0.5,0.5e-3,3000,5
h1=lambda t:(k1/eta1)*(t/eta1)**(k1-1)
h3=lambda t:(k3/eta3)*(t/eta3)**(k3-1)
H=lambda t:(t/eta1)**k1+h0*t+(t/eta3)**k3
for t in [10,100,500,1000,1200,1500,2000,2500,3000,3500,4000]:
    tot=h1(t)+h0+h3(t); P100=1-math.exp(-(H(t+100)-H(t)))
    print(f"t={t}: h1={1000*h1(t):.3f} h0=0.5 h3={1000*h3(t):.3f} total={1000*tot:.3f} per1000h  P(fail next100|alive)={P100:.4f}")
P0=1-math.exp(-H(100)); print("P(fail in first 100h)",P0)
ts=np.linspace(50,4000,79001); tot=np.array([h1(t)+h0+h3(t) for t in ts]); i=tot.argmin(); print("min total",1000*tot[i],"at",ts[i])
print("constant lambda=1/1000: P(next 100h)",1-math.exp(-0.1),"P(next 1h)",1-math.exp(-0.001),"lambda*1min",0.001/60)
print("normal(1000,200) hazard at 1000 per h", stats.norm.pdf(1000,1000,200)/stats.norm.sf(1000,1000,200))
print("Poisson(20) P(N>20)",stats.poisson.sf(20,20),"P(N<=31)",stats.poisson.cdf(31,20),"P(N<=30)",stats.poisson.cdf(30,20))
print("Bin(10,0.4) var",10*.4*.6,"Poisson(4) P(X>10)",stats.poisson.sf(10,4))
print("gamma(10,5) peak", stats.gamma.pdf(1.8,a=10,scale=0.2), "Exp(5/10) at 0", 0.5)
print("gamma(3,1/15) peak f(30)", stats.gamma.pdf(30,a=3,scale=15), "frac parallel <5", 1-math.exp(-1))
