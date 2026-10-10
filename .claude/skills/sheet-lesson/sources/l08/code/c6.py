import numpy as np

values = np.array([0, 10])
probs = np.array([0.9, 0.1])
mu = (values * probs).sum()
contrib = probs * (values - mu) ** 2          # each value's share of the variance
var = contrib.sum()
print(f"mean {mu}, variance {var}, sd {np.sqrt(var)}")
print("share of each value:", contrib / var)

rng = np.random.default_rng(0)
z = rng.choice(values, p=probs, size=100_000)
print(f"theory {var}   sample variance {np.var(z):.3f}")   # sampling error, not a formula error
