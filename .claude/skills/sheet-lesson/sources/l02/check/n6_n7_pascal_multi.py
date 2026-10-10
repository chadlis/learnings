"""Checks for n6 (binomial theorem, Pascal, Galton) and n7 (multinomial coefficient)."""
from math import comb, factorial, sqrt, exp, pi
from itertools import permutations, product, combinations
from collections import Counter
import sympy as sp

x, y = sp.symbols('x y')
for n in range(0, 6):
    print(n, sp.expand((x + y) ** n), [comb(n, k) for k in range(n + 1)], 2 ** n)
# Galton, 10 rows
n = 10
row = [comb(n, k) for k in range(n + 1)]
print('row10', row, sum(row))
print('P(center) =', row[5], '/1024 =', row[5] / 1024, ' P(edge) =', 1 / 1024)
mu, sd = n / 2, sqrt(n) / 2
print('mu', mu, 'sd', sd, ' normal approx at center', 1 / (sd * sqrt(2 * pi)))
# P(|K - 5| <= 1) for 10 rows
print('P(4<=K<=6) =', sum(row[4:7]) / 1024)
for n in (6, 8, 12, 14, 20):
    print(n, 'center', comb(n, n // 2) / 2 ** n)
print('row 100 max coefficient', comb(100, 50), '~', float(comb(100, 50)))
print('C(52,5) =', comb(52, 5))

# n7 multinomial
def multi(*ns):
    r = factorial(sum(ns))
    for k in ns:
        r //= factorial(k)
    return r
print('7 -> 2,3,2:', multi(2, 3, 2), ' C(7,2)C(5,3)C(2,2) =', comb(7, 2) * comb(5, 3) * comb(2, 2), ' /2! =', multi(2, 3, 2) // 2)
# brute force: labeled assignment of 7 people to groups with sizes 2,3,2
labels = 'aabbbcc'
assign = set(permutations(labels))
print('brute force labeled:', len(assign))
unl = set()
for a in assign:
    g = {}
    for i, l in enumerate(a):
        g.setdefault(l, []).append(i)
    unl.add(frozenset([tuple(g['b'])]) | frozenset([frozenset([tuple(g['a']), tuple(g['c'])])]))
print('brute force with the two pairs interchangeable:', len(unl))
print('8 -> 2,3,3:', multi(2, 3, 3), ' unlabeled 3s:', multi(2, 3, 3) // 2)
print('7!/(2!3!3!) =', factorial(7) / (2 * 6 * 6), ' (sizes sum to 8, invalid)')
print('spades 52!/(13!)^4 =', multi(13, 13, 13, 13), '%.3e' % multi(13, 13, 13, 13))
print('two hands + rest 52!/(5!5!42!) =', multi(5, 5, 42), ' = C(52,5)C(47,5) =', comb(52, 5) * comb(47, 5))
for m in (2, 3, 4, 5):
    print('pairings of', 2 * m, ':', factorial(2 * m) // (2 ** m * factorial(m)))
# brute-force pairings of 6
def pairings(s):
    if not s:
        return 1
    a = s[0]
    return sum(pairings([z for z in s if z not in (a, b)]) for b in s[1:])
print('brute force pairings of 6:', pairings(list(range(6))))
# multinomial law: die rolled 6 times, each face once
p = factorial(6) / 6 ** 6
print('each face once in 6 rolls:', factorial(6), '/', 6 ** 6, '=', p)
# multinomial theorem check
z = sp.symbols('z')
print(sp.Poly(sp.expand((x + y + z) ** 4), x, y, z).coeff_monomial(x ** 2 * y * z), multi(2, 1, 1))
print('4 -> 2,2 :', multi(2, 2))
