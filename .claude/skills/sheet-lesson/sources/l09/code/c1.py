import numpy as np

rng = np.random.default_rng(0)
n = 1_000_000
A, B, C = rng.standard_normal((3, n))      # independent, variance 1 each
X, Y = A + B, A + C                         # A is the shared part

mx, my = X.mean(), Y.mean()
print(f"mean of (X - mx)(Y - my): {np.mean((X - mx) * (Y - my)):.4f}")
print(f"E[XY] - E[X]E[Y]        : {np.mean(X * Y) - mx * my:.4f}")
print(f"np.cov(X, Y)[0, 1]      : {np.cov(X, Y)[0, 1]:.4f}   (theory: Var A = 1)")
print(f"Cov(B, C), nothing shared: {np.cov(B, C)[0, 1]:.4f}")

# the four points: np.cov divides by n - 1 by default
x = np.array([1, 2, 3, 4.]); y = np.array([1, 3, 2, 4.])
print("four points, np.cov          :", np.cov(x, y)[0, 1].round(4))
print("four points, np.cov bias=True:", np.cov(x, y, bias=True)[0, 1])
