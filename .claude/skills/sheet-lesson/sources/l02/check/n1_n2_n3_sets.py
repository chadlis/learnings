"""Checks for n1 (sets), n2 (axioms), n3 (inclusion-exclusion)."""
from fractions import Fraction as F
from itertools import product

# n1 : three flips (Brunton 04), H = heads (face), T = tails (pile)
Om = {''.join(p) for p in product('HT', repeat=3)}
A = {w for w in Om if w[0] == 'H'}
B = {w for w in Om if w[1] == 'T'}
print('Omega', sorted(Om), len(Om))
print('A', sorted(A), 'B', sorted(B))
print('A|B', sorted(A | B), len(A | B))
print('A&B', sorted(A & B), len(A & B))
print('Ac', sorted(Om - A))
print('P(A&B) =', F(len(A & B), 8), ' P(A)P(B) =', F(4, 8) * F(4, 8))
# 2x4 grid layout: row = first flip, column = flips 2-3
cols = ['HH', 'HT', 'TH', 'TT']
for r in 'HT':
    print(' '.join(r + c for c in cols))
# two flips grid
Om2 = {''.join(p) for p in product('HT', repeat=2)}
A2 = {w for w in Om2 if w[0] == 'H'}; B2 = {w for w in Om2 if w[1] == 'T'}
print('2 flips: P(A&B)', F(len(A2 & B2), 4), 'P(A|B)', F(len(A2 | B2), 4), 'P(Ac)', F(len(Om2 - A2), 4))

# die example
D = set(range(1, 7)); Ev = {2, 4, 6}; G = {4, 5, 6}
print('die: union', sorted(Ev | G), 'inter', sorted(Ev & G), 'Ac', sorted(D - Ev))
print('De Morgan: (A|B)^c =', sorted(D - (Ev | G)), ' Ac & Bc =', sorted((D - Ev) & (D - G)))
print('(A&B)^c =', sorted(D - (Ev & G)), ' Ac | Bc =', sorted((D - Ev) | (D - G)))
print('number of events for 3 flips: 2^8 =', 2 ** 8)

# n2 : biased coin
print('biased coin P(T) = 1 - 0.7 =', round(1 - 0.7, 10))
# figure 1 values: P(A) = 0.3, P(B) = 0.5 with A inside B
pa, pb = 0.3, 0.5
print('P(Ac) =', 1 - pa, ' P(B\\A) =', round(pb - pa, 10))

# n3 : inclusion-exclusion
print('die even or >=4:', F(3, 6) + F(3, 6) - F(2, 6), '=', F(len(Ev | G), 6))
hearts_or_king = F(13, 52) + F(4, 52) - F(1, 52)
print('heart or king:', hearts_or_king, float(hearts_or_king))
# brute-force check on a deck
deck = [(r, s) for r in range(13) for s in range(4)]
hk = [c for c in deck if c[1] == 0 or c[0] == 12]
print('brute force:', len(hk), '/52')
print('3 flips: 4/8+4/8-2/8 =', F(4, 8) + F(4, 8) - F(2, 8))
# two models: errors 0.10 and 0.08, both wrong 0.05
pa, pb, pab = 0.10, 0.08, 0.05
print('at least one model wrong:', round(pa + pb - pab, 10), ' none:', round(1 - (pa + pb - pab), 10),
      ' if independent both wrong:', round(pa * pb, 10), ' bound:', pa + pb)
# three dice, at least one six
ie = 3 * F(1, 6) - 3 * F(1, 36) + F(1, 216)
print('3 dice at least one 6, IE:', ie, float(ie), ' complement:', 1 - F(5, 6) ** 3)
# brute force
cnt = sum(1 for t in product(range(1, 7), repeat=3) if 6 in t)
print('brute force:', cnt, '/216')
# union bound for 40 tests at 5%
print('Bonferroni bound 40*0.05 =', 40 * 0.05, ' exact if independent 1-0.95^40 =', round(1 - 0.95 ** 40, 4))
print('20 tests: bound', 20 * 0.05, ' exact indep', round(1 - 0.95 ** 20, 4))
