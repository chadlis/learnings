import numpy as np

rng = np.random.default_rng(6)
h = rng.normal(69, 3, 200_000)                      # true heights, inches
zone = (h >= 70.5) & (h < 72)                       # from 5'10.5" to just under 6'
bump = zone & (rng.random(h.size) < 0.5)            # half of them say "6 feet"
r = np.where(bump, 72.0, h)                         # reported heights
print(f"share reporting exactly 72 in: {np.mean(r == 72):.4f}")

for w in (2, 1, 0.5, 0.1):
    edges = 72 + w * (np.arange(-150, 151) - 0.5)   # bins centred on 72 (bin 150)
    dens, _ = np.histogram(r, edges, density=True)
    other = np.delete(dens, 150).max()
    print(f"bin width {w:>3}: bar at 72 = {dens[150]:.3f}   tallest other = {other:.3f}")

F = lambda x: np.mean(r <= x)                       # empirical CDF
print(f"F(71.999) = {F(71.999):.4f}   F(72) = {F(72):.4f}   jump = {F(72) - F(71.999):.4f}")
