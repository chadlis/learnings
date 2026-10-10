from fractions import Fraction
from itertools import product, combinations

coins = list(product("HT", repeat=2))              # HH, HT, TH, TT, each 1/4
events = {"A": lambda w: w[0] == "H",              # first coin heads
          "B": lambda w: w[1] == "H",              # second coin heads
          "C": lambda w: w[0] == w[1]}             # both coins agree

def P(event):
    return Fraction(sum(1 for w in coins if event(w)), len(coins))

for k in (2, 3):
    for names in combinations("ABC", k):
        joint = P(lambda w: all(events[e](w) for e in names))
        prod = Fraction(1)
        for e in names:
            prod *= P(events[e])
        label = " and ".join(names)
        verdict = "equal" if joint == prod else "NOT equal"
        print(f"{label:13s} = {str(joint):4s} product = {str(prod):4s} {verdict}")
