import numpy as np

rng = np.random.default_rng(0)
n = 200_000
x = rng.integers(1, 7, size=n)
y = rng.integers(1, 7, size=n)               # independent of x
print(f"independent dice: E[XY] ≈ {(x * y).mean():.2f}, E[X]E[Y] ≈ {x.mean() * y.mean():.2f}")
print(f"same die (Y = X): E[XY] ≈ {(x * x).mean():.2f}, E[X]E[Y] ≈ {x.mean() ** 2:.2f}")

u = rng.choice([-1, 0, 1], size=n)
v = u ** 2                                   # v is a function of u: fully dependent
print(f"Y = X² on (-1, 0, 1): E[XY] ≈ {(u * v).mean():.3f}, E[X]E[Y] ≈ {u.mean() * v.mean():.3f}")
