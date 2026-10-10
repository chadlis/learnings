import numpy as np

lam, h = 3.0, 1e-3
M = lambda t: np.exp(lam * (np.exp(t) - 1))         # Poisson MGF

d1 = (M(h) - M(-h)) / (2 * h)                       # slope at 0
d2 = (M(h) - 2 * M(0) + M(-h)) / h**2               # curvature at 0
d3 = (M(2 * h) - 2 * M(h) + 2 * M(-h) - M(-2 * h)) / (2 * h**3)
print(f"M'(0)   = {d1:6.3f}   theory lam                 = {lam}")
print(f"M''(0)  = {d2:6.3f}   theory lam^2 + lam         = {lam**2 + lam}")
print(f"M'''(0) = {d3:6.3f}   theory lam^3 + 3lam^2 + lam = {lam**3 + 3 * lam**2 + lam}")
print(f"Var = M''(0) - M'(0)^2 = {d2 - d1**2:.3f}")

x = np.random.default_rng(0).poisson(lam, 1_000_000)
print("sample E[X], E[X^2], E[X^3]:", [round(float(np.mean(x**k)), 2) for k in (1, 2, 3)])
mu, sd = x.mean(), x.std()
print(f"skewness {np.mean(((x - mu) / sd)**3):.3f}   theory 1/sqrt(lam) = {lam**-0.5:.3f}")
