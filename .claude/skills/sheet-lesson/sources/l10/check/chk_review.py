"""Checks for the fresh-context review of l10."""
import numpy as np
from scipy import stats
rng = np.random.default_rng(0)
P, N = 20_000, 1000
sig = np.sqrt(35 / 12)
s = rng.integers(1, 7, size=(P, N)).cumsum(axis=1, dtype=np.int64)
n = np.arange(1, N + 1)
dev = s - 3.5 * n
band = 2 * sig * np.sqrt(n)
inside = np.abs(dev[:, 3:]) <= band[3:]                      # n = 4 .. 1000
print('share of paths inside the band for all n in 4..1000:', inside.all(axis=1).mean())
# same event top and bottom
top = np.abs(s / n - 3.5) <= 2 * sig / np.sqrt(n)
print('top/bottom events identical:', np.array_equal(top, np.abs(dev) <= band))
# recrossing 0 after n = 500
d = dev[:, 499:]
recross = (np.sign(d[:, 1:]) != np.sign(d[:, :-1])).any(axis=1) | (d == 0).any(axis=1)
print('share of paths that recross 0 after n = 500:', recross.mean())
print('median |S_1000 - 3500|:', np.median(np.abs(dev[:, -1])), ' theory 0.6745*sigma*sqrt(1000) =', 0.6745 * sig * np.sqrt(1000))
# AR(1): n Var(Xbar) -> sigma^2 (1 + phi)/(1 - phi)
phi, n_ar, reps = 0.5, 2000, 4000
e = rng.normal(size=(reps, n_ar)) * np.sqrt(1 - phi**2)      # stationary, Var = 1
x = np.empty_like(e); x[:, 0] = rng.normal(size=reps)
for t in range(1, n_ar): x[:, t] = phi * x[:, t - 1] + e[:, t]
for m in (100, 2000):
    print(f'AR(1) phi=0.5 n={m}: n Var(Xbar) = {m * x[:, :m].mean(axis=1).var():.3f}   theory (1+phi)/(1-phi) = {(1+phi)/(1-phi):.3f}')
# normal tail readouts
for k in (3.5, 4):
    print(f'normal tail k={k}: {100 * 2 * stats.norm.sf(k):.4f} %')
