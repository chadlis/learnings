import numpy as np
from scipy.stats import norm
rng = np.random.default_rng(2)

# X ~ N(15, 5^2): P(10 < X < 25) by standardising, then by simulation
X = rng.normal(15, 5, 1_000_000)
sim = np.mean((10 < X) & (X < 25))
print("Phi(2) - Phi(-1) =", round(norm.cdf(2) - norm.cdf(-1), 4), "  simulated:", sim.round(4))

# a standardised Exp(1) (mu = sigma = 1) has mean 0 and sd 1, but it is not normal
Z = rng.exponential(1.0, 1_000_000) - 1.0
print(f"mean {Z.mean():.3f}   sd {Z.std():.3f}")
print("P(Z > 2):", np.mean(Z > 2).round(4), "  Phi says", round(norm.sf(2), 4))
print("P(Z < -1):", np.mean(Z < -1).round(4), "  Phi says", round(norm.cdf(-1), 4))
# z-scores make distances unit-free: A, B, C = (height in cm, income in euros)
F, sd = np.array([[170, 30_000], [180, 30_000], [170, 40_000]]), np.array([10, 20_000])
print("raw:      AB", np.linalg.norm(F[0] - F[1]), "  AC", np.linalg.norm(F[0] - F[2]))
D = (F - F[0]) / sd  # differences to A, counted in standard deviations
print("z-scores: AB", np.linalg.norm(D[1]), "  AC", np.linalg.norm(D[2]))
