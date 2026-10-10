import numpy as np
from scipy import stats

rng = np.random.default_rng(0)
n, p = 10_000, 0.002            # Brunton's factory: 10,000 lights, p = 0.002 per day
lam = n * p                     # 20 lights per day on average

days = rng.binomial(n, p, size=100_000)          # exact model: one binomial per day
print(f"mean {days.mean():.3f}   var {days.var():.3f}   (Poisson: both = {lam:.0f})")

for k in [10, 15, 20, 25, 30]:
    b, q = stats.binom.pmf(k, n, p), stats.poisson.pmf(k, lam)
    print(f"P(X={k})  binomial {b:.5f}  Poisson {q:.5f}  simulated {np.mean(days == k):.5f}")

# what matters is a small p with np fixed: lambda = 4, n grows
k = np.arange(60)
for n in [10, 100, 1_000, 100_000]:
    gap = np.abs(stats.binom.pmf(k, n, 4 / n) - stats.poisson.pmf(k, 4)).max()
    print(f"n = {n:>7,}   p = {4 / n:.5f}   max gap to Poisson(4) = {gap:.6f}")
