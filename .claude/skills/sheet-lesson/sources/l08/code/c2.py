import numpy as np

rng = np.random.default_rng(0)
# 100,000 household wealths, right-skewed, median $200k
wealth = rng.lognormal(mean=np.log(200_000), sigma=1.79, size=100_000)
print(f"median {np.median(wealth):>12,.0f}   mean {wealth.mean():>14,.0f}")

wealth = np.append(wealth, 100e9)            # one $100B fortune joins the sample
print(f"median {np.median(wealth):>12,.0f}   mean {wealth.mean():>14,.0f}")
