import numpy as np
from scipy.special import comb
from scipy.stats import norm

def compare(n, p):
    k = np.arange(n + 1)
    exact = comb(n, k) * p**k * (1 - p)**(n - k)          # binomial PMF ("exact")
    mu, sigma = n * p, np.sqrt(n * p * (1 - p))
    # normal density N(np, np(1 - p)) evaluated at each integer k ("approximation")
    approx = np.exp(-(k - mu)**2 / (2 * sigma**2)) / (sigma * np.sqrt(2 * np.pi))
    gap = np.abs(exact - approx).max()
    print(f"n={n:3}, p={p:4}: sigma={sigma:.2f}  peak={exact.max():.4f}  max gap={gap:.4f}")

for n in (100, 30, 10, 5):
    compare(n, 0.5)
compare(30, 0.02)
below = norm.cdf(0, 0.6, np.sqrt(30 * 0.02 * 0.98))   # N(np, np(1 - p)) below 0
print(f"n=30, p=0.02: normal mass below 0 = {below:.3f}")
