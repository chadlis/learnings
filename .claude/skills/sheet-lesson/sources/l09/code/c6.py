import numpy as np

rng = np.random.default_rng(5)
n, reps = 1000, 10_000
# law of one question: both right, A only, B only, both wrong (table of chain p01-04)
probs = [0.862, 0.010, 0.039, 0.089]

counts = rng.multinomial(n, probs, size=reps)              # shared test set
pA_s = (counts[:, 0] + counts[:, 1]) / n
pB_s = (counts[:, 0] + counts[:, 2]) / n
d_shared = pB_s - pA_s                                     # = (B only - A only) / n

pA = rng.binomial(n, 0.872, reps) / n                      # two separate test sets
pB = rng.binomial(n, 0.901, reps) / n
d_sep = pB - pA

print("shared  : sd(D) =", d_shared.std().round(5), "| theory 0.00694")
print("separate: sd(D) =", d_sep.std().round(5), "| theory 0.01417")
print("Cov(pA_hat, pB_hat), shared  :", np.cov(pA_s, pB_s)[0, 1].round(7), "| theory 7.63e-05")
print("Cov(pA_hat, pB_hat), separate:", np.cov(pA, pB)[0, 1].round(7))
print("share of runs with D <= 0: shared", np.mean(d_shared <= 0),
      "| separate", np.mean(d_sep <= 0))
