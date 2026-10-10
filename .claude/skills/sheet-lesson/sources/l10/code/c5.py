import numpy as np

rng = np.random.default_rng(0)
p, sets = 0.9, 20_000                   # true accuracy, number of simulated test sets
for n in (1_000, 4_000):
    acc = rng.binomial(n, p, size=sets) / n     # one realised accuracy per test set
    se = np.sqrt(p * (1 - p) / n)
    print(f"n = {n}: sd of the accuracies {acc.std():.5f}   formula {se:.5f}")

sigma = np.sqrt(35 / 12)                # one die
for se in (0.1, 0.05):
    print(f"dice needed for SE {se}: {int(np.ceil((sigma / se) ** 2))}")
