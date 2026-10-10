"""n5 : IC numbers, Wald vs Wilson, exact coverage."""
import numpy as np
from scipy.stats import binom, norm, t as tdist

z = norm.ppf(0.975); print('z', z)

def wald(k, n):
    p = k / n; se = np.sqrt(p * (1 - p) / n); return p - z * se, p + z * se, se
def wilson(k, n):
    p = k / n; c = (p + z * z / (2 * n)) / (1 + z * z / n); h = z / (1 + z * z / n) * np.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return c - h, c + h

print('28/30 Wald', wald(28, 30), 'Wilson', wilson(28, 30))
print('872/1000 Wald', wald(872, 1000), 'Wilson', wilson(872, 1000))
print('poll 520/1000 Wald', wald(520, 1000))
print('n for +-3pts at p=.5', (z * 0.5 / 0.03)**2, ' with 1.96:', (1.96 * .5 / .03)**2)
print('n for +-1pt', (1.96 * .5 / .01)**2)
# A/B
a, b, n = 200, 240, 10000
pa, pb = a / n, b / n; se = np.sqrt(pa * (1 - pa) / n + pb * (1 - pb) / n)
print('AB diff', pb - pa, 'se', se, 'z', (pb - pa) / se, 'IC', pb - pa - 1.96 * se, pb - pa + 1.96 * se, 'p two-sided', 2 * norm.sf((pb - pa) / se))
print('se A', np.sqrt(pa * (1 - pa) / n), 'se B', np.sqrt(pb * (1 - pb) / n))
print('t9 .975', tdist.ppf(.975, 9), 't29', tdist.ppf(.975, 29))
# Brunton measurement example sigma=2, n=30
print('meas SE', 2 / np.sqrt(30), 'half', 1.96 * 2 / np.sqrt(30))
# dice n=30 interval half width
print('dice n=30 half width', 1.96 * np.sqrt(35 / 12) / np.sqrt(30))

def cover(n, p, f):
    k = np.arange(n + 1); pm = binom.pmf(k, n, p); c = 0
    for kk, w in zip(k, pm):
        lo, hi = f(kk, n)[:2]
        if lo <= p <= hi: c += w
    return c

print('--- exact coverage Wald / Wilson')
for n in (30, 100, 1000):
    for p in (0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.93, 0.98):
        print(f'n={n:5d} p={p:.2f} np={n*p:6.1f} min(np,nq)={min(n*p,n*(1-p)):6.1f} Wald={cover(n,p,wald):.3f} Wilson={cover(n,p,wilson):.3f}')
# coverage at p = 28/30-ish truth 0.93 with n=30
print('n=30 p=0.9333', cover(30, 28 / 30, wald), cover(30, 28 / 30, wilson))
