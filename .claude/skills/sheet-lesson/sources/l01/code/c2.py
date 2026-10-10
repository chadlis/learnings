import math
import numpy as np
from itertools import product, permutations

n, r = 5, 3
print("ordered, with replacement   :", len(list(product(range(n), repeat=r))), "=", n**r)
print("ordered, without replacement:", len(list(permutations(range(n), r))), "=", math.perm(n, r))
print("5 cards in order            :", math.perm(52, 5), "=", 52 * 51 * 50 * 49 * 48)

# Plates: 4 letters drawn with replacement; how often are they all different?
rng = np.random.default_rng(1)
letters = np.sort(rng.integers(0, 26, size=(200_000, 4)), axis=1)
distinct = (np.diff(letters, axis=1) > 0).all(axis=1)
exact = math.perm(26, 4) / 26**4
print(f"P(4 distinct letters): simulated {distinct.mean():.4f}, exact {exact:.4f}")

# Trap: numpy integers are 64-bit and overflow silently
print("np.prod(1..21)     =", np.prod(np.arange(1, 22)))
print("math.factorial(21) =", math.factorial(21))
