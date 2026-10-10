import numpy as np

rng = np.random.default_rng(0)
n = 2_000_000
x = rng.standard_normal(n)
y = 0.8 * x + 0.6 * rng.standard_normal(n)       # the cloud of the vignette

band = np.abs(x - 1.5) < 0.02                     # a thin slice around X = 1.5
print(f"points in the slice: {band.sum()}")
print(f"slice : mean {y[band].mean():.3f} (theory 1.2), sd {y[band].std():.3f} (theory 0.6)")
print(f"all y : mean {y.mean():.3f} (theory 0),   sd {y.std():.3f} (theory 1)")

# discrete: first die X and maximum M; condition on X = 2 by keeping that column only
d1, d2 = rng.integers(1, 7, n), rng.integers(1, 7, n)
col = np.maximum(d1, d2)[d1 == 2]
print("P(M = m | X = 2), m = 1..6:", [round(float(np.mean(col == v)), 3) for v in range(1, 7)])
