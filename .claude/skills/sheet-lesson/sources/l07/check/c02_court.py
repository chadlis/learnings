"""Basketball half court (FIBA: 15 m x 14 m), an invented player density, region probabilities.
Must match js: mixture of three gaussian bumps truncated to the court, normalised numerically."""
import numpy as np

W, L = 15.0, 14.0
BX, BY = 7.5, 1.575          # basket centre
BUMPS = [  # weight, mx, my, sx, sy
    (0.55, 7.5, 2.2, 1.1, 1.0),   # near the basket
    (0.30, 7.5, 6.6, 1.8, 1.0),   # top of the key
    (0.15, 13.6, 1.2, 0.6, 0.7),  # right corner
]

def g(x, y):
    s = 0
    for w, mx, my, sx, sy in BUMPS:
        s = s + w * np.exp(-0.5 * (((x - mx) / sx) ** 2 + ((y - my) / sy) ** 2)) / (2 * np.pi * sx * sy)
    return s

def regions(x, y):
    paint = (x >= 5) & (x <= 10) & (y <= 6)   # simplified paint, 5 m x 6 m
    d = np.hypot(x - BX, y - BY)
    yc = BY + np.sqrt(6.75 ** 2 - 6.6 ** 2)      # where the arc meets the straight lines
    inside3 = np.where(y <= yc, (x >= 0.9) & (x <= 14.1), d <= 6.75)
    three = ~inside3
    corner = (x >= 12) & (y <= 3)
    return {'paint': paint, 'three': three, 'corner': corner, 'court': np.ones_like(x, bool)}

print('arc meets straight line at y =', BY + np.sqrt(6.75 ** 2 - 6.6 ** 2))
# fine grid -> "exact"
h = 0.005
xs = np.arange(h / 2, W, h); ys = np.arange(h / 2, L, h)
X, Y = np.meshgrid(xs, ys)
G = g(X, Y)
Z = G.sum() * h * h
print('mass of the mixture inside the court (normaliser) =', Z)
f = G / Z
R = regions(X, Y)
exact = {k: (f[m]).sum() * h * h for k, m in R.items()}
for k, v in exact.items():
    print(f'exact P({k}) = {v:.4f}')
print('max density f =', f.max(), 'at', X.flat[f.argmax()], Y.flat[f.argmax()])
# coarse midpoint sums, a cell counts if its centre is in the region
for c in (1.0, 0.5, 0.25):
    xs = np.arange(c / 2, W, c); ys = np.arange(c / 2, L, c)
    Xc, Yc = np.meshgrid(xs, ys)
    fc = g(Xc, Yc) / Z
    Rc = regions(Xc, Yc)
    print(f'cell {c}: n cells {Xc.size}', {k: (int(m.sum()), round(float(fc[m].sum() * c * c), 4)) for k, m in Rc.items()})
