import numpy as np

rng = np.random.default_rng(0)
u = rng.uniform(0, 1, 1_000_000)

# Y = 2U: the histogram of Y sits at height 0.5, not 1
h, _ = np.histogram(2 * u, bins=4, range=(0, 2), density=True)
print("Y = 2U, histogram heights:", h.round(3))

# copying the density, f_U(y / 2) = 1 on [0, 2], gives area 2
y = np.linspace(0, 2, 200_001)
print("area of the copied density:", round(np.trapezoid(np.ones_like(y), y), 3))

# Y = -ln U: CDF to CDF gives P(Y <= t) = 1 - e^(-t), an Exp(1)
e = -np.log(u)
for t in [0.5, 1.0, 2.0]:
    print(f"P(-ln U <= {t}): simulated {np.mean(e <= t):.4f}, method {1 - np.exp(-t):.4f}")

# hours -> minutes: same event, same probability; the density drops by 60
T = rng.exponential(1 / 4, 1_000_000)  # hours, rate 4 per hour
M = 60 * T                             # minutes
print("P(T <= 0.1 h) =", np.mean(T <= 0.1).round(4))
print("P(M <= 6 min) =", np.mean(M <= 6).round(4))
print("first minute:", np.mean(M <= 1).round(4), " exact", round(1 - np.exp(-4 / 60), 4),
      " rate x width = 4/60 =", round(4 / 60, 4))
