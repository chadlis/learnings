"""v4: darts aimed at the centre (iid N(0,1)) vs aimed at a ring (R ~ N(2, 0.2^2), angle uniform);
shuffling the y's between darts builds the product of the marginals. v6 / n6: polar numbers."""
import numpy as np
from scipy import stats, integrate
r = np.random.default_rng(0)
n = 2_000_000
def centre(n):
    return r.standard_normal(n), r.standard_normal(n)
def ring(n):
    R = 2 + 0.2 * r.standard_normal(n); T = r.uniform(0, 2 * np.pi, n)
    return R * np.cos(T), R * np.sin(T)
for name, gen in (('centre', centre), ('ring', ring)):
    x, y = gen(n)
    ys = r.permutation(y)
    inn = lambda a, b: np.mean(a * a + b * b < 0.25)
    print(f'{name}: P(r<0.5) before {inn(x, y):.4f}, after shuffle {inn(x, ys):.4f}; corr {np.corrcoef(x, y)[0,1]:.4f}; '
          f'P(r<1) before {np.mean(x*x+y*y<1):.4f} after {np.mean(x*x+ys*ys<1):.4f}')
print('theory centre P(R<0.5) =', 1 - np.exp(-0.125))
# ring: probability r < 0.5 for the ring itself
print('ring P(R<0.5) exact', stats.norm.cdf((0.5 - 2) / 0.2))
# polar
print('P(R<=1) =', 1 - np.exp(-0.5), ' P(R<=2) =', 1 - np.exp(-2), ' P(R<=3) =', 1 - np.exp(-4.5))
print('1D: P(|X|<=1) =', 2 * stats.norm.cdf(1) - 1)
print('E[R] = sqrt(pi/2) =', np.sqrt(np.pi / 2), ' mode of Rayleigh = 1, median =', np.sqrt(2 * np.log(2)))
print('forgetting r: int_0^inf int_0^2pi (1/2pi) e^{-r^2/2} dtheta dr =', integrate.quad(lambda s: np.exp(-s * s / 2), 0, np.inf)[0])
# disc vs ring (v6)
pc = 1 - np.exp(-0.125); pr = np.exp(-0.5) - np.exp(-1.125)
ac = np.pi * 0.25; ar = np.pi * (1.5 ** 2 - 1)
print(f'disc r<0.5: share {pc:.4f}, area {ac:.4f}, per unit area {pc/ac:.4f}')
print(f'ring 1<=r<1.5: share {pr:.4f}, area {ar:.4f}, per unit area {pr/ar:.4f}, ratio shares {pr/pc:.2f}')
for a in np.arange(0, 3.01, 0.25):
    b = a + 0.25
    sh = np.exp(-a * a / 2) - np.exp(-b * b / 2)
    print(f'ring [{a:.2f}, {b:.2f}): share {100*sh:.2f} %, per unit area {sh/(np.pi*(b*b-a*a)):.4f}')
# high dimension shell
for d in (2, 10, 100, 1000):
    z = r.standard_normal((20000, d)); nr = np.linalg.norm(z, axis=1)
    print(f'd={d}: mean norm {nr.mean():.3f}, sd {nr.std():.3f}, sqrt(d) {np.sqrt(d):.3f}, P(norm<1) {np.mean(nr<1):.4f}')
print('d=100 P(norm<5) chi2:', stats.chi2.cdf(25, 100), ' P(norm<1) d=10', stats.chi2.cdf(1, 10))
