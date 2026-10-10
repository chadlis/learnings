import numpy as np

rng = np.random.default_rng(1)
n = 1_000_000
X = rng.integers(1, 7, n); Y = rng.integers(1, 7, n)     # two independent dice
v = 35 / 12
print("Var(2X - Y):", np.var(2 * X - Y).round(3), "| 4v + v =", round(5 * v, 3))
print("Var(X - Y) :", np.var(X - Y).round(3), "| v + v =", round(2 * v, 3), "(not v - v = 0)")
print("Var(X + X) :", np.var(X + X).round(3), "| 4v =", round(4 * v, 3))

# six variables of variance 1: independent, then pairwise correlated at 0.5
k, rho = 6, 0.5
iid = rng.standard_normal((k, n))
shared = rng.standard_normal(n)              # a common part creates the covariances
corr = np.sqrt(rho) * shared + np.sqrt(1 - rho) * rng.standard_normal((k, n))
print("Cov of two correlated ones:", np.cov(corr[0], corr[1])[0, 1].round(3))
print("Var(sum), iid       :", np.var(iid.sum(0)).round(3), "| k =", k)
print("Var(sum), correlated:", np.var(corr.sum(0)).round(3),
      "| k + k(k-1) rho =", k + k * (k - 1) * rho)
