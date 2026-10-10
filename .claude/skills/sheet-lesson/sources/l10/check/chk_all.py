"""Every number quoted in lesson l10, recomputed. Run: python3 numbers.py"""
from fractions import Fraction as F
import math
import numpy as np
from scipy import stats

def h(t): print('\n== ' + t)

# ---------------- n1 Markov
h('n1 Markov')
print('E=10, a=20 bound', 10 / 20)
# two-point law {0, 20}
print('two-point mean', F(1, 2) * 0 + F(1, 2) * 20, 'P(X>=20)', F(1, 2))
# exponential mean 10
for a in (10, 20, 30, 50):
    print(f'expo mean 10: a={a} P={math.exp(-a/10):.4f} bound={10/a:.4f}')
# uniform [0,20]
for a in (5, 10, 15, 20):
    print(f'unif[0,20]: a={a} P={1-a/20:.4f} bound={10/a:.4f}')
# counterweight position for mass p at 20, mean 10
for p in (0.1, 0.25, 0.4, 0.5, 0.6):
    print(f'p={p}: counterweight at {(10-20*p)/(1-p):.3f}')
# negative counterexample {-30, 20}
p = F(4, 5)
print('neg ex mean', p * 20 + (1 - p) * (-30), 'P(X>=20)', p)
# ML loss
print('loss>=1 <=> p_true <= e^-1 =', math.exp(-1))

# ---------------- n2 Chebyshev
h('n2 Chebyshev')
for k in (1, 1.5, 2, 3, 4):
    print(f'k={k}: bound {1/k**2:.4f}  normal {2*stats.norm.sf(k):.5f}  within >= {1-1/k**2:.4f}')
var_die = F(35, 12)
print('die var', var_die, float(var_die), 'sd', math.sqrt(35/12))
print('die a=2.5 bound', float(var_die / F(25, 4)), 'true', F(2, 6))
s = math.sqrt(35/12)
for k in (1, 1.4, 1.5, 2):
    out = sum(1 for x in range(1, 7) if abs(x - 3.5) >= k * s) / 6
    print(f'die k={k}: outside {out:.4f} vs bound {1/k**2:.4f}  (kσ={k*s:.3f})')
# three-point law attains
for k in (1.5, 2, 3):
    m = 1 / (2 * k * k)
    print(f'three-point k={k}: masses {m:.4f},{1-2*m:.4f},{m:.4f}; var={2*m*k*k:.4f}; P(out)={2*m:.4f}')
# uniform, exponential
for k in (1.5, 2):
    print(f'uniform k={k}: {max(0, 1 - k/math.sqrt(3)):.4f}   expo(1) k={k}: {math.exp(-(1+k)):.4f}')

# ---------------- n3 X bar
h('n3 Xbar')
for n in (1, 4, 16, 25, 100):
    print(f'die n={n}: Var(Xbar)={35/12/n:.4f} SE={s/math.sqrt(n):.4f}')
for t in ((2, 5, 1, 5), (6, 3, 4, 5), (1, 4, 3, 3)):
    print(t, sum(t) / 4)
# grid n=6, sigma^2=1
n = 6
cases = {'iid': (np.ones(n), 0.0), 'unequal var (1,1,1,1,1,4)': (np.array([1, 1, 1, 1, 1, 4.]), 0.0),
         'rho=0.5': (np.ones(n), 0.5), 'copies': (np.ones(n), 1.0)}
for name, (v, r) in cases.items():
    sd = np.sqrt(v)
    C = r * np.outer(sd, sd); np.fill_diagonal(C, v)
    print(f'{name}: sum cells {C.sum():.4f}  Var(Xbar)={C.sum()/n**2:.4f}  diag {np.trace(C):.2f}  off {C.sum()-np.trace(C):.2f}')

# ---------------- n4 LLN
h('n4 LLN')
print('Chebyshev n=100 eps=0.5:', 35/12 / (100 * 0.25))
# exact law of the sum of 100 dice
p = np.ones(6) / 6
dist = np.array([1.0])
for _ in range(100):
    dist = np.convolve(dist, p)
sums = np.arange(100, 100 + len(dist))
xbar = sums / 100
print('exact P(|Xbar-3.5| >= 0.5) =', dist[np.abs(xbar - 3.5) >= 0.5 - 1e-12].sum())
print('exact P(|Xbar-3.5| >  0.5) =', dist[np.abs(xbar - 3.5) > 0.5 + 1e-12].sum())
se100 = s / 10
print('normal approx P(|Z| >= 0.5/se) =', 2 * stats.norm.sf(0.5 / se100), ' z=', 0.5 / se100)
print('1000 dice: SE mean', s / math.sqrt(1000), ' sd sum', s * math.sqrt(1000))
print('coin n=100 sd prop', 0.5 / 10, ' sd heads', 0.5 * 10, '; n=10000:', 0.5 / 100, 0.5 * 100)
for n in (30, 300):
    print(f'light: sigma 100 km/s, n={n}: SE={100/math.sqrt(n):.2f}')
print('c =', 299792.458)
# Cauchy: P(|C| > 2.5/0.5) for scale 0.5
print('Cauchy scale 0.5, P(|C|>2.5)=', 1 - 2 / math.pi * math.atan(5))

# ---------------- n5 SE
h('n5 SE')
for target in (0.5, 0.1, 0.05, 0.01):
    print(f'die SE {target}: n={(s/target)**2:.2f} -> {math.ceil((s/target)**2)}')
for n in (250, 1000, 4000, 16000):
    se = math.sqrt(0.9 * 0.1 / n)
    print(f'acc p=0.9 n={n}: SE={se:.5f}  ±1.96SE = {1.96*se*100:.3f} points')
print('poll p=.5 n=1000: SE', math.sqrt(0.25 / 1000), ' half-width', 1.96 * math.sqrt(0.25 / 1000))

# ---------------- n6 correlated mean
h('n6 correlated')
def vbar(n, r, s2=1.0): return r * s2 + (1 - r) * s2 / n
for n in (1, 10, 100, 1000):
    v = vbar(n, 0.5)
    print(f'rho=.5 n={n}: Var={v:.4f}  n_eff={1/v:.3f}  common share {0.5/v*100:.1f}%')
print('die rho=.05 floor SE', math.sqrt(0.05 * 35 / 12), ' indep n=10000 SE', s / 100,
      ' ratio', math.sqrt(0.05 * 35 / 12) / (s / 100))
print('die rho=.05 n=10000 SE', math.sqrt(vbar(10000, 0.05, 35 / 12)), ' n_eff', 10000 / (1 + 9999 * 0.05))
deff = 1 + 19 * 0.2
print('cluster 50x20 rho=.2: deff', deff, ' n_eff', 1000 / deff, ' SE ratio', math.sqrt(deff))
for n in (10, 100):
    print(f'rho >= {-1/(n-1):.4f} for n={n}')
# vignette initial: rho=0.5 n=10 parts
print('n=10 rho=.5: common', 0.5, 'own', 0.5 / 10)

# ---------------- n7 Monte Carlo
h('n7 Monte Carlo')
q = math.pi / 4
for N in (100, 1000, 10000, 1_000_000):
    se = math.sqrt(q * (1 - q) / N)
    print(f'N={N}: SE on pi/4 {se:.5f}  on pi {4*se:.4f}')
print('pi/4 =', q, ' E[e^Z] =', math.exp(0.5))
print('P(sum of two dice >= 10) =', F(6, 36))
pr, N = 1e-4, 1e4
print('rare: expected hits', pr * N, ' rel SE', math.sqrt((1 - pr) / (N * pr)))
