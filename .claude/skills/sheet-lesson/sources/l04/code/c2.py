import numpy as np
from scipy.stats import norm

mu, sigma = 1.75, 0.07                        # height model, in metres
rng = np.random.default_rng(0)
h = rng.normal(mu, sigma, size=1_000_000)
print("heights exactly equal to 1.75:", (h == 1.75).sum())
for w in (0.10, 0.01, 0.001):                 # window of width w centred on 1.75
    prob = np.mean(np.abs(h - mu) < w / 2)
    print(f"width {w:5} m: P = {prob:.4f}   P / width = {prob / w:.2f}")
print(f"density f(1.75) = {norm.pdf(mu, mu, sigma):.2f} per metre")
print(f"same law in cm: f(175) = {norm.pdf(175, 175, 7):.4f} per cm")
print(f"F(1.80) = {norm.cdf(1.80, mu, sigma):.4f}")
print(f"share of draws <= 1.80: {np.mean(h <= 1.80):.4f}")
