import numpy as np, math
from math import exp, cosh, sqrt
# ---------- n1 : the die, M(t), Taylor partial sums
x=np.arange(1,7); p=np.ones(6)/6
M=lambda t:(p*np.exp(t*x)).sum()
mom=[(p*x**k).sum() for k in range(0,11)]
print('die moments', [round(m,3) for m in mom[:7]])
for t in (0.5,-0.5,0.25):
    print('M(%g)=%.4f'%(t,M(t)), 'contrib', np.round(p*np.exp(t*x),3), 'share of 6: %.3f'%((p[-1]*exp(6*t))/M(t)))
for t in (0.5,-0.5):
    for K in range(0,11):
        s=sum(mom[k]*t**k/math.factorial(k) for k in range(K+1))
        print(' t=%g K=%d taylor=%.4f gap=%.4f'%(t,K,s,M(t)-s))
# ---------- fig1 : four laws mean 0 var 1
laws={'pm1':lambda t:cosh(t),'three':lambda t:0.5+0.5*cosh(sqrt(2)*t),'normal':lambda t:exp(t*t/2),'cexp':lambda t:exp(-t)/(1-t) if t<1 else float('inf')}
# check mean/var of three-point & cexp
v=np.array([-sqrt(2),0,sqrt(2)]);q=np.array([.25,.5,.25]);print('three mean,var,m4',(v*q).sum(),(v**2*q).sum(),(v**4*q).sum())
for t in (0.25,0.5,0.8,1.0,1.5,2.0):
    print('t=%g'%t, {k:round(f(t),4) for k,f in laws.items()}, 'parab', round(1+t*t/2,4))
# centered exp moments: X=E-1, E~Exp(1): m2=1,m3=2,m4=9
import scipy.stats as st
E=st.expon(); print('cexp moments', [E.expect(lambda y:(y-1)**k) for k in (1,2,3,4)])
# ---------- lognormal sisters
y=np.linspace(-12,16,400001); dy=y[1]-y[0]; phi=np.exp(-y*y/2)/sqrt(2*math.pi)
for a in (0,0.5,1):
    print('a=%g'%a,[round(((np.exp(k*y)*(1+a*np.sin(2*np.pi*y))*phi).sum()*dy),4) for k in range(5)])
print('e^{k^2/2}',[round(exp(k*k/2),4) for k in range(5)])
# lognormal MGF infinite for t>0: integrand e^{t e^y} phi(y) diverges
# ---------- n2 : coin, Poisson
pp=0.3; print('coin p=.3 var', pp*(1-pp))
for lam in (2,3):
    m1=lam;m2=lam**2+lam;m3=lam**3+3*lam**2+lam;m4=lam**4+6*lam**3+7*lam**2+lam
    pk=st.poisson(lam); print('lam',lam,'exact moments',[pk.moment(k) for k in (1,2,3,4)],'formula',m1,m2,m3,m4,
      'skew',pk.stats(moments='s'),1/sqrt(lam),'kurt(excess)',pk.stats(moments='k'),1/lam)
# exponential derivatives
lam=2; Me=lambda t:lam/(lam-t); h=1e-4
print('exp M1',(Me(h)-Me(-h))/(2*h),1/lam,'M2',(Me(h)-2*Me(0)+Me(-h))/h**2,2/lam**2)
# ---------- n3 : three MGFs, tilting
lam=2;t=0.5;print('Poisson lam=2 M(.5)=',exp(lam*(exp(t)-1)),'tilted lam',lam*exp(t))
print('normal M(1)=',exp(.5),'M(.5)',exp(.125))
print('exp lam=1 M(.5)=',1/(1-.5),'M(.9)',1/(1-.9))
# tilt identity check Poisson
k=np.arange(0,60);P=st.poisson.pmf(k,lam)
print('tilt check', np.allclose(np.exp(t*k)*P, exp(lam*(exp(t)-1))*st.poisson.pmf(k,lam*exp(t))))
