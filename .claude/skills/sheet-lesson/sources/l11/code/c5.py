import numpy as np
from scipy.stats import binom, norm

z = norm.ppf(0.975)                        # 1.96

def wald(k, n):
    p = k / n; h = z * np.sqrt(p * (1 - p) / n)
    return p - h, p + h

def wilson(k, n):
    p = k / n; c = (p + z**2 / (2 * n)) / (1 + z**2 / n)
    h = z / (1 + z**2 / n) * np.sqrt(p * (1 - p) / n + z**2 / (4 * n**2))
    return c - h, c + h

print("recall 28/30  Wald [%.3f ; %.3f]" % wald(28, 30))
print("recall 28/30  Wilson [%.3f ; %.3f]" % wilson(28, 30))

def coverage(n, p, ci):          # exact: add P(K = k) over the k whose interval holds p
    k = np.arange(n + 1); lo, hi = ci(k, n)
    return binom.pmf(k, n, p)[(lo <= p) & (p <= hi)].sum()

for n, p in ((30, 0.93), (30, 0.02), (100, 0.02), (1000, 0.02), (1000, 0.872)):
    fewest = min(n * p, n * (1 - p))       # expected successes or failures, the fewer
    cw, cs = coverage(n, p, wald), coverage(n, p, wilson)
    print(f"n={n:4d} p={p:.3f}  fewest {fewest:5.1f}   Wald {cw:.3f}  Wilson {cs:.3f}")
