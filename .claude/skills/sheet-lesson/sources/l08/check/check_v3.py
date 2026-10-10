"""Checks for every number written in the l08 v3 delta."""
import math
from fractions import Fraction as Fr

ok = lambda c, m: print(('OK  ' if c else 'FAIL') + ' ' + m)

# 1. v7 : shares of the value 10 in sum |bars| on Z, k = 1..4 ; k=3 sum
for k in range(1, 5):
    L, R = 0.9 * (-1) ** k, 0.1 * 9 ** k
    print(f'k={k} left {L:.4g} right {R:.4g} sum {L+R:.4g} share10 {100*abs(R)/(abs(L)+abs(R)):.2f} %')
ok(round(-0.9 + 72.9, 6) == 72, 'k=3 : -0,9 + 72,9 = 72')
# {1,3} cancels at every odd k
ok(all(abs(0.5 * (-1) ** k + 0.5 * 1 ** k) < 1e-12 for k in (1, 3)), '{1,3} odd k cancel')

# 2. v5 : (x-3.5)^3 on a die : E = 0 = g(3.5) ; convex g -> g(EX) <= E g(X)
die = range(1, 7)
ok(sum(Fr(2 * x - 7, 2) ** 3 for x in die) / 6 == 0, 'E[(X-3,5)^3] = 0 = g(3,5)')
ok(Fr(7, 2) ** 2 < Fr(91, 6), 'x^2 : g(E) = 12,25 < 15,17 (blue dot left)')
ok(0 < Fr(35, 12), '(x-3,5)^2 : g(E) = 0 < 2,917 (blue dot left)')

# 8. v5 : faces pair up
for a, b in ((1, 6), (2, 5), (3, 4)):
    print(f'faces {a},{b} -> {(a-3.5)**2}, {(b-3.5)**2}')

# 3. v2 two bumps
two = [1.05, 1.37, 1.55, 1.70, 1.82, 1.94, 2.06, 2.18, 2.30, 2.45, 2.63, 2.95, 7.05, 7.37, 7.55, 7.70, 7.82, 7.94, 8.06, 8.18, 8.30, 8.45, 8.63, 8.95]
s = sorted(two); n = len(s)
print('two bumps : n', n, 'mean', round(sum(s) / n, 4), 'middle', s[n // 2 - 1], s[n // 2], 'median', (s[n // 2 - 1] + s[n // 2]) / 2)
for c in (2.95, 4.0, 7.05):
    print(f'  c={c} : P(X<=c)={sum(x <= c for x in s)}/{n}  P(X>=c)={sum(x >= c for x in s)}/{n}')

# 10. v2 wealth : mode with centred piles of width 0.5 vs median ; means
w = [0.36, 0.46, 0.53, 0.58, 0.63, 0.68, 0.72, 0.77, 0.81, 0.86, 0.90, 0.95, 1.00, 1.05, 1.11, 1.17, 1.23, 1.30, 1.38, 1.47, 1.58, 1.72, 1.90, 2.18, 2.79]
F = [11, 13.5, 16, 18.5]
def jsround(x):  # Math.round
    return math.floor(x + 0.5)
for f in range(5):
    v = w + F[:f]; sv = sorted(v); m = len(v)
    med = sv[(m - 1) // 2] if m % 2 else (sv[m // 2 - 1] + sv[m // 2]) / 2
    bins = {}
    for x in v:
        bins.setdefault(jsround(x / 0.5), []).append(x)
    top = max(len(b) for b in bins.values())
    modes = sorted(k * 0.5 for k, b in bins.items() if len(b) == top)
    print(f'wealth f={f} : n {m} mean {sum(v)/m:.3f} median {med} mode(s) {modes} (pile size {top})')

# 9. v9 : temperatures, each 1/3
C = [10, 15, 20]; mu = sum(C) / 3; var = sum((c - mu) ** 2 for c in C) / 3
print('v9 var', round(var, 4), 'x3,24', round(var * 1.8 ** 2, 4), '1,8^2', 1.8 ** 2)

# 4. v10 : m = 2, sigma = 1.3
m, sg = 2, 1.3
ok(abs(0.5 * m - 1) < 1e-12, '1/2 m = 1 when m = 2')
print('3/2 m sigma^2 =', round(1.5 * m * sg ** 2, 4), ' 3 sigma^2 =', round(3 * sg ** 2, 4))

# 5. n9 : X = Y = 1 constants
for a, b in ((1, 1), (2, 3), (-1, 4)):
    X = Y = 1
    print(f'a={a} b={b} : Var(aX+bY) = Var({a*X+b*Y}) = 0 ; a2*0+b2*0+2ab E[XY] = {2*a*b*X*Y}')

# 13. n8 : log-normal ln T ~ N(0, ln 2)
s2 = math.log(2)
mean = math.exp(s2 / 2); sd = math.sqrt((math.exp(s2) - 1) * math.exp(s2))
print('lognormal N(0, ln2) : mean', round(mean, 4), 'sd', round(sd, 4), 'sqrt2', round(math.sqrt(2), 4))

# 11. v6 : r = min(9, 0.4 R), R = 45 d
for d in (0.25, 0.5, 1, 2):
    R = 45 * d; r = min(9, 0.4 * R)
    print(f'v6 d={d} R={R} r={r} gap between masses {2*R-2*r:.2f} px, arrow {0.5*R:.2f} px, centre dot r=4')
