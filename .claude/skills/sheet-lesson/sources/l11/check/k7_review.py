"""numbers proposed by the fresh-context review"""
import numpy as np
from scipy.stats import norm, binom
sig = np.sqrt(35/12)
print('P(S100>=380) normal no cc', norm.sf(30/(10*sig)), ' cc', norm.sf(29.5/(10*sig)))
print('P(S100>=450) normal no cc', norm.sf(100/(10*sig)), ' cc', norm.sf(99.5/(10*sig)))
print('true SE rho=.05 n=1000: %.6f' % (sig*np.sqrt(0.05+0.95/1000)))
print('100/sqrt(30)=%.4f  x1.96=%.4f   1.96*18.3=%.3f' % (100/np.sqrt(30), 1.96*100/np.sqrt(30), 1.96*18.3))
for n in (1000, 10000):
    true = sig*np.sqrt(0.05+0.95/n); cl = sig/np.sqrt(n)
    print('n', n, 'coverage of claimed CI', 2*norm.cdf(1.96*cl/true)-1, 'claimed', cl, 'true', true)
# poll coverage n=1000 p=.52 Wald
z = norm.ppf(.975); k = np.arange(1001); ph = k/1000; se = np.sqrt(ph*(1-ph)/1000)
print('poll Wald coverage', binom.pmf(k,1000,.52)[(ph-z*se<=.52)&(.52<=ph+z*se)].sum())
# Figure 4 grid replication: min/max for Wald np>=10 and Wilson np>=1
Z = 1.959963984540054
def cov(n, p, kind):
    k = np.arange(n+1); f = k/n
    if kind == 0:
        h = Z*np.sqrt(f*(1-f)/n); lo, hi = f-h, f+h
    else:
        c = (f+Z*Z/(2*n))/(1+Z*Z/n); h = Z/(1+Z*Z/n)*np.sqrt(f*(1-f)/n+Z*Z/(4*n*n)); lo, hi = c-h, c+h
    return binom.pmf(k, n, p)[(lo <= p) & (p <= hi)].sum()
L0, L1 = np.log10(0.002), np.log10(0.5)
PS = 10**(L0 + (L1-L0)*np.arange(321)/320)
for kind, thr in ((0, 10), (1, 1), (1, 10)):
    vals = [cov(n, p, kind) for n in (30, 100, 1000) for p in PS if n*p >= thr]
    print('kind', kind, 'np >=', thr, 'min %.4f max %.4f' % (min(vals), max(vals)))
