"""Exact checks for every number of lesson l09 (fractions where possible)."""
from fractions import Fraction as F
import numpy as np, math, itertools

def cov(pts, probs=None):
    n = len(pts)
    probs = probs or [F(1, n)] * n
    mx = sum(p * x for (x, y), p in zip(pts, probs))
    my = sum(p * y for (x, y), p in zip(pts, probs))
    c = sum(p * (x - mx) * (y - my) for (x, y), p in zip(pts, probs))
    vx = sum(p * (x - mx) ** 2 for (x, y), p in zip(pts, probs))
    vy = sum(p * (y - my) ** 2 for (x, y), p in zip(pts, probs))
    exy = sum(p * x * y for (x, y), p in zip(pts, probs))
    return dict(mx=mx, my=my, cov=c, vx=vx, vy=vy, exy=exy, rho=float(c) / math.sqrt(vx * vy) if vx * vy else None)

print('=== n1: four-point cloud')
P4 = [(1, 1), (2, 3), (3, 2), (4, 4)]
r = cov(P4); print(r)
mx, my = r['mx'], r['my']
print('products', [(x - mx) * (y - my) for x, y in P4])
print('E[XY] - E[X]E[Y] =', r['exy'] - mx * my, ' sigma =', math.sqrt(r['vx']))
print('inches x12 both:', cov([(12 * x, 12 * y) for x, y in P4]))
print('Y x(-1):', cov([(x, -y) for x, y in P4])['rho'])
print('X+10:', cov([(x + 10, y) for x, y in P4])['cov'])

print('=== n1/n2: dice couplings')
D = range(1, 7)
ind = cov([(x, y) for x in D for y in D])
same = cov([(x, x) for x in D])
anti = cov([(x, 7 - x) for x in D])
print('indep', ind['cov'], 'Y=X', same['cov'], float(same['cov']), 'Y=7-X', anti['cov'])
print('E[XY]', float(ind['exy']), float(same['exy']), float(anti['exy']))
v = F(35, 12)
print('Var die', v, float(v), math.sqrt(v))
for name, c in (('indep', 0), ('Y=X', v), ('Y=7-X', -v)):
    print(name, 'Var(X+Y)=', float(2 * v + 2 * c), 'sd', math.sqrt(2 * v + 2 * c), ' Var(X-Y)=', float(2 * v - 2 * c))
print('10 dice', float(10 * v), ' 10X', float(100 * v))
print('Var(2X - Y) indep', float(4 * v + v))

print('=== shared component A,B,C indep var 1: X=A+B, Y=A+C')
print('Cov=VarA=1, VarX=2, rho=0.5')

print('=== n2: constants test')
a, b = 2, 3
print('Var(a*1+b*1)=0 ; wrong formula gives 2ab*E[XY]=', 2 * a * b)

print('=== n2 fig: different laws, uniform on {1..k}')
ks = [2, 4, 6, 8, 10, 12]
vs = [F(k * k - 1, 12) for k in ks]
print([round(float(x), 4) for x in vs], 'cumsum', [round(float(sum(vs[:i + 1])), 3) for i in range(6)])
for n in range(1, 7):
    print('n', n, 'iid', round(float(n * v), 3), ' rho .5', round(float(n * v + n * (n - 1) * F(1, 2) * v), 3))

print('=== n3: X unif {-1,0,1}, Y=X^2')
P3 = [(-1, 1), (0, 0), (1, 1)]
r3 = cov(P3); print(r3)
print('products', [(x - r3['mx']) * (y - r3['my']) for x, y in P3])
# Var(X+Y)
s = [x + y for x, y in P3]; ms = sum(s) / F(3); print('Var(X+Y)', sum((t - ms) ** 2 for t in s) / 3, 'vs', r3['vx'] + r3['vy'])
print('Cov(X^2, Y) = Var Y =', r3['vy'])
# joint table vs product
for x in (-1, 0, 1):
    for y in (0, 1):
        pj = F(1, 3) if y == x * x else F(0)
        px = F(1, 3); py = F(1, 3) if y == 0 else F(2, 3)
        print(f'  x={x} y={y} joint={pj} product={px * py}')
# half parabola X~U[0,1], Y=X^2
c = F(1, 4) - F(1, 2) * F(1, 3); vx = F(1, 12); vy = F(1, 5) - F(1, 9)
print('half parabola cov', c, float(c), 'rho', float(c) / math.sqrt(vx * vy))
# full parabola U[-1,1]: E[X^3]=0
print('full parabola cov 0 ; circle cov 0')

print('=== n4: R^2 = rho^2 on p05-01 five points')
x = np.array([1, 2, 3, 4, 5.]); y = np.array([2, 4, 5, 4, 5.])
rho = np.corrcoef(x, y)[0, 1]; print('rho', rho, 'rho^2', rho ** 2)
print('VIF rho=.9', 1 / (1 - .81), 'rho=.5', 1 / (1 - .25))

print('=== n5: rotated ellipse')
def sig(s1, s2, th):
    t = math.radians(th); R = np.array([[math.cos(t), -math.sin(t)], [math.sin(t), math.cos(t)]])
    return R @ np.diag([s1 ** 2, s2 ** 2]) @ R.T
for s1, s2, th in ((1, 1, 0), (1, 1, 45), (2, 1, 0), (2, 1, 45), (2, 1, 30), (2, 1, 90), (2, 1, -45), (2, 1, 135)):
    S = sig(s1, s2, th); rho = S[0, 1] / math.sqrt(S[0, 0] * S[1, 1])
    print(s1, s2, th, np.round(S, 4).tolist(), 'rho', round(rho, 4), 'slope Y|X', round(S[0, 1] / S[0, 0], 4))
print('density at 0, sigma 1,1 rho 0:', 1 / (2 * math.pi))

print('=== n6: shared test set')
n = 1000; pA, pB = F(872, 1000), F(901, 1000); b, c = F(10, 1000), F(39, 1000)
pAB = pA - b; both_wrong = 1 - pAB - b - c
print('P(both right)', pAB, float(pAB), 'P(both wrong)', float(both_wrong), 'check pB', pAB + c)
cAB = pAB - pA * pB; vA = pA * (1 - pA); vB = pB * (1 - pB)
print('Cov(Ai,Bi)', float(cAB), 'VarA', float(vA), 'VarB', float(vB), 'rho', float(cAB) / math.sqrt(vA * vB))
vd = vA + vB - 2 * cAB; print('Var(Bi-Ai)', float(vd), ' = P(disc) - D^2 =', float(b + c - (c - b) ** 2))
se_p = math.sqrt(vd / n); se_u = math.sqrt((vA + vB) / n)
print('SE paired', se_p, 'unpaired', se_u, 'ratio', se_u / se_p, 'var ratio', float((vA + vB) / vd))
D = float(pB - pA); print('D', D, 'z paired', D / se_p, 'z unpaired', D / se_u)
print('same model twice, separate sets sd', math.sqrt(2 * float(vA) / n))
print('Cov(pA_hat,pB_hat)', float(cAB) / n)
print('95% half-width paired', 1.96 * se_p, 'unpaired', 1.96 * se_u)
