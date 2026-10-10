import numpy as np

rng = np.random.default_rng(0)
n = 1_000_000
# Box-Muller: draw the polar coordinates first, then go back to x, y
r = np.sqrt(-2 * np.log(1 - rng.random(n)))      # Rayleigh, since P(R <= r) = 1 - exp(-r^2 / 2)
theta = 2 * np.pi * rng.random(n)                 # uniform angle, independent of r
x, y = r * np.cos(theta), r * np.sin(theta)
print(f"sd of x {x.std():.3f}, sd of y {y.std():.3f}, corr(x, y) {np.corrcoef(x, y)[0, 1]:.3f}")
print(f"P(R <= 1)  = {np.mean(r <= 1):.4f}   exact 1 - exp(-1/2) = {1 - np.exp(-0.5):.4f}")
print(f"P(|X| <= 1) = {np.mean(np.abs(x) <= 1):.4f}   one coordinate only")
print(f"E[R] = {r.mean():.4f}   exact sqrt(pi/2) = {np.sqrt(np.pi / 2):.4f}")

for d in (2, 10, 100):                            # norm of a d-dimensional standard gaussian
    norm = np.linalg.norm(rng.standard_normal((20_000, d)), axis=1)
    print(f"d = {d:3d}: norm {norm.mean():5.2f} ± {norm.std():.2f}, P(norm < 1) = {np.mean(norm < 1):.4f}")
