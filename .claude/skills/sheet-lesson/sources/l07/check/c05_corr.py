"""n4 figure 4: standard bivariate normal with correlation rho vs product of its N(0,1) marginals."""
import numpy as np
from scipy import stats, integrate
N = stats.norm
def f(x, y, r):
    return np.exp(-(x * x - 2 * r * x * y + y * y) / (2 * (1 - r * r))) / (2 * np.pi * np.sqrt(1 - r * r))
for r in (0, 0.3, 0.6, 0.8, -0.8, 0.9):
    j = f(1, 1, r); p = N.pdf(1) ** 2
    jm = f(1, -1, r)
    print(f'rho={r}: f(1,1)={j:.4f}  fX(1)fY(1)={p:.4f}  ratio {j/p:.2f} | f(1,-1)={jm:.4f} ratio {jm/p:.2f} | f(0,0)={f(0,0,r):.4f}')
# marginal check
r = 0.8
print('marginal at x=1 for rho=.8:', integrate.quad(lambda y: f(1, y, r), -12, 12)[0], 'phi(1)=', N.pdf(1))
# the 2D standard gaussian factorises
x, y = 0.7, -1.3
print('rho=0: f =', f(x, y, 0), ' product =', N.pdf(x) * N.pdf(y))
# Brunton's constant 1/sqrt(2 pi): total mass
mass = integrate.dblquad(lambda y, x: np.exp(-(x*x + y*y)/2) / np.sqrt(2*np.pi), -12, 12, -12, 12)[0]
print("Brunton's constant gives total mass", mass, ' sqrt(2 pi) =', np.sqrt(2*np.pi))
mass2 = integrate.dblquad(lambda y, x: np.exp(-(x*x + y*y)/2) / (2*np.pi), -12, 12, -12, 12)[0]
print('with 1/(2 pi):', mass2)
# contour radii for figure 4 levels
for c in (0.14, 0.1, 0.06, 0.02):
    print(f'level {c}: product circle radius {np.sqrt(-2*np.log(2*np.pi*c)):.3f}', ' rho=.8 mahalanobis k', np.sqrt(-2*np.log(2*np.pi*c*np.sqrt(1-.64))))
print('max of product density', 1/(2*np.pi))
