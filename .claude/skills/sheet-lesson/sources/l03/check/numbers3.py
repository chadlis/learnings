"""Numbers proposed by the fresh-context review, checked before applying."""
from fractions import Fraction as F
odds = lambda p: p / (1 - p)
# 2: negative excludes, positive does not establish
LRp, LRm = F(9, 10) / F(5, 100), F(1, 10) / F(95, 100)
pm = odds(F(1, 100)) * LRm; pp = odds(F(1, 100)) * LRp
print('P(M|-)', float(pm / (1 + pm)), 'P(M|+)', float(pp / (1 + pp)), 'LR+', LRp, '1/LR-', float(1 / LRm), 'x15?', float(pp / (1 + pp) / F(1, 100)))
# 7
print('99:999 = 1:', 999 / 99)
# 9: P(no failure seen in 1000 systems) with q = 1e-3
q = 1e-3 + (1 - 1e-3) * 0.05**10
print('P(0 in 1000)', (1 - q)**1000, 'P(1)', 1000 * q * (1 - q)**999, 'P(2)', 1000 * 999 / 2 * q**2 * (1 - q)**998)
print('20000 systems: mean', 20000 * q, 'sd', (20000 * q * (1 - q))**0.5)
# 10c: sensitivity 1 at 1 % on 100 000, specificity 0.95
TP, FP = 1000, 99000 * 0.05; print('TP', TP, 'FP', FP, 'precision', TP / (TP + FP))
# 20: sampling noise
import math
sick = 2_000_000 * 0.001; p2 = 0.9075; print('c5 sd of two-test estimate ~', math.sqrt(p2 * (1 - p2) / (sick * 0.99**2 + 0.01**2 * 2_000_000 * 0.999)))
m = 4_000_000; print('c8 parallel sd rel', 1 / math.sqrt(m * 1e-4))
