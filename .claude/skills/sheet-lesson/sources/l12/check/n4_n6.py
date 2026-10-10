import numpy as np, math
from math import exp, cosh, sqrt
from scipy.stats import norm, poisson, binom
# ---------- n4 : reported heights model, inches
mu,sd,a,b=69,3,70.5,72
Pr=norm.cdf(b,mu,sd)-norm.cdf(a,mu,sd); print('P(70.5<=H<72)=%.5f'%Pr)
for q in (0,0.25,0.5,0.75,1):
    m=q*Pr; Fm=norm.cdf(a,mu,sd)+(1-q)*Pr; print('q=%.2f mass=%.4f F(72-)=%.4f F(72)=%.4f'%(q,m,Fm,norm.cdf(b,mu,sd)))
print('cm', 69*2.54, 3*2.54, 70.5*2.54, 72*2.54, 180/2.54)
# density of continuous part at 71 (inside the rounding zone, q=.5) and at 72+, peak at 69
q=.5
f=lambda x:norm.pdf(x,mu,sd)*((1-q) if a<=x<b else 1)
print('f(69)=%.4f f(71)=%.4f f(71.99)=%.4f f(72)=%.4f'%(f(69),f(71),f(71.99),f(72)))
# bin heights in density scale, bins centered on 72 with width w
def contmass(lo,hi):
    # continuous part mass in [lo,hi)
    s=0
    for (u,v,c) in ((-1e9,a,1),(a,b,1-q),(b,1e9,1)):
        L,H=max(lo,u),min(hi,v)
        if H>L: s+=c*(norm.cdf(H,mu,sd)-norm.cdf(L,mu,sd))
    return s
for w in (2,1,0.5,0.25,0.1):
    lo,hi=72-w/2,72+w/2
    h72=(contmass(lo,hi)+q*Pr)/w
    # max of other bins
    others=[contmass(72+k*w-w/2,72+k*w+w/2)/w for k in range(-int(15/w),int(15/w)) if k!=0]
    print('w=%.2f bar72=%.3f maxother=%.4f'%(w,h72,max(others)))
# ReLU of N(0,1): mass at 0
print('ReLU mass at 0', norm.cdf(0))
# ---------- n5
x=np.arange(1,7);M=lambda t:np.mean(np.exp(t*x))
for t in (0.2,0.3,0.5):
    print('dice t=%g Mx=%.4f Mx^2=%.4f M2X=Mx(2t)=%.4f'%(t,M(t),M(t)**2,M(2*t)))
# law of the sum of two dice through polynomial product
c=np.convolve(np.ones(6)/6,np.ones(6)/6); print('sum law *36', np.round(c*36,6), 'P(7)',c[5])
print('coins',np.convolve([.5,.5],[.5,.5]))
print('Poisson 2+3: P(0)=%.5f P(5)=%.4f'%(exp(-5),poisson.pmf(5,5)))
# 3x3 counterexample
J=np.ones((3,3))/9;e=1/18
for (i,j) in ((0,1),(1,2),(2,0)): J[i,j]+=e
for (i,j) in ((0,2),(1,0),(2,1)): J[i,j]-=e
print(J*18); print('marg',J.sum(1),J.sum(0))
S=np.zeros(5)
for i in range(3):
    for j in range(3): S[i+j]+=J[i,j]
print('sum law',S*9,'indep',np.convolve(np.ones(3)/3,np.ones(3)/3)*9)
print('P(X=0,Y=1)=',J[0,1],'vs',1/9)
# ---------- n6
for n in (1,2,5,10,30,100,1000):
    coin=cosh(1/sqrt(n))**n
    ce=(exp(-1/sqrt(n))/(1-1/sqrt(n)))**n if n>1 else float('inf')
    neps_c=n*(cosh(1/sqrt(n))-1-1/(2*n))
    neps_e=n*(exp(-1/sqrt(n))/(1-1/sqrt(n))-1-1/(2*n)) if n>1 else float('nan')
    print('n=%5d coin M_Zn(1)=%.4f cexp=%.4f  n*eps coin=%.5f cexp=%.4f  (1/(3sqrt n)=%.4f)'%(n,coin,ce,neps_c,neps_e,1/(3*sqrt(n))))
print('e^.5',exp(.5))
for n in (1,2,5,10,100):
    print('coin t=2 n=%d'%n, cosh(2/sqrt(n))**n, exp(2))
# (1+a/n)^n
for n in (1,10,100,1000): print('(1+.5/n)^n',n,(1+.5/n)**n)
# fig3 : sup |F_n - Phi| for standardized coin sum (values -n..n step 2)/sqrt n
def supgap(n):
    k=np.arange(n+1); z=(2*k-n)/sqrt(n); pk=binom.pmf(k,n,.5); F=np.cumsum(pk)
    g1=np.abs(F-norm.cdf(z)); g2=np.abs(np.concatenate([[0],F[:-1]])-norm.cdf(z))
    return max(g1.max(),g2.max())
for n in (1,2,4,10,16,25,50,100,400): print('n=%d supgap=%.4f  0.4/sqrt(n)=%.4f'%(n,supgap(n),0.3989/sqrt(n)))
