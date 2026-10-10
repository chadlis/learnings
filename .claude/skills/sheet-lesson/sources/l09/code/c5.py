import numpy as np

rng = np.random.default_rng(4)
s1, s2, theta = 2.0, 1.0, np.radians(45)
U = s1 * rng.standard_normal(500_000)             # independent axes
V = s2 * rng.standard_normal(500_000)
X = U * np.cos(theta) - V * np.sin(theta)         # rotate the cloud by 45 degrees
Y = U * np.sin(theta) + V * np.cos(theta)

S = np.cov(X, Y)
print("covariance matrix:\n", S.round(3))
print("rho:", (S[0, 1] / np.sqrt(S[0, 0] * S[1, 1])).round(3), "| theory 0.6")
vals, vecs = np.linalg.eigh(S)                    # axes of the ellipse
print("eigenvalues:", vals.round(3), "| theory sigma2^2 = 1, sigma1^2 = 4")
angle = np.degrees(np.arctan(vecs[1, 1] / vecs[0, 1]))
print("major axis angle:", angle.round(1), "degrees")
print("regression slope of Y on X:", (S[0, 1] / S[0, 0]).round(3), "| major axis: 1")
