import numpy as np
from scipy import stats

rng = np.random.default_rng(0)
w = rng.exponential(scale=15, size=(400_000, 3))   # three desks, 15 min each on average

series = w.sum(axis=1)       # desk A, then B, then C
parallel = w.min(axis=1)     # three open lanes: wait for the first one to free up
print(f"series    mean {series.mean():5.2f}  sd {series.std():5.2f}   Gamma(3, 1/15): 45, {np.sqrt(3) * 15:.2f}")
print(f"parallel  mean {parallel.mean():5.2f}  sd {parallel.std():5.2f}   Exp(3/15): 5, 5")
print(f"P(series > 45)  sim {np.mean(series > 45):.4f}   Poisson(3) <= 2: {stats.poisson.cdf(2, 3):.4f}"
      f"   gamma.sf: {stats.gamma.sf(45, a=3, scale=15):.4f}")

gaps = rng.exponential(scale=1 / 5, size=(400_000, 10))   # 10 email gaps, 5 per minute
t10, ten_w = gaps.sum(axis=1), 10 * gaps[:, 0]
print(f"10th email: mean {t10.mean():.3f} sd {t10.std():.3f}   10 x one gap: mean {ten_w.mean():.3f} sd {ten_w.std():.3f}")
print(f"P(> 3 min): sum {np.mean(t10 > 3):.3f}   10 x one gap {np.mean(ten_w > 3):.3f}")
