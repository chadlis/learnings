"""Check every number of notion n1 (CDF to CDF, then differentiate)."""
import numpy as np
from scipy import integrate, stats

# uniform stretched by a: copying the density gives area a, the true density is 1/a
for a in [2, 3, 0.5]:
    naive, _ = integrate.quad(lambda y: 1.0 if 0 <= y / a <= 1 else 0.0, 0, max(a, 1) * 1.0, points=[a])
    print(f"uniform x{a}: area of copied density = {naive:.4f}, true height = {1/a:.4f}")
# sliver [0.2, 0.3] keeps probability 0.1
print("sliver prob", 0.3 - 0.2)

# exponential stretched: area of f_X(y/a) is a
lam = 4
for a in [2, 4]:
    v, _ = integrate.quad(lambda y: lam * np.exp(-lam * y / a), 0, np.inf)
    print(f"exp(4) x{a}: copied area {v:.4f}")
# v1 exponential sliver [0.1, 0.2] h
print("Exp(4) P(0.1<T<0.2) =", round(np.exp(-0.4) - np.exp(-0.8), 4), np.exp(-0.4), np.exp(-0.8))

# spams: hours -> minutes
print("f_T(0) per hour =", lam, "; f_M(0) per minute =", round(lam / 60, 5))
print("P(M <= 6 min) = P(T <= 0.1 h) =", round(1 - np.exp(-0.4), 4))
print("P(M <= 1 min) =", round(1 - np.exp(-4 / 60), 4), " vs rate*width", round(4 / 60, 4))
print("P(M <= 15 min) =", round(1 - np.exp(-1), 4))
# f_M(t) at 15 min
print("f_M(15) =", round((4 / 60) * np.exp(-1), 5), " f_T(0.25 h) =", round(4 * np.exp(-1), 4))

# Brunton's exercise: square the normal density
v, _ = integrate.quad(lambda x: stats.norm.pdf(x) ** 2, -np.inf, np.inf)
print("area of phi(x)^2 =", round(v, 4), " 1/(2 sqrt(pi)) =", round(1 / (2 * np.sqrt(np.pi)), 4))
# plugging sqrt(y) without the 1/sqrt(y) factor
v2, _ = integrate.quad(lambda y: stats.norm.pdf(np.sqrt(y)), 0, np.inf)
print("area of phi(sqrt y) =", round(v2, 4), " 2/sqrt(2pi) =", round(2 / np.sqrt(2 * np.pi), 4))

# -ln U is Exp(1)
for t in [0.5, 1, 2]:
    print(f"P(-ln U <= {t}) = 1 - e^-{t} =", round(1 - np.exp(-t), 4))

# figure 1: ten slices of probability 0.1 through g
gs = {'2x': lambda x: 2 * x, 'x2': lambda x: x * x, 'sqrt': np.sqrt, '-ln': lambda x: -np.log(x)}
for n, g in gs.items():
    xs = np.linspace(0, 1, 11)
    with np.errstate(divide='ignore'):
        ys = g(xs)
    ws = np.abs(np.diff(ys))
    hs = 0.1 / ws
    print(n, 'widths', np.round(ws, 4), 'heights', np.round(hs, 3))
# exact densities at a few points
print("x^2: f(y)=1/(2 sqrt y): f(0.01)=", 1 / (2 * 0.1), " f(0.5)=", round(1 / (2 * np.sqrt(0.5)), 4), " f(1)=0.5")
print("sqrt: f(y)=2y on [0,1]")
print("2x: f = 0.5 on [0,2]")
