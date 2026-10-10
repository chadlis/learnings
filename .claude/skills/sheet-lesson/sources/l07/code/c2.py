import numpy as np
from math import erf, sqrt

rng = np.random.default_rng(0)
n = 100_000
clouds = {
    "gaussian": rng.standard_normal((n, 2)),
    "uniform square": rng.uniform(-2, 2, (n, 2)),
}
disk = rng.uniform(-2, 2, (2 * n, 2))
clouds["uniform disk"] = disk[(disk ** 2).sum(axis=1) < 4][:n]   # keep points inside radius 2

bands = [(0, 0.5), (0.5, 1), (1, 1.5), (1.5, 2)]
row = lambda shares: "".join(f"{100 * s:9.1f} %" for s in shares)
print(f"{'band of x':15s}" + "".join(f"{str([a, b]):>11s}" for a, b in bands))
for name, pts in clouds.items():
    x = pts[:, 0]                  # marginal of X: forget y, count points band by band
    print(f"{name:15s}" + row([np.mean((x >= a) & (x < b)) for a, b in bands]))

Phi = lambda t: 0.5 * (1 + erf(t / sqrt(2)))
print(f"{'gaussian, exact':15s}" + row([Phi(b) - Phi(a) for a, b in bands]))
