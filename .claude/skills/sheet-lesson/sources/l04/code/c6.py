import numpy as np
from scipy.stats import norm

for k in (1, 2, 3):
    print(f"Phi({k}) = {norm.cdf(k):.4f}   P(|Z| <= {k}) = {2 * norm.cdf(k) - 1:.4f}")
print(f"Phi(-1) = {norm.cdf(-1):.4f} = 1 - Phi(1)")
print(f"95% exactly within +-{norm.ppf(0.975):.3f}")

rng = np.random.default_rng(0)
x = rng.normal(200, 10, size=1_000_000)       # N(200, 10^2): numpy and scipy take sigma
for k in (1, 2, 3):
    share = np.mean(np.abs(x - 200) <= 10 * k)
    print(f"share within {k} sigma of 200: {share:.4f}")
