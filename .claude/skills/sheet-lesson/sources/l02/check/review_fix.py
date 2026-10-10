"""Checks for the fresh-context review corrections (10/10/2026)."""
import math, sys, warnings
import numpy as np
from math import factorial, comb
# 3. overflow claims
print('log10(365!) =', math.lgamma(366) / math.log(10))
print('max float =', sys.float_info.max)
try:
    math.gamma(366); print('gamma ok?!')
except OverflowError as e:
    print('math.gamma(366) -> OverflowError')
with warnings.catch_warnings():
    warnings.simplefilter('ignore')
    print('np.prod(1..365 float) =', np.prod(np.arange(1, 366, dtype=float)))
print('exact ints: factorial(365)/(factorial(342)*365**23) =', factorial(365) / (factorial(342) * 365 ** 23))
# 4. bound at 23 and 22
print('253/365 =', f'{253/365:.6f}', ' ln 2 =', f'{math.log(2):.6f}', ' exp(-253/365) =', f'{math.exp(-253/365):.6f}')
q = 1.0
for k in range(22): q *= (365 - k) / 365
print('exact P(none) n=22 =', f'{q:.4f}', ' bound exp(-231/365) =', f'{math.exp(-231/365):.4f}')
# 10. gaps and the "my birthday" curve crossing 1/2
def ex(n):
    q = 1.0
    for k in range(n): q *= (365 - k) / 365
    return 1 - q
for n in (23, 34):
    print(n, 'gap', f'{ex(n) - (1 - (364/365) ** (n*(n-1)/2)):.4f}')
n = 2
while 1 - (364/365) ** (n - 1) <= 0.5: n += 1
print('my-birthday curve first above 1/2 at n =', n, '(others =', n - 1, ')', 1 - (364/365) ** (n - 1))
print('at n = 80:', 1 - (364/365) ** 79)
