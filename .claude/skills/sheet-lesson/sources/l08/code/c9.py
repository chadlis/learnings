import numpy as np

rng = np.random.default_rng(0)
x = rng.integers(1, 7, size=200_000)
x2 = rng.integers(1, 7, size=200_000)        # a second, independent die

print(f"Var(X)      ≈ {x.var():.3f}")         # 35/12 ≈ 2.917
print(f"Var(X + 5)  ≈ {(x + 5).var():.3f}")   # unchanged
print(f"Var(2X)     ≈ {(2 * x).var():.3f}")   # 4 Var(X) ≈ 11.67, not 2 Var(X)
print(f"Var(X + X') ≈ {(x + x2).var():.3f}")  # two independent dice: 2 Var(X) ≈ 5.83
