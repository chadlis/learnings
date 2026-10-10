import numpy as np

rng = np.random.default_rng(1)
n = 1_000_000
sick = rng.random(n) < 0.001                     # prior: 1 person in 1,000
u = rng.random(n)
positive = np.where(sick, u < 0.99, u < 0.01)    # sensitivity 0.99, false positives 1 %

print("people tested     :", n)
print("sick              :", sick.sum())
print("positive tests    :", positive.sum())
print("sick and positive :", (sick & positive).sum())
print(f"P(sick | +), sim. : {sick[positive].mean():.4f}")   # zoom on the positives
exact = 0.99 * 0.001 / (0.99 * 0.001 + 0.01 * 0.999)
print(f"P(sick | +), Bayes: {exact:.4f}")
