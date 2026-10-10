import numpy as np

rng = np.random.default_rng(1)
n, t = 100_000, 0.3
cases = {"Poisson(2)": (rng.poisson(2, n), np.exp(2 * (np.exp(t) - 1))),
         "N(0, 1)":    (rng.standard_normal(n), np.exp(t**2 / 2)),
         "Exp(1)":     (rng.exponential(1, n), 1 / (1 - t))}
for name, (x, exact) in cases.items():
    est = np.mean(np.exp(t * x))
    print(f"{name:10s}  mean of e^(tX) = {est:.4f}   formula = {exact:.4f}")

# Exp(1) near the edge (t -> 1): Var(e^(tX)) = M(2t) - M(t)^2 is infinite once 2t >= 1
x = rng.exponential(1, (5, n))                      # five independent samples
for t in (0.3, 0.9):
    est = np.mean(np.exp(t * x), axis=1)
    print(f"t = {t}: five estimates {np.round(est, 2)}   formula {1 / (1 - t):.2f}")
