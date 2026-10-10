"""n5: continuous screening score. Healthy ~ N(0,1), sick ~ N(2,1), prevalence pi."""
import numpy as np
from scipy import stats, integrate
N = stats.norm
def post(y, pi):
    a = N.pdf(y, 2) * pi; b = N.pdf(y, 0) * (1 - pi)
    return a / (a + b)
for y in (1, 2, 3, 4):
    print(f'y={y}: LR {N.pdf(y,2)/N.pdf(y,0):.3f} (e^(2y-2) = {np.exp(2*y-2):.3f}), f(y|sick) {N.pdf(y,2):.4f}, f(y|healthy) {N.pdf(y,0):.4f}',
          {p: round(post(y, p), 4) for p in (0.01, 0.1, 0.5)})
for p in (0.01, 0.1, 0.5):
    y50 = 1 - 0.5 * np.log(p / (1 - p))     # 2y - 2 + logit(pi) = 0
    print(f'pi={p}: logit pi = {np.log(p/(1-p)):.3f}; posterior = 1/2 at y = {y50:.3f}; check {post(y50, p):.3f}')
# marginal f_Y(2) and posterior by the formula
pi = 0.01
fy = N.pdf(2, 2) * pi + N.pdf(2, 0) * (1 - pi)
print('f_Y(2) =', fy, ' posterior =', N.pdf(2, 2) * pi / fy)
# simulation: band around 2
r = np.random.default_rng(0)
n = 2_000_000
sick = r.random(n) < pi
y = r.standard_normal(n) + 2 * sick
m = np.abs(y - 2) < 0.05
print('band |y-2|<0.05: people', m.sum(), ' sick share', sick[m].mean())
# discrete reminders from l03-like dice: P(X=2|M=2) = 2/3 (c01)
# Gaussian signal + noise: X ~ N(0,1), Y = X + eps, eps ~ N(0,1): X | Y=2 ~ N(1, 1/2)
print('signal+noise posterior mean 1, var 0.5, sd', np.sqrt(0.5))
# posterior as a function of x is not a density; likelihood f(y=2|x) over x
print('int over x of f(y=2 | x) for Y = X + eps:', integrate.quad(lambda x: N.pdf(2 - x), -20, 20)[0])
