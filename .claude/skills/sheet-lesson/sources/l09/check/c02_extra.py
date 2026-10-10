"""Further checks: cancellation, outlier, sign-flip counterexample, fat vs tight clouds, np.cov ddof."""
import numpy as np, math
rng = np.random.default_rng(0)

print('=== cancellation: E[XY] - E[X]E[Y] with large means')
n = 100_000
u = rng.standard_normal(n); v = 0.5 * u + math.sqrt(0.75) * rng.standard_normal(n)
for shift in (0, 1e4, 1e6, 1e8, 1e9):
    x, y = shift + u, shift + v
    naive = np.mean(x * y) - np.mean(x) * np.mean(y)
    centred = np.mean((x - x.mean()) * (y - y.mean()))
    print(f'shift {shift:.0e}: naive {naive:.4f}  centred {centred:.4f}')

print('=== np.cov ddof')
x = np.array([1, 2, 3, 4.]); y = np.array([1, 3, 2, 4.])
print('np.cov', np.cov(x, y)[0, 1], 'bias=True', np.cov(x, y, bias=True)[0, 1], 'np.var', np.var(x), 'np.var ddof1', np.var(x, ddof=1))

print('=== outlier: 30 independent points + one far point')
for seed in range(6):
    r = np.random.default_rng(seed)
    a = r.standard_normal(30); b = r.standard_normal(30)
    r0 = np.corrcoef(a, b)[0, 1]
    a2 = np.append(a, 8); b2 = np.append(b, 8)
    print(seed, 'rho 30 pts', round(r0, 3), ' + (8,8):', round(np.corrcoef(a2, b2)[0, 1], 3))

print('=== Y = S X: Gaussian marginals, cov 0, dependent')
r = np.random.default_rng(1)
X = r.standard_normal(1_000_000); S = r.choice([-1, 1], size=X.size); Y = S * X
print('cov', np.cov(X, Y)[0, 1], 'corr |X|,|Y|', np.corrcoef(np.abs(X), np.abs(Y))[0, 1], 'P(X+Y=0)', np.mean(X + Y == 0))
print('Var Y', Y.var(), 'kurtosis-ish check E[Y^4]', np.mean(Y ** 4))

print('=== fat vs tight')
print('tight sigma 1, rho .9 -> cov', 1 * 1 * .9, ' fat sigma 2, rho .5 -> cov', 2 * 2 * .5)

print('=== slope vs rho vs major axis for Sigma=[[2.5,1.5],[1.5,2.5]]')
S = np.array([[2.5, 1.5], [1.5, 2.5]]); w, V = np.linalg.eigh(S); print('eig', w, V)
print('reg slope Y on X', S[0, 1] / S[0, 0], 'major axis slope', V[1, 1] / V[0, 1])

print('=== VIF check by simulation, rho = .9')
r = np.random.default_rng(2); reps = 4000; n = 200; coefs = {0: [], .9: []}
for rho in (0, .9):
    for _ in range(reps):
        x1 = r.standard_normal(n); x2 = rho * x1 + math.sqrt(1 - rho ** 2) * r.standard_normal(n)
        y = x1 + x2 + r.standard_normal(n)
        Xm = np.column_stack([np.ones(n), x1, x2]); beta = np.linalg.lstsq(Xm, y, rcond=None)[0]
        coefs[rho].append(beta[1])
print('var beta1 ratio', np.var(coefs[.9]) / np.var(coefs[0]), 'theory', 1 / (1 - .81))
