import numpy as np

rng = np.random.default_rng(0)
lam = 5.0                                          # emails per minute
gaps = rng.exponential(scale=1 / lam, size=500_000)  # waiting times W1, W2, ...
arrivals = np.cumsum(gaps)                         # arrival times T1, T2, ...
H = np.floor(arrivals[-1])                         # whole minutes covered
print(f"mean gap {60 * gaps.mean():.2f} s   (1/lam = 12 s)")

for t in [0.1, 1.0]:
    edges = np.arange(0, H + 1e-9, t)              # windows of t minutes
    counts = np.histogram(arrivals, bins=edges)[0] # N(t) in each window
    p0, p1 = np.exp(-lam * t), lam * t * np.exp(-lam * t)
    print(f"t = {t} min: mean {counts.mean():.3f}  var {counts.var():.3f}  (lam t = {lam * t})")
    print(f"   P(N = 0) {np.mean(counts == 0):.4f} vs {p0:.4f}"
          f"   P(N = 1) {np.mean(counts == 1):.4f} vs {p1:.4f}   ratio 5t = {lam * t}")
