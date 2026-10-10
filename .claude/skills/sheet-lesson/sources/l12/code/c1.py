import numpy as np

# Y ~ N(0, 1) and X = exp(Y) is log-normal. Its "sisters" reweight the density
# of ln X by (1 + a sin(2 pi y)), |a| <= 1.
y = np.linspace(-12, 16, 400_001)
dy = y[1] - y[0]
phi = np.exp(-y**2 / 2) / np.sqrt(2 * np.pi)

for a in (0.0, 0.5, 1.0):
    w = phi * (1 + a * np.sin(2 * np.pi * y))       # density of ln X for this sister
    assert w.min() >= 0                             # still a density
    moments = [np.sum(np.exp(k * y) * w) * dy for k in range(5)]   # E[X^k]
    cdf2 = np.sum(w[y <= np.log(2)]) * dy           # P(X <= 2)
    m = "  ".join(f"{v:.3f}" for v in moments)
    print(f"a = {a}:  E[X^k], k = 0..4: {m}   P(X <= 2) = {cdf2:.4f}")

m = "  ".join(f"{np.exp(k * k / 2):.3f}" for k in range(5))
print(f"theory e^(k^2/2):          {m}")
