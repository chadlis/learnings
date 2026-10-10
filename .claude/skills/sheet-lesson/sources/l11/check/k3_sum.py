"""n3 : sum version numbers."""
import numpy as np
from scipy.stats import binom, norm, gamma
# 100 coins: P(X >= 60)
print('100 coins P(X>=60) exact', binom.sf(59, 100, .5), 'normal cc', norm.sf((59.5 - 50) / 5), 'no cc', norm.sf((60 - 50) / 5))
# 400 coins Brunton 16
print('400 coins P(190<=X<=230) exact', binom.cdf(230, 400, .5) - binom.cdf(189, 400, .5), 'naive', norm.cdf(3) - norm.cdf(-1), 'cc', norm.cdf(3.05) - norm.cdf(-1.05), 'terms', 230 - 190 + 1)
# 100 spams at 4/h: S ~ Gamma(100, scale 1/4) hours
G = gamma(a=100, scale=0.25)
print('spams mean', G.mean(), 'sd', G.std(), 'P(S>30) exact', G.sf(30), 'normal', norm.sf((30 - 25) / 2.5), 'P(S<20) exact', G.cdf(20), 'normal', norm.cdf(-2))
print('P(S>32.5) exact', G.sf(32.5), 'normal', norm.sf(3))
# test set: 1000 examples, error rate 0.128 -> errors ~ Bin(1000, .128)
n, p = 1000, 0.128
print('errors mean', n * p, 'var', n * p * (1 - p), 'sd', np.sqrt(n * p * (1 - p)))
print('P(errors>=150) exact', binom.sf(149, n, p), 'normal cc', norm.sf((149.5 - 128) / np.sqrt(n * p * (1 - p))))
# far tail of 100 dice with sf
sig = np.sqrt(35 / 12)
print('normal sf z for S100>=500 cc', norm.sf((499.5 - 350) / (10 * sig)))
# exponential sums: far right tail (normal underestimates)
G = gamma(a=100, scale=1)
for k in (2, 3, 4, 5):
    x = 100 + k * 10
    print(f'sum 100 Exp(1) P(S > mu+{k}sd) exact={G.sf(x):.3g} normal={norm.sf(k):.3g} ratio={G.sf(x)/norm.sf(k):.2f}  left exact={G.cdf(100-k*10):.3g}')
