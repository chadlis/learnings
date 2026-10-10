"""n3: cloud Y = 0.8 X + 0.6 Z; conditional slice at x; figure 3 numbers; v3 band numbers."""
import numpy as np
from scipy import stats, integrate
N = stats.norm
a, s = 0.8, 0.6
print('Var Y =', a * a + s * s)
def f(x, y):   # joint density of (X, Y)
    return N.pdf(x) * N.pdf((y - a * x) / s) / s
for x0 in (0, 1, 1.5, 2):
    area = integrate.quad(lambda y: f(x0, y), -10, 10)[0]
    print(f'x0={x0}: area of slice {area:.4f} = phi(x0) {N.pdf(x0):.4f}; slice peak {f(x0, a*x0):.4f}; conditional peak {1/(s*np.sqrt(2*np.pi)):.4f}; centre {a*x0}')
# band check by simulation (v3: band half width 0.15 around x0)
r = np.random.default_rng(0)
X = r.standard_normal(2_000_000); Y = a * X + s * r.standard_normal(X.size)
for x0 in (0, 1.5):
    m = np.abs(X - x0) < 0.15
    print(f'band x0={x0}: share {m.mean():.4f}, theory {N.cdf(x0+.15)-N.cdf(x0-.15):.4f}; mean y {Y[m].mean():.3f}, sd y {Y[m].std():.3f}')
    m = np.abs(X - x0) < 0.02
    print(f'   narrow band: mean {Y[m].mean():.3f}, sd {Y[m].std():.3f}')
print('sd of all Y', Y.std())
print('expected count in band x0=1.5 among 2000:', 2000 * (N.cdf(1.65) - N.cdf(1.35)))
print('expected count in band x0=0 among 2000:', 2000 * (N.cdf(.15) - N.cdf(-.15)))
# band sd inflation: within band, x varies -> var = a^2 var(X|band) + s^2
m = np.abs(X - 1.5) < 0.15
print('var of X in band', X[m].var(), ' implied sd', np.sqrt(a*a*X[m].var() + s*s))
# integral over x of f(y|x) is not 1
y0 = 1.0
print('int f(y0|x) dx =', integrate.quad(lambda x: N.pdf((y0 - a*x)/s)/s, -20, 20)[0], '= 1/a =', 1/a)
