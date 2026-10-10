import numpy as np

rng = np.random.default_rng(1)
expo = rng.exponential(scale=1000, size=400_000)   # memoryless bulbs, mean 1000 h
wear = rng.normal(1000, 200, size=400_000)         # bulbs that wear out, mean 1000 h

print("already on   exponential: alive, h left   |   wear: alive, h left")
for s in [0, 500, 1000, 1500]:
    e = expo[expo > s] - s                          # remaining life of the survivors
    w = wear[wear > s] - s
    print(f"  {s:5d} h      {np.mean(expo > s):.3f}  {e.mean():5.0f}"
          f"         |          {np.mean(wear > s):.3f}  {w.mean():5.0f}")
