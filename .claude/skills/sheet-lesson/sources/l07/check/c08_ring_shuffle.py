"""v4: exact-ish share inside r < 1 for the product of the ring's marginals (large MC), and the n3 band mean."""
import numpy as np
from scipy import stats
r = np.random.default_rng(5)
tot = 0; n = 0
for _ in range(10):
    m = 2_000_000
    R1 = 2 + 0.2 * r.standard_normal(m); T1 = r.uniform(0, 2*np.pi, m)
    R2 = 2 + 0.2 * r.standard_normal(m); T2 = r.uniform(0, 2*np.pi, m)
    x = R1 * np.cos(T1); y = R2 * np.sin(T2)          # independent draws = product of marginals
    tot += np.sum(x*x + y*y < 1); n += m
print('ring, product of marginals, P(r<1) =', tot / n)
# n3: E[Y | |X - 1.5| < 0.15] = 0.8 E[X | band], truncated normal mean
N = stats.norm
a, b = 1.35, 1.65
EX = (N.pdf(a) - N.pdf(b)) / (N.cdf(b) - N.cdf(a))
print('E[X | band] =', EX, ' E[Y | band] =', 0.8 * EX)
