"""Replicate helpers.js rng (mulberry32) and gauss (Box-Muller) to predict every initial readout."""
import math, sys

M = 0xFFFFFFFF
def imul(a, b): return (a * b) & M
def rng(seed):
    s = [seed & M]
    def r():
        s[0] = (s[0] + 0x6D2B79F5) & M
        a = s[0]
        t = imul(a ^ (a >> 15), 1 | a)
        t = ((t + imul(t ^ (t >> 7), 61 | t)) & M) ^ t
        return ((t ^ (t >> 14)) & M) / 4294967296
    return r
def gauss(r):
    u = 0.0
    while u == 0: u = r()
    return math.sqrt(-2 * math.log(u)) * math.cos(2 * math.pi * r())

def stats2(xs, ys):
    n = len(xs); mx = sum(xs) / n; my = sum(ys) / n
    c = sum((a - mx) * (b - my) for a, b in zip(xs, ys)); vx = sum((a - mx) ** 2 for a in xs); vy = sum((b - my) ** 2 for b in ys)
    return dict(mx=mx, my=my, cov=c / n, vx=vx / n, vy=vy / n, rho=c / math.sqrt(vx * vy))

def cloud(seed, s1, s2, deg, n, cx, cy):
    r = rng(seed); t = deg * math.pi / 180; c, s = math.cos(t), math.sin(t); X, Y = [], []
    for _ in range(n):
        u = s1 * gauss(r); v = s2 * gauss(r); X.append(cx + u * c - v * s); Y.append(cy + u * s + v * c)
    return X, Y

def sd1(v):
    m = sum(v) / len(v); return m, math.sqrt(sum((x - m) ** 2 for x in v) / (len(v) - 1))

def main():
    print('=== v1 clouds')
    for seed, s1, s2, deg in ((33, 2.2, .45, 35), (7, 2.2, 1.1, 20), (12, 1.4, 1.4, 0)):
        X, Y = cloud(seed, s1, s2, deg, 250, 5, 4); S = stats2(X, Y)
        pos = sum(1 for a, b in zip(X, Y) if (a - S['mx']) * (b - S['my']) > 0)
        t = math.radians(deg); th = (s1 ** 2 - s2 ** 2) * math.sin(t) * math.cos(t)
        print(seed, 'cov %.4f theory %.4f rho %.3f pos %d%%' % (S['cov'], th, S['rho'], round(100 * pos / 250)))

    print('=== v2 dice')
    def sd1(v):
        m = sum(v) / len(v); return m, math.sqrt(sum((x - m) ** 2 for x in v) / (len(v) - 1))
    rS, rD = rng(15), rng(1015)
    d = lambda r: 1 + math.floor(6 * r())
    A, B = [], []
    for _ in range(300):
        A.append(d(rS) + d(rS)); B.append(2 * d(rD))
    print('sum', ['%.4f' % x for x in sd1(A)], ' double', ['%.4f' % x for x in sd1(B)])

    print('=== v3')
    r = rng(31); N = 200
    par = [(u, u * u) for u in [2 * r() - 1 for _ in range(N)]]
    cir = [(math.cos(a), math.sin(a)) for a in [2 * math.pi * r() for _ in range(N)]]
    half = [(u, u * u) for u in [r() for _ in range(N)]]
    for nm, P in (('par', par), ('cir', cir), ('half', half)):
        S = stats2([p[0] for p in P], [p[1] for p in P]); print(nm, 'cov %.4f rho %.4f' % (S['cov'], S['rho']))

    print('=== v5 darts')
    r = rng(193); G = [(gauss(r), gauss(r)) for _ in range(300)]
    for s1, s2, deg in ((1, 1, 0), (2, 1, 0), (2, 1, 45)):
        t = math.radians(deg); c, s = math.cos(t), math.sin(t)
        X = [s1 * a * c - s2 * b * s for a, b in G]; Y = [s1 * a * s + s2 * b * c for a, b in G]
        print(s1, s2, deg, 'cov %.4f' % stats2(X, Y)['cov'])

    print('=== fig2 rho measured at 0.6')
    r = rng(23); U, W = [], []
    for _ in range(300): U.append(gauss(r)); W.append(gauss(r))
    for rho in (0.6, 0.0, 0.9):
        b = math.sqrt(1 - rho * rho); Y = [rho * u + b * w for u, w in zip(U, W)]; print(rho, 'rho_hat %.4f' % stats2(U, Y)['rho'])

    print('=== v6 seeds')
    def once(r, n=1000):
        n11 = n10 = n01 = a = b = 0
        for _ in range(n):
            u = r()
            if u < 0.862: n11 += 1
            elif u < 0.872: n10 += 1
            elif u < 0.911: n01 += 1
        for _ in range(n):
            if r() < 0.872: a += 1
        for _ in range(n):
            if r() < 0.901: b += 1
        return (n01 - n10) / n, (b - a) / n, n10, n01
    seeds = [int(x) for x in sys.argv[1:]] or [62]
    for sd in seeds:
        r = rng(sd); res = [once(r) for _ in range(400)]
        A = [x[0] for x in res]; B = [x[1] for x in res]
        print(sd, 'sd shared %.5f sep %.5f  <=0: %d ; %d  last b,c %d %d' % (sd1(A)[1], sd1(B)[1], sum(1 for x in A if x <= 1e-12), sum(1 for x in B if x <= 1e-12), res[-1][2], res[-1][3]))

if __name__ == '__main__':
    main()
