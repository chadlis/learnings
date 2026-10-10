import numpy as np

# Brunton's homework: multiply factor by factor (365! itself overflows a float)
p_none, n = 1.0, 0
while 1 - p_none <= 0.5:
    p_none *= (365 - n) / 365      # person n+1 avoids the n days already taken
    n += 1
print(f"first n with P(share) > 0.5: {n}, P(share) = {1 - p_none:.4f}")

# simulate 100 000 rooms of 23 people
rng = np.random.default_rng(0)
days = np.sort(rng.integers(0, 365, size=(100_000, 23)), axis=1)
# after sorting, a shared birthday shows up as two equal neighbours
shared = (np.diff(days, axis=1) == 0).any(axis=1)
print(f"simulated P(share), n = 23: {shared.mean():.4f}")

pairs = 23 * 22 // 2
# treating the 253 pairs as independent events gives only an approximation
print(f"1 - (364/365)^{pairs} = {1 - (364 / 365) ** pairs:.4f}")
