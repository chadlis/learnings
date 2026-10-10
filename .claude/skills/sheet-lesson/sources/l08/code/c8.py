import numpy as np

rng = np.random.default_rng(0)
lam = 2.0
t = rng.exponential(scale=1 / lam, size=200_000)   # numpy takes the mean 1/λ, not λ

print(f"mean   {t.mean():.4f}   (1/λ = {1/lam})")
print(f"sd     {t.std():.4f}   (1/λ = {1/lam})")
print(f"median {np.median(t):.4f}   (ln2/λ = {np.log(2)/lam:.4f})")
