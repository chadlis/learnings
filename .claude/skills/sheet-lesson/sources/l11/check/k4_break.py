"""n4 : where it breaks. Cauchy, equicorrelated terms, Pareto alpha=1.5, copies."""
import numpy as np
from scipy.stats import cauchy, norm
print('Cauchy P(|X|>1)', 2 * cauchy.sf(1), ' 95% half width', cauchy.ppf(0.975), ' IQR', cauchy.ppf(.75) - cauchy.ppf(.25))
rng = np.random.default_rng(0)
for n in (1, 10, 100, 1000):
    m = rng.standard_cauchy((20000, n)).mean(axis=1)
    print('cauchy n', n, 'P(|mean|>1)=', np.mean(np.abs(m) > 1).round(3), 'IQR', np.subtract(*np.percentile(m, [75, 25])).round(3))
sig2 = 35 / 12; sig = np.sqrt(sig2)
for rho in (0.05, 0.1, 0.2):
    print('rho', rho, 'plateau sd', np.sqrt(rho * sig2), ' n=100', np.sqrt(sig2 * (rho + (1 - rho) / 100)), ' n=10000', np.sqrt(sig2 * (rho + (1 - rho) / 10000)))
print('iid n=10000 SE', sig / 100, 'ratio rho .05', np.sqrt(.05 * sig2) / (sig / 100))
print('iid n=100 SE', sig / 10)
# Pareto alpha = 1.5 (x_m = 1): mean alpha/(alpha-1)=3, infinite variance; fluctuations ~ n^(1/alpha - 1) = n^(-1/3)
a = 1.5; mu = a / (a - 1)
for n in (10, 100, 1000, 10000):
    x = (rng.pareto(a, (4000, n)) + 1).mean(axis=1)
    iqr = np.subtract(*np.percentile(x, [75, 25]))
    print('pareto n', n, 'median of mean', np.median(x).round(3), 'IQR', iqr.round(4), 'IQR*n^(1/3)', (iqr * n**(1/3)).round(3), 'IQR*sqrt(n)', (iqr * np.sqrt(n)).round(3))
# copies: X_i = X_1 -> Xbar = X_1, sd 1.708 for any n
print('copies sd', sig)
# running mean of dice vs Cauchy: typical
