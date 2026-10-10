import numpy as np

rng = np.random.default_rng(0)
n, k = 1_000_000, 2
m = 1 / (2 * k**2)       # three-point law built to attain the bound
laws = {  # name: (sample, true mean, true sd)
    "normal": (rng.normal(0, 1, n), 0, 1),
    "uniform": (rng.uniform(0, 1, n), 0.5, np.sqrt(1 / 12)),
    "exponential": (rng.exponential(1, n), 1, 1),
    "die": (rng.integers(1, 7, n), 3.5, np.sqrt(35 / 12)),
    "three-point": (rng.choice([-k, 0, k], p=[m, 1 - 2 * m, m], size=n), 0, 1),
}
print(f"Chebyshev bound for k = {k}: {1 / k**2:.4f}")
for name, (x, mu, sd) in laws.items():
    print(f"{name:12s} P(|X - mu| >= 2 sd) = {np.mean(np.abs(x - mu) >= k * sd):.4f}")
