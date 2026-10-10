from itertools import permutations
from math import factorial

# give each of the 7 people the label of the committee they join:
# a (2 seats), b (3 seats), c (2 seats)
labeled = set(permutations("aabbbcc"))
formula = factorial(7) // (factorial(2) * factorial(3) * factorial(2))
print("labeled committees:", len(labeled), "| 7!/(2! 3! 2!) =", formula)

# two committees of 2 interchangeable: a split and its a <-> c swap coincide
swap = str.maketrans("ac", "ca")
unlabeled = {min(p, tuple("".join(p).translate(swap))) for p in labeled}
print("two pairs interchangeable:", len(unlabeled), "| 210 / 2! =", formula // 2)
