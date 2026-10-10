import math, numpy as np
from scipy import stats
lam=1/15
print("series Gamma(3,1/15): mean",3/lam,"var",3/lam**2,"sd",math.sqrt(3)/lam)
print("P(T3>45)=P(Pois(3)<=2)",stats.poisson.cdf(2,3), "gamma sf", stats.gamma.sf(45,a=3,scale=15), "e^-3*(1+3+4.5)", math.exp(-3)*8.5)
print("parallel min of 3 Exp(1/15): rate",3*lam,"mean",1/(3*lam), "P(min>5)",math.exp(-3*lam*5), "P(min>15)", math.exp(-3))
print("median series", stats.gamma.median(a=3,scale=15), "mode (r-1)/lam", 2/lam)
r=np.random.default_rng(0); W=r.exponential(15,(400_000,3))
print("sim series mean",W.sum(1).mean(),"sd",W.sum(1).std(),"parallel mean",W.min(1).mean(), "P(series>45)", (W.sum(1)>45).mean())
print("total with own service 5+15 =",20)
# 10th email at 5/min
L=5; rr=10
print("Gamma(10,5) mean",rr/L,"sd",math.sqrt(rr)/L,"10W mean",rr/L,"sd",rr/L)
print("P(T10>3 min) gamma",stats.gamma.sf(3,a=10,scale=1/L),"10W",math.exp(-3/2), "P(T10<1)", stats.gamma.cdf(1,a=10,scale=1/L), "10W P(<1)", 1-math.exp(-0.5))
# LLM batching r=8, lambda=20/s
print("batch r=8 l=20: mean",8/20,"sd",math.sqrt(8)/20,"P(fill within .5s)=P(Pois(10)>=8)",stats.poisson.sf(7,10), "gamma cdf",stats.gamma.cdf(0.5,a=8,scale=1/20))
print("P(fill within .25s) = P(Pois(5)>=8)", stats.poisson.sf(7,5))
# derivative check of survival sum
def S(t,r,l): return sum(math.exp(-l*t)*(l*t)**k/math.factorial(k) for k in range(r))
def f(t,r,l): return l*math.exp(-l*t)*(l*t)**(r-1)/math.factorial(r-1)
for r_ in [1,2,3,5]:
    t=0.7; h=1e-6; print(r_, -(S(t+h,r_,2)-S(t-h,r_,2))/(2*h), f(t,r_,2), stats.gamma.pdf(t,a=r_,scale=0.5))
# Christmas lights: 3 bulbs mean 1000 h: first failure mean 333 h; last failure (max) mean 1000*(1+1/2+1/3)
print("first failure mean",1000/3,"last failure mean",1000*(1+1/2+1/3))
