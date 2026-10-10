import numpy as np

rng = np.random.default_rng(0)
reps, n = 100_000, 4
dice = rng.integers(1, 7, size=(reps, n))      # 100,000 repetitions of "throw 4 dice"
xbar = dice.mean(axis=1)                       # one realisation of Xbar per repetition
copies = np.repeat(dice[:, :1], n, axis=1)     # one die copied 4 times: fully dependent
xbar_copy = copies.mean(axis=1)

print("first three realisations:", xbar[:3])
for name, x, var in (("independent", xbar, 35 / 12 / n), ("copies", xbar_copy, 35 / 12)):
    print(f"{name:11s}  mean {x.mean():.3f} (theory 3.5)   var {x.var():.3f} (theory {var:.3f})")
