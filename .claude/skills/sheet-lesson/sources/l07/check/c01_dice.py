"""Two dice: joint table, events, margins; first die X and maximum M."""
from fractions import Fraction as F
import itertools

cells = list(itertools.product(range(1, 7), range(1, 7)))
p = F(1, 36)
ev = {
    'X+Y=7': [c for c in cells if sum(c) == 7],
    'X>Y': [c for c in cells if c[0] > c[1]],
    'X=Y': [c for c in cells if c[0] == c[1]],
    'X<=2 and Y>=5': [c for c in cells if c[0] <= 2 and c[1] >= 5],
}
for k, v in ev.items():
    print(k, len(v), len(v) * p, float(len(v) * p))
print('P(X<=2)P(Y>=5) =', F(2, 6) * F(2, 6))

# (X, M) with M = max(X, Y)
J = {}
for x, y in cells:
    m = max(x, y)
    J[(x, m)] = J.get((x, m), 0) + p
print('joint (X, M), rows x, cols m (in /36):')
for x in range(1, 7):
    print(x, [int(J.get((x, m), 0) * 36) for m in range(1, 7)], 'row sum', sum(J.get((x, m), 0) for m in range(1, 7)))
PM = {m: sum(J.get((x, m), 0) for x in range(1, 7)) for m in range(1, 7)}
print('P(M=m) in /36:', [int(PM[m] * 36) for m in range(1, 7)], '== 2m-1:', all(PM[m] * 36 == 2 * m - 1 for m in PM))
EM = sum(m * PM[m] for m in PM)
print('E[M] =', EM, float(EM))
# conditional M | X = 2
row = {m: J.get((2, m), 0) for m in range(1, 7)}
PX2 = sum(row.values())
print('P(X=2) =', PX2, ' M | X=2:', {m: row[m] / PX2 for m in row})
# conditional X | M = 2 and Bayes
print('P(X=2 | M=2) direct =', J[(2, 2)] / PM[2])
pM2gX2 = row[2] / PX2
print('Bayes: P(M=2|X=2) P(X=2) / P(M=2) =', pM2gX2 * F(1, 6) / PM[2])
# independence check
print('P(X=1, M=1) =', J[(1, 1)], ' P(X=1)P(M=1) =', F(1, 6) * PM[1])
print('P(X=6, M=6) =', J[(6, 6)], ' P(X=6)P(M=6) =', F(1, 6) * PM[6], float(F(1, 6) * PM[6]))
# any cell equal to product?
eq = [(x, m) for x in range(1, 7) for m in range(1, 7) if J.get((x, m), 0) == F(1, 6) * PM[m]]
print('cells where joint == product:', eq)
# two coins
print('two coins: 4 cells of', F(1, 4))
# M | X = 5
row5 = {m: J.get((5, m), 0) * 6 for m in range(1, 7)}
print('M | X=5:', row5)
