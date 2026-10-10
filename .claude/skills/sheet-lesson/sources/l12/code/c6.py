import numpy as np

t = 1.0
coin = lambda u: np.cosh(u)                         # X = +1 or -1: mean 0, sigma 1
cexp = lambda u: np.exp(-u) / (1 - u)               # Exp(1) - 1: mean 0, sigma 1, skewed
print("     n   coin M_Zn(1)   exp M_Zn(1)   n * eps_n (exp)")
for n in (2, 10, 100, 1000, 10_000):
    u = t / np.sqrt(n)                              # step 4: M at t / (sigma sqrt n)
    eps = cexp(u) - 1 - t**2 / (2 * n)              # step 5: left after 1 + t^2/(2n)
    print(f"{n:6d}   {coin(u)**n:.5f}        {cexp(u)**n:.5f}       {n * eps:.5f}")
print(f"limit e^(t^2/2) = {np.exp(t**2 / 2):.5f}")

# Monte Carlo: standardized sums of 100 exponentials
rng = np.random.default_rng(3)
z = (rng.exponential(1, (200_000, 100)).sum(axis=1) - 100) / np.sqrt(100)
print(f"E[e^Z] = {np.mean(np.exp(z)):.4f}   (exact {cexp(0.1)**100:.4f})")
print(f"P(Z <= 1) = {np.mean(z <= 1):.4f}   (Phi(1) = 0.8413)")
