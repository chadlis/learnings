import numpy as np

rng = np.random.default_rng(4)
m, n, p, q = 4_000_000, 2, 0.01, 0.001     # systems, disks, failure prob., surge prob.
# about 400 parallel failures expected: the simulated rates carry about 5 % of noise
fail = rng.random((m, n)) < p              # each disk fails on its own, independently
surge = rng.random(m) < q                  # a common shock that kills every disk at once

series = fail.any(axis=1)                  # one failure is enough
parallel = fail.all(axis=1)                # every disk must fail
parallel_cc = parallel | surge

print(f"series            : {series.mean():.6f}  exact {1 - (1 - p)**n:.6f}")
print(f"parallel          : {parallel.mean():.6f}  exact {p**n:.6f}")
print(f"parallel + surge  : {parallel_cc.mean():.6f}  exact {q + (1 - q) * p**n:.6f}")
