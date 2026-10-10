import numpy as np

rng = np.random.default_rng(0)
n = 100_000
x = rng.integers(1, 7, size=n)
# y copies x 90% of the time: x and y are strongly dependent
y = np.where(rng.random(n) < 0.9, x, rng.integers(1, 7, size=n))

print(f"E[X + Y]    ≈ {(x + y).mean():.3f}")
print(f"E[X] + E[Y] ≈ {x.mean() + y.mean():.3f}")   # same: no independence needed
