from collections import Counter
from fractions import Fraction

pmf = {x: Fraction(1, 6) for x in range(1, 7)}       # fair die
g = lambda x: (x - Fraction(7, 2)) ** 2               # squared distance to the mean

# LOTUS: reweight g(x) by P(X = x), no need for the law of g(X)
lotus = sum(g(x) * p for x, p in pmf.items())

# the long way: build the law of Y = g(X) first
law_y = Counter()
for x, p in pmf.items():
    law_y[g(x)] += p
direct = sum(y * p for y, p in law_y.items())

print(dict(law_y))
print(lotus, direct)
