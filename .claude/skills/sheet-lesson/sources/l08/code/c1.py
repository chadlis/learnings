import numpy as np

rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=100_000)    # 100,000 fair die rolls
print(f"mean of rolls: {rolls.mean():.3f}")  # close to E[X] = 3.5

heads = rng.integers(0, 2, size=(10_000, 100)).sum(axis=1)  # 10,000 runs of 100 coins
print(f"mean number of heads: {heads.mean():.2f}")           # close to 50
