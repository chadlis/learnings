import numpy as np
from math import exp, pi, sqrt

pdf = lambda y, mu: exp(-(y - mu) ** 2 / 2) / sqrt(2 * pi)   # N(mu, 1) density
prev = 0.01
for y in (2, 3):
    num = pdf(y, 2) * prev
    den = num + pdf(y, 0) * (1 - prev)          # f_Y(y), the marginal of the score
    ratio = pdf(y, 2) / pdf(y, 0)               # likelihood ratio, sick vs healthy
    print(f"score {y}: likelihood ratio {ratio:.2f}, P(sick | score) = {num / den:.4f}")

rng = np.random.default_rng(0)
n = 2_000_000
sick = rng.random(n) < prev
score = rng.standard_normal(n) + 2 * sick       # N(0, 1) if healthy, N(2, 1) if sick
band = np.abs(score - 2) < 0.05                 # condition on Y ≈ 2 with a thin band
print(f"people with a score near 2: {band.sum()}")
print(f"share of sick among them:   {sick[band].mean():.4f}")
