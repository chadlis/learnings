import numpy as np

rng = np.random.default_rng(17)
for N in (100, 10_000, 1_000_000):
    x, y = rng.random(N), rng.random(N)
    inside = x**2 + y**2 <= 1                  # g = indicator of the quarter disc
    est = 4 * inside.mean()
    se = 4 * inside.std() / np.sqrt(N)
    print(f"N = {N:9d}   pi estimate {est:.4f}   error {abs(est - np.pi):.4f}   SE {se:.4f}")

z = rng.normal(size=1_000_000)
print(f"E[exp(Z)] ~ {np.exp(z).mean():.4f}   exact e^0.5 = {np.exp(0.5):.4f}   exp(E[Z]) = 1")
