import numpy as np
from math import pi

def joint(x, y, rho):                   # standard bivariate normal with correlation rho
    q = (x**2 - 2 * rho * x * y + y**2) / (1 - rho**2)
    return np.exp(-q / 2) / (2 * pi * np.sqrt(1 - rho**2))
phi = lambda t: np.exp(-t**2 / 2) / np.sqrt(2 * pi)   # both marginals are N(0, 1), for any rho

g = np.linspace(-3, 3, 301)
X, Y = np.meshgrid(g, g)
for rho in (0.0, 0.8):
    gap = np.abs(joint(X, Y, rho) - phi(X) * phi(Y)).max()
    print(f"rho = {rho}: max |f(x, y) - fX(x) fY(y)| on the grid = {gap:.4f}")

rng = np.random.default_rng(0)
n = 1_000_000
r, t = 2 + 0.2 * rng.standard_normal(n), rng.uniform(0, 2 * pi, n)
clouds = {"centre": rng.standard_normal((2, n)), "ring": (r * np.cos(t), r * np.sin(t))}
for name, (x, y) in clouds.items():
    ys = rng.permutation(y)             # shuffle the y's: builds the product of the marginals
    before, after = np.mean(x**2 + y**2 < 1), np.mean(x**2 + ys**2 < 1)
    print(f"{name:6s}: share with r < 1 before {before:.3f}, after shuffling {after:.3f}")
