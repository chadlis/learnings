import numpy as np
from itertools import combinations_with_replacement
from math import comb, factorial

# Unordered results of two dice: multisets {i, j} with i <= j
multisets = list(combinations_with_replacement(range(1, 7), 2))
print(len(multisets), "unordered results = C(7, 2) =", comb(7, 2))

# They are not equally likely: throw 100,000 pairs and sort each one
rng = np.random.default_rng(2)
d = np.sort(rng.integers(1, 7, size=(100_000, 2)), axis=1)
freq = lambda a, b: np.mean((d[:, 0] == a) & (d[:, 1] == b))
print("{5, 5}:", f"{freq(5, 5):.4f}  (1/36 = {1 / 36:.4f})")
print("{1, 5}:", f"{freq(1, 5):.4f}  (2/36 = {2 / 36:.4f})")

# Counting "at least one 5" on the 21 multisets gives the wrong answer
naive = sum(5 in m for m in multisets) / len(multisets)
simulated = (d == 5).any(axis=1).mean()
print(f"at least one 5: 6/21 = {naive:.4f}, simulated {simulated:.4f}, 11/36 = {11 / 36:.4f}")

# Bootstrap of 10 rows: distinct resamples, and P(each row appears exactly once)
print("C(19, 10) =", comb(19, 10), "  P(all 10 rows once) =", round(factorial(10) / 10**10, 5))
