import numpy as np
from scipy import stats

rng = np.random.default_rng(0)
z = rng.choice([0, 10], p=[0.9, 0.1], size=200_000)

print(f"skewness  {stats.skew(z):.2f}")                       # theory: 2.67
print(f"kurtosis  {stats.kurtosis(z, fisher=False):.2f}")      # theory: 8.11
print(f"default   {stats.kurtosis(z):.2f}  (excess = kurtosis - 3)")
