from itertools import product, permutations, combinations, combinations_with_replacement
from math import comb, perm

n, r = 6, 2                                    # two dice
faces = range(1, n + 1)
cases = [
    ("ordered,   with replacement     n^r", product(faces, repeat=r), n**r),
    ("ordered,   without replacement  n!/(n-r)!", permutations(faces, r), perm(n, r)),
    ("unordered, without replacement  C(n, r)", combinations(faces, r), comb(n, r)),
    ("unordered, with replacement     C(n+r-1, r)",
     combinations_with_replacement(faces, r), comb(n + r - 1, r)),
]
for name, it, formula in cases:
    print(f"{name:<45} enumerated {len(list(it)):>2}   formula {formula:>2}")
