import numpy as np

rng = np.random.default_rng(3)
n = 1_000_000
tpr, fpr = 0.90, 0.05                         # the classifier: same error rates everywhere

for prev in (0.50, 0.10, 0.01):
    y = rng.random(n) < prev                  # true labels, at this prevalence
    u = rng.random(n)
    pred = np.where(y, u < tpr, u < fpr)      # predicted positive
    tp, fp = (pred & y).sum(), (pred & ~y).sum()
    fn, tn = (~pred & y).sum(), (~pred & ~y).sum()
    print(f"prevalence {prev:.2f}: recall {tp / (tp + fn):.3f}  FPR {fp / (fp + tn):.3f}  "
          f"precision {tp / (tp + fp):.3f}  accuracy {(tp + tn) / n:.3f}")
