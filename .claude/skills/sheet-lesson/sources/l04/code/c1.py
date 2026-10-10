import itertools
from collections import Counter
import numpy as np

omega = ["".join(s) for s in itertools.product("HT", repeat=4)]  # 16 sequences
X = {w: w.count("H") for w in omega}  # the random variable: a function on omega
print(len(omega), "sequences; X('HHTH') =", X["HHTH"])
law = Counter(X.values())
print("law of X, in 16ths:", [law[k] for k in range(5)])

p = 0.5                                       # fixed: a property of the coin
rng = np.random.default_rng(1)
for draw in range(5):
    flips = "".join("H" if u < p else "T" for u in rng.random(4))  # a new draw
    x = X[flips]                              # realization of X on this draw
    print(f"draw {draw}: {flips}  x = {x}  p_hat = {x / 4:.2f}  p = {p}")
