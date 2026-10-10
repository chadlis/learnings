import numpy as np

rng = np.random.default_rng(0)
half_life = 138                                   # polonium-210, in days
lam = np.log(2) / half_life                       # decay rate per day
t = rng.exponential(scale=1 / lam, size=1_000_000)  # numpy wants the mean 1/lam

print(f"lam = {lam:.5f} per day   mean life {t.mean():.1f} days (1/lam = {1/lam:.1f})")
print(f"median {np.median(t):.1f} days   (half-life {half_life})")
for d in [138, 365, 917]:
    print(f"P(T > {d} d)   sim {np.mean(t > d):.4f}   exact {np.exp(-lam * d):.4f}")

bulb = rng.exponential(scale=100, size=1_000_000)   # light bulbs, mean 100 h
print(f"bulb P(T >= 50 h)  sim {np.mean(bulb >= 50):.4f}   exact {np.exp(-0.5):.4f}")
print(f"bulb P(50 < T < 100)  sim {np.mean((bulb > 50) & (bulb < 100)):.4f}"
      f"   exact {np.exp(-0.5) - np.exp(-1):.4f}")
