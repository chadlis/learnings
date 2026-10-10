import numpy as np

rng = np.random.default_rng(0)
p = 1 / 6                                   # rolling a die until the first 5
x = rng.geometric(p, size=200_000)          # numpy counts trials: support 1, 2, 3, ...

print(f"P(X = 10)   sim {np.mean(x == 10):.4f}   exact {(5/6)**9 * p:.4f}")
print(f"P(X >= 10)  sim {np.mean(x >= 10):.4f}   exact {(5/6)**9:.4f}")
print(f"mean {x.mean():.3f} (1/p = 6)   median {np.median(x):.0f}")

late = x[x > 20] - 20                       # players with no 5 in their first 20 rolls
print(f"after 20 misses: P(10+ more rolls) {np.mean(late >= 10):.4f}   (no memory: 0.1938)")

for k in [1, 5, 10]:                        # pass@k with p = 0.2 per sample
    print(f"pass@{k:<2d} = 1 - 0.8**{k:<2d} = {1 - 0.8**k:.3f}")
