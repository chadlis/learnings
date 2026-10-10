import numpy as np
from scipy.stats import skew

rng = np.random.default_rng(1)
reps = 100_000
for n in (30, 100):                        # mean of n Exponential(1): mu = sigma = 1
    m = rng.exponential(1.0, size=(reps, n)).mean(axis=1)
    z = (m - 1) / (1 / np.sqrt(n))
    print(f"exponential n={n:3d}: skew {skew(z):.2f} (theory {2 / np.sqrt(n):.2f})  "
          f"P(Z>1.96)={np.mean(z > 1.96):.3f}  P(Z<-1.96)={np.mean(z < -1.96):.3f}")

p = 0.02                                   # a rare event: Bernoulli(0.02)
for n in (30, 100, 500):
    phat = rng.binomial(n, p, size=reps) / n
    none = np.mean(phat == 0)              # share of samples without a single success
    print(f"Bernoulli(0.02) n={n:3d}: np={n * p:4.1f}  "
          f"no success {none:.1%}  skew {skew(phat):.2f}")
