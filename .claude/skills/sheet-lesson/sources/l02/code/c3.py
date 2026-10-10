import numpy as np

rng = np.random.default_rng(0)
n = 100_000
rank = rng.integers(0, 13, size=n)     # 12 = king
suit = rng.integers(0, 4, size=n)      # 0 = hearts
A = suit == 0                          # the card is a heart
B = rank == 12                         # the card is a king

freq = lambda E: E.mean()              # relative frequency of an event
print(f"freq(A or B)                      = {freq(A | B):.4f}")
# inclusion-exclusion holds exactly for frequencies too: each card is counted once
print(f"freq(A) + freq(B) - freq(A and B) = {freq(A) + freq(B) - freq(A & B):.4f}")
print(f"freq(A) + freq(B), double count   = {freq(A) + freq(B):.4f}")
print(f"exact P(A or B) = 16/52           = {16 / 52:.4f}")
