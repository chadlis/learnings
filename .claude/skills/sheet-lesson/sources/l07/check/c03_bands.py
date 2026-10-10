"""v2: share of points per vertical band (width 0.5, centred on multiples of 0.5) for three clouds."""
import numpy as np
from scipy import stats, integrate

N = stats.norm
def band_gauss(c, w=0.5):
    return N.cdf(c + w / 2) - N.cdf(c - w / 2)
def band_square(c, a=2.0, w=0.5):
    lo, hi = max(c - w / 2, -a), min(c + w / 2, a)
    return max(0, hi - lo) / (2 * a)
def fdisk(x, R=2.0):   # marginal of uniform disk radius R: (2/(pi R^2)) sqrt(R^2 - x^2)
    return np.where(np.abs(x) < R, 2 / (np.pi * R * R) * np.sqrt(np.maximum(R * R - x * x, 0)), 0)
def band_disk(c, w=0.5):
    return integrate.quad(lambda x: fdisk(x), c - w / 2, c + w / 2)[0]

for c in (0, 0.5, 1, 1.5, 2, 2.5, 3):
    print(f'band centred {c}: gauss {100*band_gauss(c):.1f} %  square {100*band_square(c):.1f} %  disk {100*band_disk(c):.1f} %')
print('band [1.5, 2] gauss', N.cdf(2) - N.cdf(1.5))
print('marginal densities at 0: gauss', N.pdf(0), ' square', 1 / 4, ' disk', 2 / (np.pi * 2))
print('P(|X|>3.25) gauss', 2 * N.sf(3.25))
print('disk marginal integrates to', integrate.quad(lambda x: fdisk(x), -2, 2)[0])
# monte carlo check of disk
r = np.random.default_rng(1)
u = r.uniform(-2, 2, (400000, 2)); u = u[(u ** 2).sum(1) < 4]
print('MC disk band 0:', np.mean(np.abs(u[:, 0]) < 0.25), ' band 1.5:', np.mean(np.abs(u[:, 0] - 1.5) < 0.25))

print('--- bins with edges at multiples of 0.5: band [a, a + 0.5]')
for a in (0, 0.5, 1, 1.5, 2, 2.5, 3):
    c = a + 0.25
    print(f'band [{a}, {a+0.5}]: gauss {100*band_gauss(c):.2f} %  square {100*band_square(c):.2f} %  disk {100*band_disk(c):.2f} %')
print('P(|X|>3.5) gauss', 2 * N.sf(3.5))
