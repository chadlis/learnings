import numpy as np

rng = np.random.default_rng(1)
paths, n = 2_000, 1_000
s = rng.integers(1, 7, size=(paths, n)).cumsum(axis=1)   # S_m along each path
for m in (10, 100, 1000):
    mean_dev = s[:, m - 1] / m - 3.5                       # Xbar_m - mu
    sum_dev = s[:, m - 1] - 3.5 * m                        # S_m - m mu
    print(f"n = {m:4d}   sd(Xbar - mu) {mean_dev.std():.3f}   sd(S - n mu) {sum_dev.std():5.1f}")

N = 1_000_000
cauchy_mean = rng.standard_cauchy(N).cumsum() / np.arange(1, N + 1)
print("Cauchy running mean at n = 1e3, 1e4, 1e5, 1e6:",
      np.round(cauchy_mean[[999, 9_999, 99_999, N - 1]], 2))
