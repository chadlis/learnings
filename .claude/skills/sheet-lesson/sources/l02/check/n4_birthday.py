"""Checks for n4 (birthday problem)."""
import math
from fractions import Fraction as F
import numpy as np

def p_none(n, d=365):
    p = 1.0
    for k in range(n):
        p *= (d - k) / d
    return p

for n in [2, 3, 5, 10, 15, 20, 22, 23, 30, 40, 41, 50, 57, 60, 70]:
    pn = p_none(n)
    pairs = n * (n - 1) // 2
    approx_pairs = 1 - (364 / 365) ** pairs
    approx_exp = 1 - math.exp(-pairs / 365)
    print(f"n={n:3d} pairs={pairs:5d} P(none)={pn:.4f} P(share)={1-pn:.4f} "
          f"1-(364/365)^pairs={approx_pairs:.4f} gap={approx_pairs-(1-pn):+.4f} 1-exp={approx_exp:.4f}")
# first n above 0.5
n = 1
while 1 - p_none(n) <= 0.5:
    n += 1
print('first n with P(share) > 0.5:', n)
# exact fraction for n = 2, 3
print('n=2 exact', F(1, 365), float(F(1, 365)))
print('n=3 exact', 1 - F(364 * 363, 365 ** 2), float(1 - F(364 * 363, 365 ** 2)))
print('365/2 =', 365 / 2, ' 365 ln 2 =', 365 * math.log(2))
print('n(n-1)/2 = 365 ln2 -> n =', (1 + math.sqrt(1 + 8 * 365 * math.log(2))) / 2)
print('sqrt(2*365*ln2) =', math.sqrt(2 * 365 * math.log(2)))
# someone shares MY birthday among m others
m = 1
while 1 - (364 / 365) ** m <= 0.5:
    m += 1
print('others needed to share MY birthday with p>0.5:', m, 1 - (364 / 365) ** m, ' m=253:', 1 - (364/365)**253, ' m=22:', 1-(364/365)**22)
# n = 366
print('n=366 P(none) =', p_none(366))
# pairwise vs mutual independence of pair events (exact by counting on 3 people)
d = 365
# E12, E13, E23 : people 1-2, 1-3, 2-3 share
P12 = F(1, d)
P12_13 = F(1, d ** 2)            # b2 = b1 and b3 = b1
P_all3 = F(1, d ** 2)            # all three equal
print('P(E12)=1/365, P(E12&E13) =', P12_13, '= P(E12)P(E13)?', P12_13 == P12 * P12,
      ' P(E12&E13&E23) =', P_all3, ' product =', P12 ** 3)
# brute force on d = 5 to confirm the structure
d = 5
cnt = {'12': 0, '12&13': 0, 'all': 0}
for a in range(d):
    for b in range(d):
        for c in range(d):
            if a == b: cnt['12'] += 1
            if a == b and a == c: cnt['12&13'] += 1; cnt['all'] += 1
print('d=5 brute force', {k: F(v, d ** 3) for k, v in cnt.items()})
# hash collisions
for bits, N in [(32, 77_163), (32, 100_000), (32, 10_000), (64, 100_000), (64, 10 ** 9)]:
    M = 2 ** bits
    pairs = N * (N - 1) / 2
    print(f"{bits}-bit, N={N}: 1-exp(-pairs/M) = {-math.expm1(-pairs / M):.4g}")
print('32-bit 50% at N ~', math.sqrt(2 * 2 ** 32 * math.log(2)))
# non-uniform birthdays raise P(share): example with mild seasonality
rng = np.random.default_rng(0)
w = 1 + 0.1 * np.cos(2 * np.pi * np.arange(365) / 365)
q = w / w.sum()
# exact P(no share) for non-uniform: elementary symmetric polynomial e_n(q) * n!
def p_none_nonuni(q, n):
    e = np.zeros(n + 1); e[0] = 1.0
    for x in q:
        e[1:] = e[1:] + x * e[:-1]
    return e[n] * math.factorial(n)
print('n=23 uniform P(share) =', 1 - p_none_nonuni(np.full(365, 1 / 365), 23))
print('n=23 seasonal +-10% P(share) =', 1 - p_none_nonuni(q, 23))
# incremental product vs factorial: overflow
try:
    float(math.factorial(365))
except OverflowError as e:
    print('float(365!) ->', type(e).__name__)
print('lgamma version n=23:', 1 - math.exp(math.lgamma(366) - math.lgamma(366 - 23) - 23 * math.log(365)))
