import numpy as np
from math import comb

n, p = 12, 1 / 6                              # 12 die rolls, success = a six
pmf = [comb(n, k) * p**k * (1 - p)**(n - k) for k in range(n + 1)]
print(f"P(X = 3) = {pmf[3]:.4f}   sum of all P(X = k) = {sum(pmf):.6f}")

rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=(100_000, n)) # 100,000 experiments of 12 rolls
x = (rolls == 6).sum(axis=1)                  # X = B1 + ... + B12
print(f"share of experiments with exactly three sixes: {np.mean(x == 3):.4f}")
print(f"mean {x.mean():.3f} (np = {n * p:.3f})")
print(f"variance {x.var():.3f} (np(1 - p) = {n * p * (1 - p):.3f})")
