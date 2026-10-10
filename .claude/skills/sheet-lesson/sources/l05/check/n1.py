from scipy import stats
import numpy as np, math
print("--- thought experiment n=1000 p=1/1000")
n,p=1000,1/1000; lam=n*p; q=1-p
print("lam",lam,"npq",n*p*q)
print("P(N<0) var1", stats.norm.cdf(-1), "var .999", stats.norm.cdf(0,1,math.sqrt(n*p*q)))
for k in range(5): print(k, "pois",round(stats.poisson.pmf(k,1),4),"bin",round(stats.binom.pmf(k,n,p),4))
print("--- neons n=10000 p=0.002")
n,p=10000,0.002; lam=n*p
print("lam",lam,"npq",n*p*(1-p),"sd",math.sqrt(n*p*(1-p)))
for k in [0,1,5,10,20,30]: print(k, "pois %.4g"%stats.poisson.pmf(k,lam),"bin %.4g"%stats.binom.pmf(k,n,p), "norm dens %.4g"%stats.norm.pdf(k,lam,math.sqrt(n*p*(1-p))))
print("normal P(N<0)", stats.norm.cdf(0,lam,math.sqrt(n*p*(1-p))))
ks=np.arange(0,60); print("max|bin-pois| neons", np.abs(stats.binom.pmf(ks,n,p)-stats.poisson.pmf(ks,lam)).max())
ks=np.arange(0,20); print("max|bin-pois| l=1 n=1000", np.abs(stats.binom.pmf(ks,1000,0.001)-stats.poisson.pmf(ks,1)).max())
print("max|norm-pois| l=1 (density at ints)", np.abs(stats.norm.pdf(ks,1,1)-stats.poisson.pmf(ks,1)).max())
print("max|norm-pois| l=20", np.abs(stats.norm.pdf(np.arange(60),20,math.sqrt(20))-stats.poisson.pmf(np.arange(60),20)).max())
print("--- fil rouge spams lambda=4")
print("P0",stats.poisson.pmf(0,4),"P4",stats.poisson.pmf(4,4),"P>=7",stats.poisson.sf(6,4))
print("bin(1000,.004) P4",stats.binom.pmf(4,1000,0.004))
print("--- bootstrap n=1000 row counts ~ Bin(1000,1/1000)")
print("absent",(1-1/1000)**1000, "e^-1", math.exp(-1), "exactly1", stats.binom.pmf(1,1000,1/1000),"ge2",stats.binom.sf(1,1000,1/1000), "pois ge2", stats.poisson.sf(1,1))
print("--- E=Var=lambda checks")
for lam in [1,4,20]:
  print(lam, stats.poisson.mean(lam), stats.poisson.var(lam))
print("binomial var np(1-p) for neons", 10000*0.002*0.998)
print("overdispersion ratio 9/4", 9/4)
print("--- (1-l/n)^n convergence l=4")
for n in [10,100,1000,10000]: print(n,(1-4/n)**n, math.exp(-4))
print("middle fraction k=4 n=1000", np.prod([(1000-i)/1000 for i in range(4)]))
