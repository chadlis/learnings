import numpy as np
from itertools import product

# Enumerate Omega for two fair dice, then count the event "at least one 5"
omega = list(product(range(1, 7), repeat=2))
A = [w for w in omega if 5 in w]
print(f"#Omega = {len(omega)}, #A = {len(A)}, P(A) = {len(A) / len(omega):.4f}")

# Three dice summing to 13 (a teaser question of video 01)
triples = [t for t in product(range(1, 7), repeat=3) if sum(t) == 13]
print(f"three dice, sum 13: {len(triples)}/216 = {len(triples) / 216:.4f}")

# Simulate 100,000 throws of two dice: each of the 36 cells gets about 1/36 of them
rng = np.random.default_rng(0)
d = rng.integers(1, 7, size=(100_000, 2))
cells = np.bincount((d[:, 0] - 1) * 6 + (d[:, 1] - 1), minlength=36)
print(f"throws per cell: min {cells.min()}, max {cells.max()}, expected {100_000 / 36:.0f}")
print(f"frequency of A: {(d == 5).any(axis=1).mean():.4f}   (11/36 = {11 / 36:.4f})")
