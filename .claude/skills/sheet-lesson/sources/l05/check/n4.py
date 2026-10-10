import math, numpy as np
from scipy import stats, integrate
print("bulb mean 1000h survivors at 1000:",math.exp(-1),"at 2000:",math.exp(-2), "at 500", math.exp(-0.5))
print("spams P(T>45|T>15)",math.exp(-3)/math.exp(-1),"P(T>30)",math.exp(-2))
# wear: normal(1000,200)
mu,sd=1000,200
def mrl(s):
    S=stats.norm.sf(s,mu,sd)
    num=integrate.quad(lambda t: stats.norm.sf(t,mu,sd), s, mu+12*sd)[0]
    return num/S, S
for s in [0,500,800,1000,1200,1500]:
    m,S=mrl(s); print("normal wear s=",s,"survive",round(S,4),"mean residual",round(m,1))
print("closed form at s=mu: sd*phi(0)/0.5 =", sd*stats.norm.pdf(0)/0.5)
# simulation check exponential mean residual
r=np.random.default_rng(1); T=r.exponential(1000,400_000)
for s in [0,1000,2000]: R=T[T>s]-s; print("exp sim s",s,"frac",round((T>s).mean(),4),"mean resid",round(R.mean(),1))
# bus paradox lambda=6/h: mean gap 10 min
lam=6/60
arr=np.cumsum(r.exponential(1/lam,200_000)); u=r.uniform(0,arr[-1]*0.99,200_000)
idx=np.searchsorted(arr,u); wait=arr[idx]-u; prev=np.where(idx>0,arr[idx-1],0); gap=arr[idx]-prev
print("bus: mean wait",wait.mean(),"mean gap containing",gap[idx>0].mean(),"mean gap overall",np.diff(arr).mean())
