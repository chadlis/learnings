import numpy as np

rng = np.random.default_rng(0)
n = 200_000
d1 = rng.integers(1, 7, n)            # first die
d2 = rng.integers(1, 7, n)            # second die
A = d1 == 3

conditions = [("second die = 5", d2 == 5, "1/6"),
              ("sum = 6", d1 + d2 == 6, "1/5"),
              ("sum = 7", d1 + d2 == 7, "1/6")]
for name, B, exact in conditions:
    kept = A[B]                       # zoom on B: keep only the rolls where B happened
    label = f"P(A | {name})"
    print(f"{label:22s} = {kept.mean():.4f}   exact {exact}   ({kept.size} rolls kept)")
print(f"{'P(A)':22s} = {A.mean():.4f}   exact 1/6")

B = d1 + d2 == 6                      # the formula gives the same number as the filter
print(f"{'P(A and B) / P(B)':22s} = {(A & B).mean() / B.mean():.4f}")
