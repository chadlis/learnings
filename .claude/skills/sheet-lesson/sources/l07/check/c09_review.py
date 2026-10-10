"""review checks: n2 density loss at distance 1; n3 band biases and noise; fig4 tiny values."""
import numpy as np
from scipy import stats
N = stats.norm
print('density at distance 1 / centre =', np.exp(-0.5), ' lost', 1 - np.exp(-0.5))
for h in (0.15, 0.5):
    a, b = 1.5 - h, 1.5 + h
    EX = (N.pdf(a) - N.pdf(b)) / (N.cdf(b) - N.cdf(a))
    p = N.cdf(b) - N.cdf(a)
    print(f'band ±{h}: E[Y|band] = {0.8 * EX:.4f}, P(band) = {p:.5f}, expected points of 3000 = {3000 * p:.1f}')
# noise of the band mean with ~117 points: sd(Y | band) / sqrt(117)
h = 0.15; a, b = 1.35, 1.65
tn = stats.truncnorm(a, b)
varY = 0.64 * tn.var() + 0.36
print('sd(Y | band) =', np.sqrt(varY), ' sd of the mean with 117 points =', np.sqrt(varY / 117))
r = -0.9
f = lambda x, y: np.exp(-(x*x - 2*r*x*y + y*y) / (2*(1 - r*r))) / (2*np.pi*np.sqrt(1 - r*r))
print('rho=-0.9: f(1,1) =', f(1, 1), ' ratio to product', f(1, 1) / N.pdf(1)**2, '; f(1,-1) ratio', f(1, -1) / N.pdf(1)**2)
# counterexample: independent uniforms on [0,1] U [2,3]
rr = np.random.default_rng(0); u = rr.random((200000, 2)); u = np.where(u < 0.5, 2 * u, 2 * u + 1)
print('corr of the 4-square example', np.corrcoef(u.T)[0, 1], ' support corners present:', ((u[:, 0] < 1) & (u[:, 1] > 2)).mean())
