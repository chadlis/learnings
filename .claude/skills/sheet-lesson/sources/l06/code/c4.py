import numpy as np
from scipy import stats
rng = np.random.default_rng(3)
Y = rng.normal(0, 1, 1_000_000) ** 2
# CDF to CDF: P(Y <= y) = P(|X| <= sqrt y) = 2 Phi(sqrt y) - 1
for y in [0.01, 1, 3.84]:
    exact = 2 * stats.norm.cdf(y ** 0.5) - 1
    print(f"P(Y <= {y}): simulated {np.mean(Y <= y):.4f}, exact {exact:.4f}")
print(f"mean {Y.mean():.3f}   variance {Y.var():.3f}   (theory 1 and 2)")

# density in a window of width 0.02 vs e^(-y/2) / sqrt(2 pi y), +- two standard errors
for y in [0.5, 2.0]:
    p = np.mean(abs(Y - y) < 0.01)
    noise = 2 * np.sqrt(p * (1 - p) / Y.size) / 0.02
    fy = np.exp(-y / 2) / np.sqrt(2 * np.pi * y)
    print(f"density at {y}: simulated {p / 0.02:.3f} +- {noise:.3f}, formula {fy:.4f}")

# sum of k = 5 independent squares: chi-square with 5 degrees of freedom
S = (rng.normal(0, 1, (1_000_000, 5)) ** 2).sum(axis=1)
print(f"k = 5: mean {S.mean():.3f}   variance {S.var():.2f}   (theory 5 and 10)")
