"""n1 / n3 : exact law of the mean (sum) of n dice, by convolution; Kolmogorov distance to Phi."""
from fractions import Fraction as F
import numpy as np
from scipy.stats import norm

mu = F(7, 2); var = F(91, 6) - mu**2
print('die mu', mu, 'var', var, float(var), 'sigma', float(var)**.5)
sig = float(var)**.5

def law_sum(n, faces=6):
    p = np.zeros(1); p[0] = 1.0
    one = np.zeros(faces + 1); one[1:] = 1 / faces
    for _ in range(n):
        p = np.convolve(p, one)
    return p  # p[s] = P(S = s)

for n in (1, 2, 4, 10, 30, 100):
    print(f'n={n} SE={sig/np.sqrt(n):.4f}')

# Kolmogorov distance sup |F_n(z) - Phi(z)| for standardized mean of n dice
def kol(p, m, s):
    vals = np.arange(len(p)); keep = p > 0
    v = vals[keep]; q = p[keep]
    z = (v - m) / s
    Fz = np.cumsum(q)
    left = np.concatenate([[0], Fz[:-1]])
    return max(np.max(np.abs(Fz - norm.cdf(z))), np.max(np.abs(left - norm.cdf(z))))

print('--- dice Kolmogorov distance')
for n in (1, 2, 3, 4, 5, 10, 20, 30, 100):
    p = law_sum(n)
    print(n, round(kol(p, 3.5 * n, sig * np.sqrt(n)), 4))
print('--- coin (Bernoulli 1/2) Kolmogorov distance')
from scipy.stats import binom
for n in (1, 2, 4, 10, 30, 100):
    p = binom.pmf(np.arange(n + 1), n, .5)
    print(n, round(kol(p, n / 2, np.sqrt(n) / 2), 4), ' P(S=n/2)' if n % 2 == 0 else '', round(binom.pmf(n // 2, n, .5), 4) if n % 2 == 0 else '')

# share within +-1 SE and +-1.96 SE (inclusive) for mean of n dice
print('--- P(|Z|<=1), P(|Z|<=1.96) for n dice (inclusive)')
for n in (1, 2, 4, 10, 30, 100):
    p = law_sum(n); s = np.arange(len(p)); z = (s - 3.5 * n) / (sig * np.sqrt(n))
    print(n, round(p[np.abs(z) <= 1 + 1e-12].sum(), 4), round(p[np.abs(z) <= 1.96 + 1e-12].sum(), 4))
print('normal', round(norm.cdf(1) - norm.cdf(-1), 4), 0.95)

# mean of 4 dice: P(Xbar >= 4.5) i.e. S >= 18
p4 = law_sum(4)
e = p4[18:].sum(); print('n=4 P(S>=18)', e, round(e * 1296), '/1296')
print('normal no cc', 1 - norm.cdf((18 - 14) / (2 * sig)), 'cc', 1 - norm.cdf((17.5 - 14) / (2 * sig)))
# mean of 2 dice probabilities
p2 = law_sum(2); print('2 dice P(S=7)=', p2[7], '6/36')

# sum of 100 dice
p100 = law_sum(100)
for a in (380, 400, 450, 500):
    ex = p100[a:].sum()
    print(f'P(S100>={a}) exact={ex:.4g} normal_cc={1-norm.cdf((a-0.5-350)/(sig*10)):.4g} z={(a-0.5-350)/(sig*10):.3f}')
print('sd S100', sig * 10, 'rel width 0.488/sqrt(n)', sig / 3.5, sig / 3.5 / 10)
# P(Xbar100 > 3.8) exact and normal (chain values)
print('P(Xbar100>3.8) = P(S>380)', p100[381:].sum(), 'normal', 1 - norm.cdf(0.3 / (sig / 10)))
print('P(|Xbar100-3.5|>0.5)', p100[:300].sum() + p100[401:].sum())
