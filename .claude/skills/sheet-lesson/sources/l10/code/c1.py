import numpy as np

rng = np.random.default_rng(0)
n, a = 1_000_000, 20
laws = {
    "exponential, mean 10": rng.exponential(10, n),
    "two points {0, 20}": rng.choice([0, 20], size=n),
    "{-30, 20}, P(20) = 0.8": rng.choice([-30, 20], p=[0.2, 0.8], size=n),  # X < 0: Markov fails
}
for name, x in laws.items():
    print(f"{name:23s} mean {x.mean():5.2f}   P(X >= 20) {np.mean(x >= a):.4f}"
          f"   E[X]/a {x.mean() / a:.4f}")
