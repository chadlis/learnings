import numpy as np
from math import comb

N, K, n = 100, 5, 10
rng = np.random.default_rng(0)
lot = np.zeros(N, dtype=int)
lot[:K] = 1                                   # 1 = defective part
trials = 50_000
# without replacement: a part drawn does not go back into the lot
without = np.array([rng.choice(lot, n, replace=False).sum() for _ in range(trials)])
# with replacement: every draw sees the same proportion K/N
with_r = rng.choice(lot, size=(trials, n), replace=True).sum(axis=1)

print("        without replacement     with replacement")
for k in range(4):
    hyper = comb(K, k) * comb(N - K, n - k) / comb(N, n)
    binom = comb(n, k) * (K / N) ** k * (1 - K / N) ** (n - k)
    print(f"k={k}   sim {np.mean(without == k):.4f}  hyper {hyper:.4f}"
          f"   sim {np.mean(with_r == k):.4f}  binom {binom:.4f}")
