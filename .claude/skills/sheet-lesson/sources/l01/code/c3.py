from collections import Counter
from itertools import combinations, permutations
from math import comb

# Each 3-card hand out of 5 cards corresponds to exactly 3! = 6 sequences
seqs = list(permutations("ARDVT", 3))        # T stands for the 10
hands = Counter(frozenset(s) for s in seqs)
print(len(seqs), "sequences,", len(hands), "hands,", set(hands.values()), "sequences per hand")

# Enumerate all 5-card poker hands and count four of a kind
deck = [(rank, suit) for rank in range(13) for suit in range(4)]
n_hands = n_quads = 0
for hand in combinations(deck, 5):
    n_hands += 1
    n_quads += 4 in Counter(rank for rank, _ in hand).values()
print(n_hands, "hands =", comb(52, 5), "| four of a kind:", n_quads, "=", 13 * 48)
print(f"P(four of a kind) = {n_quads / n_hands:.6f}, about 1 in {n_hands / n_quads:.0f}")
