"""Checks for the fresh-context review of l09."""
import math, numpy as np
from scipy.stats import binom
from fractions import Fraction as F
z = 1.96
for p in (0.872, 0.901):
    se = math.sqrt(p * (1 - p) / 1000); print(p, 'CI95', round(p - z * se, 5), round(p + z * se, 5))
print('overlap', round(0.901 - z * math.sqrt(.901 * .099 / 1000), 5), 'to', round(0.872 + z * math.sqrt(.872 * .128 / 1000), 5))
s = math.sqrt(2 * .872 * .128 / 1000); print('same model twice, sd', s, 'E|D| normal', s * math.sqrt(2 / math.pi))
k = np.arange(1001); pk = binom.pmf(k, 1000, .872)
# exact E|B - A|/n for A, B iid Bin(1000, .872)
P = np.outer(pk, pk); D = np.abs(k[:, None] - k[None, :]) / 1000; print('E|D| exact', (P * D).sum())
print('35/3 - 35/6 =', F(35, 3) - F(35, 6), float(F(35, 6)))
print('Var(X+Y) for Y=X^2:', F(8, 9), '=', F(2, 3) + F(2, 9))
