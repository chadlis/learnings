"""n2 : speed of convergence. Exponential(1) mean = Gamma(n, scale 1/n); Bernoulli(p) mean = Binom(n,p)/n."""
import numpy as np
from scipy.stats import gamma, binom, norm, expon
from scipy.integrate import quad

print('--- Exponential(1): skew of mean = 2/sqrt(n); tails beyond mu +- 1.96 SE (normal says 0.025 each)')
for n in (1, 2, 5, 10, 30, 100, 1000):
    G = gamma(a=n, scale=1 / n); se = 1 / np.sqrt(n)
    up = G.sf(1 + 1.96 * se); lo = G.cdf(1 - 1.96 * se)
    # Kolmogorov distance of standardized mean
    z = np.linspace(-6, 12, 200001); kd = np.max(np.abs(G.cdf(1 + z * se) - norm.cdf(z)))
    print(f'n={n:5d} skew={2/np.sqrt(n):.3f} P(>mu+1.96SE)={up:.4f} P(<mu-1.96SE)={lo:.4f} total={up+lo:.4f} KS={kd:.4f}  mode={(n-1)/n:.3f}')
print('normal mass below 0 for exp mean, n=2:', norm.cdf(-np.sqrt(2)), ' n=5', norm.cdf(-np.sqrt(5)))

print('--- Bernoulli(p=0.02)')
p = 0.02
for n in (20, 30, 100, 500, 1000, 5000):
    q = 1 - p; sk = (1 - 2 * p) / np.sqrt(n * p * q)
    print(f'n={n:5d} np={n*p:.1f} P(0 succ)={q**n:.4f} skew={sk:.3f} SE={np.sqrt(p*q/n):.5f} normal mass<0={norm.cdf(-np.sqrt(n*p/q)):.4f}')
    k = np.arange(n + 1); pm = binom.pmf(k, n, p)
    zz = (k - n * p) / np.sqrt(n * p * q); Fz = np.cumsum(pm); left = np.concatenate([[0], Fz[:-1]])
    print('      KS=', round(max(np.max(np.abs(Fz - norm.cdf(zz))), np.max(np.abs(left - norm.cdf(zz)))), 4),
          ' P(phat>p+1.96SE)=', round(binom.sf(np.floor(n * p + 1.96 * np.sqrt(n * p * q)), n, p), 4),
          ' P(phat<p-1.96SE)=', round(binom.cdf(np.ceil(n * p - 1.96 * np.sqrt(n * p * q)) - 1, n, p), 4))

print('--- dice: skew 0; excess kurtosis of one die, of mean')
v = np.arange(1, 7); m4 = np.mean((v - 3.5)**4); s2 = np.mean((v - 3.5)**2)
print('kurt die', m4 / s2**2, 'excess', m4 / s2**2 - 3)

print('--- Berry-Esseen ratio rho/sigma^3 (rho = E|X-mu|^3)')
rho_die = np.mean(np.abs(v - 3.5)**3); print('die', rho_die / s2**1.5)
rho_exp = quad(lambda x: abs(x - 1)**3 * np.exp(-x), 0, np.inf)[0]; print('exp', rho_exp, 12 / np.e - 2)
for pp in (0.5, 0.1, 0.02):
    qq = 1 - pp; print('bern', pp, (pp**2 + qq**2) / np.sqrt(pp * qq), ' ~1/sqrt(p)=', 1 / np.sqrt(pp))
C = 0.4748
for n in (30, 100):
    print('BE bound exp n', n, C * rho_exp / np.sqrt(n), ' die', C * rho_die / s2**1.5 / np.sqrt(n))
for npp in (2, 10, 100):
    print('BE bound bern p=0.02 np=', npp, C * (0.02**2 + 0.98**2) / np.sqrt(npp * 0.98))

print('--- skew of Bernoulli mean at n=30, p=0.5 vs 0.02')
for pp in (0.5, 0.1, 0.02):
    print(pp, (1 - 2 * pp) / np.sqrt(30 * pp * (1 - pp)), 'P0', (1 - pp)**30)
