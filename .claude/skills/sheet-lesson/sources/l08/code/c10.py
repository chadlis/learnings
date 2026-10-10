import numpy as np

rng = np.random.default_rng(0)
m, sigma = 2.0, 1.3
v = rng.normal(0, sigma, size=(1_000_000, 3))   # three independent velocity components
ke = 0.5 * m * (v ** 2).sum(axis=1)

print(f"E[KE] ≈ {ke.mean():.3f}   (3/2) m σ² = {1.5 * m * sigma**2:.3f}")
