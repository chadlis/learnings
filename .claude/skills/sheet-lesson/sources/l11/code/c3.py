import numpy as np
from scipy.stats import gamma, norm

n = 100                                    # sum of 100 Exponential(1): mean 100, sd 10
S = gamma(a=n)                             # exact law of the sum
for k in (2, 3, 4, 5):
    exact, approx = S.sf(n + k * np.sqrt(n)), norm.sf(k)
    print(f"P(S > mean + {k} sd): exact {exact:.2e}  normal {approx:.2e}  "
          f"ratio {exact / approx:5.1f}")

rng = np.random.default_rng(3)             # check one line by simulation
s = rng.exponential(size=(200_000, n)).sum(axis=1)
print(f"simulated P(S > mean + 3 sd) = {np.mean(s > n + 3 * np.sqrt(n)):.2e}")
