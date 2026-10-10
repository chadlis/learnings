"""Checks for n5 (hypergeometric, quality control)."""
from math import comb
from fractions import Fraction as F
from scipy import stats

def hyp(k, N, K, n):
    return F(comb(K, k) * comb(N - K, n - k), comb(N, n))

N, K, n = 100, 5, 10
tot = 0
for k in range(0, 6):
    p = hyp(k, N, K, n); tot += p
    b = stats.binom.pmf(k, n, K / N)
    print(f"k={k} hyper={float(p):.6f} binom(10,0.05)={b:.6f} scipy={stats.hypergeom.pmf(k, N, K, n):.6f}")
print('sum =', tot)
print('P(at least 1) =', float(1 - hyp(0, N, K, n)))
print('E = nK/N =', n * K / N, ' scipy mean', stats.hypergeom.mean(N, K, n))
print('Var hyper', stats.hypergeom.var(N, K, n), ' binom var', n * 0.05 * 0.95)
# smallest sample with P(miss all) <= 5%, 1%
for thr in (0.5, 0.1, 0.05, 0.01):
    m = 1
    while float(hyp(0, N, K, m)) > thr:
        m += 1
    mb = 1
    while 0.95 ** mb > thr:
        mb += 1
    print(f"P(0) <= {thr}: hyper n={m} (P={float(hyp(0,N,K,m)):.4f}), binom n={mb}")
# tiny example N=5, K=2, n=2
print('tiny', [hyp(k, 5, 2, 2) for k in range(3)])
# poker: exactly 2 aces in 5 cards
p2 = F(comb(4, 2) * comb(48, 3), comb(52, 5))
print('2 aces:', p2, float(p2), comb(48, 3), comb(52, 5))
# label audit: 1000 examples, 50 mislabeled, reread 20 at random
pa = hyp(0, 1000, 50, 20)
print('audit 20 of 1000 with 50 bad: P(see none) =', float(pa), ' binom', 0.95 ** 20)
# sample-size slider values for the figure
for m in (1, 5, 10, 20, 30, 45, 50, 60):
    print(m, 'P0 hyper', round(float(hyp(0, N, K, m)), 4), 'binom', round(0.95 ** m, 4))
