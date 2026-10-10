import numpy as np
from math import erf, sqrt

Phi = lambda z: 0.5 * (1 + erf(z / sqrt(2)))
rng = np.random.default_rng(1)
X = rng.normal(15, 5, 1_000_000)  # degrees C; numpy takes the sd (5), not the variance

Y = 1.8 * X + 32                    # degrees F
print("Y in F: mean", Y.mean().round(2), "  sd", Y.std().round(2), "  (theory 59 and 9)")
print("P(Y <= 68) =", np.mean(Y <= 68).round(4), "  P(X <= 20) =", np.mean(X <= 20).round(4),
      "  Phi(1) =", round(Phi(1), 4))

# peak height: share of a 1-degree window around the mean
pc, pf = np.mean(abs(X - 15) < 0.5), np.mean(abs(Y - 59) < 0.5)
print("peak per degree C:", pc.round(4), "  per degree F:", pf.round(4),
      "  ratio", round(pc / pf, 2))

# a < 0: H = 20 - X, the degrees missing to reach 20 C
H = 20 - X
print("P(H <= 0) =", np.mean(H <= 0).round(4), "  1 - F_X(20) =", round(1 - Phi(1), 4),
      "  F_X(20), no flip =", round(Phi(1), 4))
print("sd of H:", H.std().round(2), " = |a| sigma; a sigma would be -5")
