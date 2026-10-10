import numpy as np

rng = np.random.default_rng(2)
X = rng.choice([-1, 0, 1], size=600_000)        # uniform on {-1, 0, 1}
Y = X ** 2                                      # entirely determined by X

print("Cov(X, Y)      :", np.cov(X, Y)[0, 1].round(4))
print("P(Y = 0)       :", np.mean(Y == 0).round(3))
print("P(Y = 0 | X = 0):", np.mean(Y[X == 0] == 0))
print("Cov(X^2, Y)    :", np.cov(X ** 2, Y)[0, 1].round(4), "| Var Y = 2/9 = 0.2222")
print("Var(X + Y)     :", np.var(X + Y).round(4),
      "| Var X + Var Y =", (np.var(X) + np.var(Y)).round(4))

# continuous version: a feature that determines the target, with zero correlation
x = rng.uniform(-1, 1, 100_000); y = x ** 2
print("corr(x, x^2)   :", np.corrcoef(x, y)[0, 1].round(3))
print("corr(|x|, x^2) :", np.corrcoef(np.abs(x), y)[0, 1].round(3))
