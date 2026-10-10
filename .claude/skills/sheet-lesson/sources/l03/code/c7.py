from fractions import Fraction
from itertools import product

omega = list(product(range(1, 7), repeat=2))       # the 36 equally likely pairs

def P(event):
    return Fraction(sum(1 for w in omega if event(w)), len(omega))

A = lambda w: w[0] == 3                            # first die shows 3
for name, B in [("second = 5", lambda w: w[1] == 5),
                ("sum = 6", lambda w: w[0] + w[1] == 6),
                ("sum = 7", lambda w: w[0] + w[1] == 7)]:
    p_ab = P(lambda w: A(w) and B(w))
    prod = P(A) * P(B)
    verdict = "independent" if p_ab == prod else "dependent"
    print(f"{name:10s}  P(A and B) = {str(p_ab):5s}  P(A)P(B) = {str(prod):6s}  {verdict}")
