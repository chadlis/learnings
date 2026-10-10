import numpy as np

rng = np.random.default_rng(4)
reps, rho = 10_000, 0.5                 # sigma^2 = 1
for n in (1, 10, 100, 1000):
    C = rng.normal(0, np.sqrt(rho), size=(reps, 1))       # shared error: same for the n terms
    E = rng.normal(0, np.sqrt(1 - rho), size=(reps, n))   # each term's own error
    xbar = (C + E).mean(axis=1)
    print(f"n = {n:4d}   Var(Xbar) {xbar.var():.4f}   formula {rho + (1 - rho) / n:.4f}")

x = C + E                                                  # last batch: check one pair
print(f"corr(X1, X2) = {np.corrcoef(x[:, 0], x[:, 1])[0, 1]:.3f}")
