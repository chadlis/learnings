# Verify every number of lesson l04
from math import comb, sqrt, pi, exp, erf, log
from scipy.stats import norm, binom
import numpy as np
P = lambda *a: print(*a)
Phi = norm.cdf
P("== n1: 4 coins")
P([comb(4,k) for k in range(5)], [comb(4,k)/16 for k in range(5)], sum(comb(4,k) for k in range(5)))
seq=[2,5,1,4,3,6,2,3,5,1]; P("dice seq sum", sum(seq), "mean", sum(seq)/10)
P("2^100 =", 2**100, f"{2**100:.3e}")
P("== n2: heights N(1.75, 0.07)")
mu,s=1.75,0.07
P("f(mu) per m", 1/(s*sqrt(2*pi)), "per cm", 1/(7*sqrt(2*pi)))
for w in (0.10,0.05,0.02,0.01,0.001):
    pr = Phi((w/2)/s)-Phi(-(w/2)/s); P(f"width {w}: P={pr:.5f}  P/w={pr/w:.4f}")
P("4 coins P(X<=2)", (1+4+6)/16, "P(X<2)", 5/16)
P("F(1.75)", Phi(0))
# likelihood example 1.82 under mu=1.75 vs 1.70
f=lambda x,m,s: exp(-(x-m)**2/(2*s*s))/(s*sqrt(2*pi))
P("f(1.82;1.75)", f(1.82,1.75,0.07), "f(1.82;1.70)", f(1.82,1.70,0.07), "ratio", f(1.82,1.75,0.07)/f(1.82,1.70,0.07))
P("P(1.70<X<=1.80)", Phi(0.05/0.07)-Phi(-0.05/0.07))
P("P(1.80<X<=1.90)", Phi(0.15/0.07)-Phi(0.05/0.07))
P("P(X<=1.80)", Phi(0.05/0.07))
P("P(X>1.89)", 1-Phi(2))
P("== n3 Bernoulli")
P("die six p", 1/6, "q", 5/6, "var", (1/6)*(5/6))
P("== n4 binomial")
p=1/6; q=5/6
P("n=2 die: q2 2pq p2", q*q, 2*p*q, p*p, 25/36, 10/36, 1/36)
P("n=3 die: ", [comb(3,k)*p**k*q**(3-k) for k in range(4)])
P("three 6 in 12:", comb(12,3), comb(12,3)*p**3*q**9, "q^9", q**9)
P("ten 6 in 100:", comb(100,10)*p**10*q**90)
P("E,Var 12 dice", 12*p, 12*p*q)
P("ML 1000, 0.87: E", 1000*0.87, "sd", sqrt(1000*0.87*0.13), "SE", sqrt(.87*.13/1000), sqrt(.872*.128/1000))
P("== n5 normal limit")
def maxerr(n,p):
    k=np.arange(n+1); pm=binom.pmf(k,n,p); mu=n*p; sg=sqrt(n*p*(1-p)); fk=norm.pdf(k,mu,sg)
    return np.max(np.abs(pm-fk)), pm.max(), fk.max(), mu, sg
for n,p in ((100,.5),(30,.5),(10,.5),(5,.5),(30,.02),(30,.35)):
    e,pk,fk,mu,sg=maxerr(n,p); P(f"n={n} p={p}: mu={mu} sg={sg:.4f} maxerr={e:.5f} peakbin={pk:.4f} peakf={fk:.4f}")
mu,sg=0.6,sqrt(30*.02*.98); P("p=.02: sg", sg, "mass<0", Phi(-mu/sg), "mass<-0.5", Phi((-0.5-mu)/sg), "P(X=0)", .98**30)
P("binom(100,.5) P(X=50)", binom.pmf(50,100,.5), "f(50)", norm.pdf(50,50,5))
P("tails n=100: P(X>=70) exact", binom.sf(69,100,.5), "normal cc", norm.sf(69.5,50,5), "naive", norm.sf(70,50,5))
P("tails n=100: P(X>=60) exact", binom.sf(59,100,.5), "normal cc", norm.sf(59.5,50,5))
P("== n6")
for k in (1,2,3,1.96): P(f"k={k}: Phi={Phi(k):.5f} tail={1-Phi(k):.5f} band={2*Phi(k)-1:.5f}")
P("phi(0)", norm.pdf(0), "Phi(0)", Phi(0))
P("outside 3 sigma 1 in", 1/(1-(2*Phi(3)-1)))
P("CI 0.872 +- 1.96*SE", 0.872-1.96*sqrt(.872*.128/1000), 0.872+1.96*sqrt(.872*.128/1000), 1.96*sqrt(.872*.128/1000))
P("Phi(1.96)", Phi(1.96), "z95", norm.ppf(.975))
P("== n7 400 coins")
n,p=400,.5; mu,sg=200,10
P("terms", len(range(190,231)))
ex = binom.cdf(230,n,p)-binom.cdf(189,n,p); P("exact", ex)
P("naive", Phi(3)-Phi(-1), "cc", Phi(3.05)-Phi(-1.05))
P("P(X=190)", binom.pmf(190,n,p), "P(X=230)", binom.pmf(230,n,p), "half sum", (binom.pmf(190,n,p)+binom.pmf(230,n,p))/2)
P("P(X=200)", binom.pmf(200,n,p), "f(200)", norm.pdf(200,200,10), "cc", Phi(.05)-Phi(-.05))
P("P(X=15) 400", binom.pmf(15,400,.5))
P("10 coins P(X<=3) exact", binom.cdf(3,10,.5), 176/1024, "naive", Phi((3-5)/sqrt(2.5)), "cc", Phi((3.5-5)/sqrt(2.5)))
P("ML P(X<=850 | 1000, .87) exact", binom.cdf(850,1000,.87), "cc", Phi((850.5-870)/sqrt(1000*.87*.13)), "naive", Phi((850-870)/sqrt(1000*.87*.13)), "z", (850.5-870)/sqrt(1000*.87*.13))
P("strict 190<X<230: exact", binom.cdf(229,n,p)-binom.cdf(190,n,p), "cc", Phi(2.95)-Phi(-0.95))
P("P(X>=220) exact", binom.sf(219,n,p), "cc", norm.sf(219.5,200,10), "naive", norm.sf(220,200,10))
