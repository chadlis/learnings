import numpy as np

rng = np.random.default_rng(2)
reps, sigma = 10_000, np.sqrt(35 / 12)
for n in (1, 10, 100, 1000):
    cauchy = rng.standard_cauchy((reps, n)).mean(axis=1)
    dice = rng.integers(1, 7, (reps, n)).mean(axis=1)
    print(f"n={n:4d}  P(|mean - centre| > 1):  Cauchy {np.mean(np.abs(cauchy) > 1):.3f}"
          f"   dice {np.mean(np.abs(dice - 3.5) > 1):.3f}")

rho = 0.05                                 # a common error C shared by all measurements
for n in (10, 100, 1000):
    C = rng.standard_normal((reps, 1))
    E = rng.standard_normal((reps, n))
    x = 3.5 + sigma * (np.sqrt(rho) * C + np.sqrt(1 - rho) * E)
    iid = sigma / np.sqrt(n)               # what sigma/sqrt(n) promises
    formula = sigma * np.sqrt(rho + (1 - rho) / n)
    sd = x.mean(axis=1).std()
    print(f"n={n:4d}  sd of mean {sd:.3f}   iid {iid:.3f}   formula {formula:.3f}")
