"""Numbers added while writing the page."""
from math import comb, perm, factorial, log10
import numpy as np
# n1: area under the likelihood theta -> C(10,k) theta^k (1-theta)^(10-k) is 1/11 for every k
t = np.linspace(0, 1, 200_001)
print("likelihood areas:", [round(np.trapezoid(comb(10, k) * t**k * (1 - t)**(10 - k), t), 5) for k in (0, 3, 7, 10)], "1/11 =", round(1 / 11, 5))
print("argmax k=7:", t[np.argmax(comb(10, 7) * t**7 * (1 - t)**3)])
# n4 / fig2 readouts
print("365^23 = %.3e, perm(365,23) = %.3e" % (365.0**23, float(perm(365, 23))), "6^7 =", 6**7)
print("plates 36^6 =", 36**6)
print("PAPA anagrams:", factorial(4) // (factorial(2) * factorial(2)))
# n6
print("C(13,10) =", comb(13, 10), " dominos C(8,2) =", comb(8, 2), " C(8,3) =", comb(8, 3))
# n3
print("10*9 =", 10 * 9, " C(10,2) =", comb(10, 2))
# d'Alembert: P(first H)=1/2, P(TH)=1/4, P(TT)=1/4 -> at least one head = 3/4
print("dAlembert:", 1/2 + 1/4)
# bootstrap (1-1/n)^n
for n in (10, 1000): print(n, round((1 - 1 / n)**n, 4))
