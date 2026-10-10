import numpy as np
from scipy.stats import norm

rng = np.random.default_rng(0)
mu, sigma = 3.5, np.sqrt(35 / 12)          # one fair die
reps = 100_000                             # repeat the experiment 100,000 times
for n in (1, 4, 30):
    rolls = rng.integers(1, 7, size=(reps, n))
    z = (rolls.mean(axis=1) - mu) / (sigma / np.sqrt(n))   # standardized mean
    inside = np.mean(np.abs(z) <= 1.96)
    print(f"n={n:2d}  mean(Z)={z.mean():+.3f}  sd(Z)={z.std():.3f}  "
          f"P(Z<=1)={np.mean(z <= 1):.3f}  P(|Z|<=1.96)={inside:.3f}")
print(f"N(0,1)                          P(Z<=1)={norm.cdf(1):.3f}  "
      f"P(|Z|<=1.96)={norm.cdf(1.96) - norm.cdf(-1.96):.3f}")

# the data themselves do not become normal: the 3,000,000 rolls of n=30 stay flat
share = np.bincount(rolls.ravel(), minlength=7)[1:] / rolls.size
print("share of each face among all rolls:", np.round(share, 3))
