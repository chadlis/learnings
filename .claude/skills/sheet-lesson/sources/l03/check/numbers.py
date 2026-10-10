"""Every number quoted in lesson l03, recomputed (exact fractions where possible)."""
from fractions import Fraction as F
from itertools import product

def p(x, d=4): return round(float(x), d)
print('== n1 conditioning')
print('spade|black', F(13, 52) / F(26, 52), 'spade|red', 0)
dice = list(product(range(1, 7), repeat=2))
def P(ev, cond=lambda w: True):
    om = [w for w in dice if cond(w)]
    return F(sum(ev(w) for w in om), len(om))
A = lambda w: w[0] == 3
print('first=3|second=5', P(A, lambda w: w[1] == 5), 'first=3|sum=6', P(A, lambda w: sum(w) == 6),
      'first=3|sum=7', P(A, lambda w: sum(w) == 7))
print('#sum=6', sum(sum(w) == 6 for w in dice))
# Brunton 08 study
print('P(+) sample', F(550, 1000), 'sens', F(450, 500), 'spec', F(400, 500), 'P(C|+) sample', F(450, 550), p(F(450, 550), 3))
print('P(+|C)/P(C|+) at 1% prev (chain)', F(900, 1000), p(F(900, 5850), 4), 'ratio', F(5850, 1000))
print('spade|three', F(1, 52) / F(4, 52))

print('== n2 multiplication')
two = F(13, 52) * F(12, 51); print('two spades w/o repl', two, p(two, 4), 'with repl', F(1, 16), p(F(1, 16), 4))
three = F(13, 52) * F(12, 51) * F(11, 50); print('three spades', three, p(three, 5))
tree = {'SS': F(13, 52) * F(12, 51), 'SN': F(13, 52) * F(39, 51), 'NS': F(39, 52) * F(13, 51), 'NN': F(39, 52) * F(38, 51)}
print({k: (v, p(v, 4)) for k, v in tree.items()}, 'sum', sum(tree.values()))
print('P(2nd spade) = ', tree['SS'] + tree['NS'])
print('cancer study P(C and +)', F(1, 2) * F(9, 10), 'chain P(M and +)', F(1, 100) * F(9, 10))

print('== n3 total probability')
print('red', F(1, 4) * 1 + F(1, 4) * 1 + 0 + 0)
pp = F(9, 10) * F(1, 100) + F(5, 100) * F(99, 100); print('P(+) chain', pp, p(pp, 4), 'ratio paths', F(5, 100) * F(99, 100) / (F(9, 10) * F(1, 100)))
pc = F(99, 100) * F(1, 1000) + F(1, 100) * F(999, 1000); print('P(+) cancer B10', pc, p(pc, 5))
print('drug1 P(+)', F(9, 10) * F(1, 10) + F(1, 10) * F(9, 10), 'drug2', F(9, 10) * F(1, 10) + F(2, 10) * F(9, 10))
err = F(2, 100) * F(95, 100) + F(30, 100) * F(5, 100); print('ML overall error', err, p(err, 4), 'unweighted mean', p((F(2, 100) + F(30, 100)) / 2, 3))
print('prev 10% P(+)', F(9, 10) * F(1, 10) + F(5, 100) * F(9, 10))

print('== n4 Bayes')
def ppv(pr, se, sp): return se * pr / (se * pr + (1 - sp) * (1 - pr))
print('cancer', ppv(F(1, 1000), F(99, 100), F(99, 100)), p(ppv(F(1, 1000), F(99, 100), F(99, 100)), 4), '99/(99+999)', p(F(99, 1098), 4))
print('drug1', ppv(F(1, 10), F(9, 10), F(9, 10)), 'drug2', ppv(F(1, 10), F(9, 10), F(8, 10)))
print('chain 1%', ppv(F(1, 100), F(9, 10), F(95, 100)), p(ppv(F(1, 100), F(9, 10), F(95, 100)), 4), 'P(notM|+)', p(1 - ppv(F(1, 100), F(9, 10), F(95, 100)), 4))
print('chain 10%', ppv(F(1, 10), F(9, 10), F(95, 100)), p(ppv(F(1, 10), F(9, 10), F(95, 100)), 4))
print('B08 test (0.9/0.8) at 1%', p(ppv(F(1, 100), F(9, 10), F(8, 10)), 4), 'at 50%', ppv(F(1, 2), F(9, 10), F(8, 10)))
print('counterfactual 99% at 50%', ppv(F(1, 2), F(99, 100), F(99, 100)))
# spam
ps, ws, wh = F(2, 10), F(4, 10), F(2, 100)
post = ws * ps / (ws * ps + wh * (1 - ps)); print('spam|gratuit', post, p(post, 4), 'P(gratuit)', ws * ps + wh * (1 - ps))
# second word, cond. indep.
w2s, w2h = F(3, 10), F(5, 100)
post2 = ws * w2s * ps / (ws * w2s * ps + wh * w2h * (1 - ps)); print('spam|gratuit,offre', post2, p(post2, 4))
print('counts 100000 cancer', 100, 99, 99900, F(99900, 100), 999, 'pos', 99 + 999)
print('drug counts per 1000: users 100 TP 90; non 900 FP', 90, 'setup2 FP', 180)
print('multiplied belief chain', p(ppv(F(1, 100), F(9, 10), F(95, 100)) / F(1, 100), 2))
print('B10 91%', p(1 - F(99, 1098), 3))

print('== n5 odds')
def odds(q): return q / (1 - q)
def prob(o): return o / (1 + o)
for name, pr, se, sp in [('cancer', F(1, 1000), F(99, 100), F(99, 100)), ('drug1', F(1, 10), F(9, 10), F(9, 10)), ('drug2', F(1, 10), F(9, 10), F(8, 10)), ('chain', F(1, 100), F(9, 10), F(95, 100))]:
    LR = se / (1 - sp); o0 = odds(pr); o1 = o0 * LR; o2 = o1 * LR; o3 = o2 * LR
    print(name, 'LR+', LR, 'o0', o0, 'o1', o1, p(o1, 4), 'p1', p(prob(o1), 4), 'o2', o2, p(o2, 3), 'p2', p(prob(o2), 4), 'p3', p(prob(o3), 5))
LRm = F(1, 10) / F(95, 100); om = odds(F(1, 100)) * LRm
print('LR- chain', LRm, p(LRm, 4), 'odds', om, '1:', p(1 / om, 1), 'P(M|-)', p(prob(om), 5), 'NPV', p(1 - prob(om), 4))
print('cancer counts 10M: sick', 10_000, 'TP1', 9_900, 'TP2', 9_801, 'healthy', 9_990_000, 'FP1', 99_900, 'FP2', 999, 'p2', p(F(9801, 9801 + 999), 4))
print('drug1 counts 1000: 100/900 -> 90/90 -> 81/9', p(F(81, 90), 3), 'drug2 100/900 -> 90/180 -> 81/36', p(F(81, 117), 4))
print('doubling table')
for q in [F(1, 100), F(5, 100), F(1, 10), F(2, 10), F(1, 3), F(1, 2), F(2, 3), F(9, 10)]:
    o = odds(q); q2 = prob(2 * o)
    print(f'  p={float(q):.4f} odds={float(o):.4f} 2*odds={float(2*o):.4f} p\'={float(q2):.4f} ratio={float(q2/q):.3f}')
print('cote 1 contre 9 ->', F(1, 10))

print('== n6 metrics')
for pr in [F(1, 100), F(1, 10), F(3, 10), F(1, 2)]:
    se, sp = F(9, 10), F(95, 100)
    N = 100000; cas = N * pr; TP = cas * se; FN = cas - TP; FP = (N - cas) * (1 - sp); TN = N - cas - FP
    prec = TP / (TP + FP); rec = se; f1 = 2 * prec * rec / (prec + rec); npv = TN / (TN + FN); acc = (TP + TN) / N
    print(f'prev {float(pr)}: TP {TP} FN {FN} FP {FP} TN {TN} prec {float(prec):.4f} F1 {float(f1):.4f} NPV {float(npv):.4f} acc {float(acc):.4f}')
print('bascule 50%', F(5, 100) / (F(9, 10) + F(5, 100)), p(F(5, 100) / (F(9, 10) + F(5, 100)), 4))
print('always positive prec = prev 10%; always negative acc at 1%', 1 - F(1, 100), 'at 0.1%', 1 - F(1, 1000))
print('drug2 accuracy', F(1, 10) * F(9, 10) + F(9, 10) * F(8, 10))
print('balanced 50% prec', p(ppv(F(1, 2), F(9, 10), F(95, 100)), 4))
print('spec 0.999 at 1%', p(ppv(F(1, 100), F(9, 10), F(999, 1000)), 4))
for pr in [F(1, 100), F(1, 10), F(1, 2)]:
    se, sp = F(9, 10), F(95, 100)
    print('  v6 counts on 10000 prev', pr, 'TP', 10000 * pr * se, 'FN', 10000 * pr * (1 - se), 'FP', 10000 * (1 - pr) * (1 - sp), 'TN', 10000 * (1 - pr) * sp,
          'acc', p(pr * se + (1 - pr) * sp, 4))
print('always + at 1%: prec', F(1, 100), 'recall 1, spec 0, acc', F(1, 100), '; always -: acc', F(99, 100), 'recall 0')

print('== n7 independence (cards)')
for nm, b in [('queen', 4), ('three', 4), ('figure JQK', 12), ('black', 26), ('heart', 13)]:
    inter = {'queen': 1, 'three': 1, 'figure JQK': 3, 'black': 13, 'heart': 0}[nm]
    print(nm, 'P(B)', F(b, 52), 'P(A and B)', F(inter, 52), 'P(A)P(B)', F(13, 52) * F(b, 52), 'P(A|B)', F(inter, b))
print('queen of spades', F(1, 4) * F(1, 13), p(F(1, 52), 4))
print('dice: first=3 & sum=6', F(1, 36), 'vs product', F(1, 6) * F(5, 36), '; sum=7', F(1, 36), F(1, 6) * F(6, 36))
print('spade & heart: 0 vs', F(1, 4) * F(1, 4))

print('== n8 series/parallel')
for n, q in [(10, 0.05), (3, 0.01), (100, 0.01), (10, 0.01)]:
    print(f'n={n} p={q}: series success {(1-q)**n:.4f} fail {1-(1-q)**n:.4f}; parallel fail {q**n:.3e}')
print('3 drives 1% common cause 1e-3:', 1e-3 + (1 - 1e-3) * 0.01 ** 3, 'ratio', (1e-3 + (1 - 1e-3) * 0.01 ** 3) / 1e-6)
print('pipeline 10 stages 95%', 0.95 ** 10, '20 stages', 0.95 ** 20)
print('n=2 p=0.05 series fail', 1 - 0.95 ** 2, 'parallel', 0.05 ** 2)
for n in range(1, 11):
    print(f'  n={n} series {1-0.95**n:.4f} parallel {0.05**n:.3e} parallel+cc(1e-3) {1e-3+(1-1e-3)*0.05**n:.3e}')

print('== n9 pairwise vs mutual')
coins = list(product('HT', repeat=2))
def Pc(ev): return F(sum(ev(w) for w in coins), 4)
a = lambda w: w[0] == 'H'; b = lambda w: w[1] == 'H'; c = lambda w: w[0] == w[1]
print('P(A),P(B),P(C)', Pc(a), Pc(b), Pc(c))
print('AB', Pc(lambda w: a(w) and b(w)), 'AC', Pc(lambda w: a(w) and c(w)), 'BC', Pc(lambda w: b(w) and c(w)), 'ABC', Pc(lambda w: a(w) and b(w) and c(w)), 'product', F(1, 8))
print('P(C|A and B)', Pc(lambda w: a(w) and b(w) and c(w)) / Pc(lambda w: a(w) and b(w)))
# dice parity version
ea = lambda w: w[0] % 2 == 0; eb = lambda w: w[1] % 2 == 0; ec = lambda w: sum(w) % 2 == 0
Pd = lambda ev: F(sum(ev(w) for w in dice), 36)
print('dice parity', Pd(ea), Pd(eb), Pd(ec), Pd(lambda w: ea(w) and eb(w)), Pd(lambda w: ea(w) and ec(w)), Pd(lambda w: eb(w) and ec(w)), Pd(lambda w: ea(w) and eb(w) and ec(w)))
# triple product without pairwise
A1 = lambda w: w[0] in (1, 2, 3); B1 = lambda w: w[0] in (3, 4, 5); C1 = lambda w: sum(w) == 9
print('triple-only:', Pd(A1), Pd(B1), Pd(C1), 'ABC', Pd(lambda w: A1(w) and B1(w) and C1(w)), 'prod', Pd(A1) * Pd(B1) * Pd(C1),
      'AB', Pd(lambda w: A1(w) and B1(w)), 'vs', Pd(A1) * Pd(B1), 'AC', Pd(lambda w: A1(w) and C1(w)), 'vs', Pd(A1) * Pd(C1), 'BC', Pd(lambda w: B1(w) and C1(w)), 'vs', Pd(B1) * Pd(C1))
print('conditions for n events: 2^n - n - 1 ->', [2 ** n - n - 1 for n in (2, 3, 4, 10)])
