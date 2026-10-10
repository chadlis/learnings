import numpy as np

rng = np.random.default_rng(2)
n = 1_000_000                                       # one-second windows
a = rng.poisson(2.0, n)                             # requests from service A
b = rng.poisson(3.0, n)                             # requests from service B, independent
s = a + b                                           # merged stream
print(f"merged:     mean {s.mean():.3f}  var {s.var():.3f}  P(0) {np.mean(s == 0):.5f}")
print(f"Poisson(5): mean 5      var 5      P(0) {np.exp(-5):.5f}")

t = 0.3
m = lambda x: np.mean(np.exp(t * x))                # empirical MGF at t
exact = np.exp(5 * (np.exp(t) - 1))
print(f"M_A * M_B = {m(a) * m(b):.4f}   M_(A+B) = {m(s):.4f}   exact = {exact:.4f}")
print(f"dependent, B = A:  M_(2A) = {m(2 * a):.4f}   but M_A^2 = {m(a)**2:.4f}")
