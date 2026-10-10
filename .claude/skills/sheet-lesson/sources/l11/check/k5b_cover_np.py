"""Figure 5: Wald coverage as function of np for n = 30, 100, 1000: do curves align on np?"""
import numpy as np
from scipy.stats import binom, norm
z = 1.959963984540054
def cov(n, p, kind):
    k = np.arange(n + 1); ph = k / n
    if kind == 'wald':
        se = np.sqrt(ph * (1 - ph) / n); lo, hi = ph - z * se, ph + z * se
    else:
        c = (ph + z*z/(2*n)) / (1 + z*z/n); h = z/(1+z*z/n)*np.sqrt(ph*(1-ph)/n + z*z/(4*n*n)); lo, hi = c - h, c + h
    inside = (lo <= p) & (p <= hi)
    return binom.pmf(k, n, p)[inside].sum()
for m in (0.5, 1, 2, 3, 5, 7, 10, 15, 20, 30):
    row = [f'np={m:5.1f}']
    for n in (30, 100, 1000):
        p = m / n
        if p < 1: row.append(f'n={n}: W={cov(n,p,"wald"):.3f} Wi={cov(n,p,"wilson"):.3f}')
    print(' | '.join(row))
# smoothed: average coverage over np in [a,b] windows
print('--- mean Wald coverage over np windows')
for a, b in ((1, 3), (3, 6), (6, 10), (10, 20), (20, 50)):
    row = []
    for n in (30, 100, 1000):
        g = np.linspace(a, b, 200) / n; g = g[g < 0.5]
        if len(g): row.append(f'n={n}: {np.mean([cov(n,p,"wald") for p in g]):.3f}')
    print(f'[{a},{b}]', ' '.join(row))
# min Wald coverage for np >= 10 (p<=0.5), per n
for n in (30, 100, 1000):
    g = np.linspace(10 / n, 0.5, 400)
    c = [cov(n, p, 'wald') for p in g]
    print('n', n, 'min Wald cov for np>=10:', round(min(c), 3), 'at p', round(g[int(np.argmin(c))], 4))
    gw = np.linspace(0.001, 0.5, 400)
    cw = [cov(n, p, 'wilson') for p in gw]
    print('   min Wilson cov over p in [0.001,0.5]:', round(min(cw), 3), 'at p', round(gw[int(np.argmin(cw))], 4))
