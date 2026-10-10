"""misc numbers used in n2, n4, n5 and in figure captions."""
import numpy as np
from scipy.stats import norm, binom, lognorm, skew
s = 1.79
g = (np.exp(s*s) + 2) * np.sqrt(np.exp(s*s) - 1)
print('lognormal sigma 1.79 skew', g, ' n for skew of mean 0.2:', (g / 0.2)**2, ' n for 0.37:', (g/0.365)**2)
print('scipy lognorm skew', lognorm(s).stats(moments='s'))
# exp skew 2/sqrt(n) equals Bernoulli(0.02) skew at n=500?
print('Bern .02 n=500 skew', 0.96/np.sqrt(500*.02*.98), ' exp n with same skew', (2/(0.96/np.sqrt(500*.02*.98)))**2)
# dependence: coverage of the claimed +-1.96 sigma/sqrt(n) when rho=0.05, n=1000 (gaussian factor model)
sig = np.sqrt(35/12)
for rho, n in ((0.05, 1000), (0.05, 100), (0.01, 1000), (0.2, 100)):
    true = sig*np.sqrt(rho + (1-rho)/n); claimed = sig/np.sqrt(n)
    print(f'rho={rho} n={n} true SE={true:.4f} claimed={claimed:.4f} coverage of claimed 95% CI={2*norm.cdf(1.96*claimed/true)-1:.3f}')
# Pareto alpha 1.5: P(mean100 < 3) and median, by big simulation
rng = np.random.default_rng(5)
x = (rng.pareto(1.5, (40000, 100)) + 1).mean(axis=1)
print('pareto n=100 P(mean<3)', np.mean(x < 3).round(3), 'median', np.median(x).round(3))
# Wald / Wilson extremes for np >= 10 and Wilson for np >= 1
z = norm.ppf(.975)
def cov(n, p, kind):
    k = np.arange(n + 1); ph = k / n
    if kind == 'wald':
        se = np.sqrt(ph*(1-ph)/n); lo, hi = ph - z*se, ph + z*se
    else:
        c = (ph + z*z/(2*n))/(1 + z*z/n); h = z/(1+z*z/n)*np.sqrt(ph*(1-ph)/n + z*z/(4*n*n)); lo, hi = c-h, c+h
    return binom.pmf(k, n, p)[(lo <= p) & (p <= hi)].sum()
for n in (30, 100, 1000):
    g1 = np.linspace(10/n, 0.5, 1500); c = np.array([cov(n, p, 'wald') for p in g1])
    g2 = np.linspace(1/n, 0.5, 1500); w = np.array([cov(n, p, 'wilson') for p in g2])
    w10 = np.array([cov(n, p, 'wilson') for p in g1])
    print(f'n={n} Wald np>=10: min {c.min():.3f} max {c.max():.3f} mean {c.mean():.3f} | Wilson np>=1: min {w.min():.3f} max {w.max():.3f} | Wilson np>=10 min {w10.min():.3f}')
# dice IC example: xbar 3.8 on 30 rolls
h = 1.96*sig/np.sqrt(30); print('dice 30 xbar 3.8 IC', 3.8-h, 3.8+h)
# recall SE with wrong n
print('recall SE n=30', np.sqrt(28/30*2/30/30), ' n=1000', np.sqrt(28/30*2/30/1000))
# quantiles
print('z90', norm.ppf(.95), 'z99', norm.ppf(.995))
