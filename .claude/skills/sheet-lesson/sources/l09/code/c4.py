import numpy as np

rng = np.random.default_rng(3)
u, w = rng.standard_normal((2, 100_000))
X = u; Y = 0.6 * u + 0.8 * w                    # Var Y = 0.36 + 0.64 = 1, rho = 0.6
r = lambda a, b: np.corrcoef(a, b)[0, 1].round(3)

print("rho(X, Y)               :", r(X, Y))
print("Cov in feet, in inches  :", np.cov(X, Y)[0, 1].round(3),
      np.cov(12 * X, 12 * Y)[0, 1].round(1))
print("rho(12X + 5, 12Y - 3)   :", r(12 * X + 5, 12 * Y - 3))
print("rho(2X + 1, -3Y + 5)    :", r(2 * X + 1, -3 * Y + 5), "<- ac < 0 flips it")
print("share explained, rho^2  :", (r(X, Y) ** 2).round(2))

# one far point is enough to manufacture a correlation
a, b = rng.standard_normal((2, 30))
print("30 unrelated points     :", r(a, b))
print("same + one point (8, 8) :", r(np.append(a, 8), np.append(b, 8)))
