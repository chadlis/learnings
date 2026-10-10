import numpy as np

# fair die: sum of P(X >= k) for k = 1..6
survival = [(7 - k) / 6 for k in range(1, 7)]
print(sum(survival))                       # 3.5

# geometric(p): number of rolls until the first six
p = 1 / 6
tail = sum((1 - p) ** (k - 1) for k in range(1, 10_000))   # P(X >= k) = q^(k-1)
rng = np.random.default_rng(0)
print(f"{tail:.4f}  {rng.geometric(p, size=200_000).mean():.4f}")   # both ≈ 1/p = 6
