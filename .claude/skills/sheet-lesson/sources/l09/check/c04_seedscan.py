"""Pick fixed seeds whose initial readouts are representative of the theory (the seed is arbitrary)."""
import math
from c03_jsrng import rng, gauss, stats2, cloud, sd1
def best(cands, score, k=3): return sorted(cands, key=score)[:k]
# v1 clouds: theory (2.1789, 0.861rho?), (1.1667), (0)
for s1, s2, deg in ((2.2, .45, 35), (2.2, 1.1, 20), (1.4, 1.4, 0)):
    t = math.radians(deg); th = (s1**2 - s2**2) * math.sin(t) * math.cos(t)
    res = []
    for seed in range(1, 120):
        X, Y = cloud(seed, s1, s2, deg, 250, 5, 4); S = stats2(X, Y); res.append((abs(S['cov'] - th), seed, round(S['cov'], 4), round(S['rho'], 3)))
    print((s1, s2, deg), 'theory', round(th, 4), sorted(res)[:4])
# v2 dice
res = []
for s in range(1, 200):
    r1 = rng(s); r2 = rng(s + 1000); d = lambda r: 1 + math.floor(6 * r())
    A = [d(r1) + d(r1) for _ in range(300)]; B = [2 * d(r2) for _ in range(300)]
    ma, sa = sd1(A); mb, sb = sd1(B)
    res.append((abs(sa - 2.415) + abs(sb - 3.416) + abs(ma - 7) + abs(mb - 7), s, round(ma, 3), round(sa, 3), round(mb, 3), round(sb, 3)))
print('v2', sorted(res)[:4])
# v5 darts
res = []
for s in range(1, 200):
    r = rng(s); G = [(gauss(r), gauss(r)) for _ in range(300)]
    out = []
    for s1, s2, deg in ((1, 1, 0), (2, 1, 0), (2, 1, 45)):
        t = math.radians(deg); c, si = math.cos(t), math.sin(t)
        X = [s1 * a * c - s2 * b * si for a, b in G]; Y = [s1 * a * si + s2 * b * c for a, b in G]; out.append(stats2(X, Y)['cov'])
    res.append((abs(out[0]) + abs(out[1]) + abs(out[2] - 1.5), s, [round(o, 4) for o in out]))
print('v5', sorted(res)[:4])
