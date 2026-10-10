"""Extra checks: Cantelli two-point law, ratios quoted in the text."""
import math
from fractions import Fraction as F
k = 2
p = F(1, 1 + k * k)                  # mass at mu + k sigma
q = 1 - p                            # mass at mu - sigma/k
mean = p * k - q * F(1, k)
var = p * k * k + q * F(1, k * k)
print('Cantelli law k=2: p', p, 'mean', mean, 'var', var)
print('Chebyshev / exact ratio n=100 (>=):', 0.11666666666666665 / 0.003646048616177652)
print('expo a=20 bound/true:', 0.5 / math.exp(-2))
print('normal k=2 bound/true:', 0.25 / 0.0455)
print('sd of sum of 1000 dice / SE mean:', 54.006 / 0.054006)
print('n=100 Chebyshev sigma^2/(n eps^2) eps=.1, n=1000:', 35 / 12 / (1000 * 0.01))
print('cost x4 per halving: 250*4**3 =', 250 * 4 ** 3)
print('ratio 0.505 vs 0.55 gain', 0.55 - 0.505, '100->inf', 0.505 - 0.5)
