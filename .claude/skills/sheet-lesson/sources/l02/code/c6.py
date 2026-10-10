import numpy as np
from math import comb

# Pascal's rule builds the triangle with additions only, no factorial
row = [1]
for n in range(1, 11):
    row = [1] + [row[k - 1] + row[k] for k in range(1, n)] + [1]
print("row 10:", row)
print("equals math.comb:", row == [comb(10, k) for k in range(11)])
print("sum of the row:", sum(row), "= 2^10")

# Galton board: 10 rows of pegs, each bounce goes right with probability 1/2
rng = np.random.default_rng(0)
# the bin a bead lands in = its number of right bounces
bins = rng.integers(0, 2, size=(100_000, 10)).sum(axis=1)
freq = np.bincount(bins, minlength=11) / len(bins)
for k in (0, 3, 5):
    exact = comb(10, k) / 2**10
    print(f"bin {k}: simulated {freq[k]:.4f}   C(10, {k})/2^10 = {exact:.4f}")
