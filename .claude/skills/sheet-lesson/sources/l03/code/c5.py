import numpy as np

rng = np.random.default_rng(2)
n = 4_000_000
# about 4,000 sick people: the simulated values carry about +-0.01 of noise
sick = rng.random(n) < 0.001

def test(u):                     # sensitivity 0.99, false-positive rate 0.01
    return np.where(sick, u < 0.99, u < 0.01)

u1 = rng.random(n)
t1 = test(u1)
t2_new = test(rng.random(n))     # fresh draw: independent given the status
t2_same = test(u1)               # same draw: repeats the first test's error

print(f"after one +            : P(sick) = {sick[t1].mean():.3f}")
print(f"two independent tests +: P(sick) = {sick[t1 & t2_new].mean():.3f}")
print(f"same test twice +      : P(sick) = {sick[t1 & t2_same].mean():.3f}")
odds = (0.001 / 0.999) * 99 * 99 # prior odds times LR, twice
print(f"odds 1:999 x 99 x 99   : P(sick) = {odds / (1 + odds):.3f}")
print(f"P(second + | first +)  = {t2_new[t1].mean():.3f}")
print(f"P(second +)            = {t2_new.mean():.3f}")
