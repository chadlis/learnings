"""Every number written in lesson l01, recomputed."""
from math import comb, perm, factorial, log10, exp
from fractions import Fraction as F
from itertools import product, permutations, combinations, combinations_with_replacement as cwr

print("== n1 cadre")
print("P(7 heads/10) =", F(comb(10,7), 2**10), comb(10,7)/2**10)
print("P(10 heads/10; 1/2) =", 1/2**10)
print("3 dice sum 13 =", sum(1 for t in product(range(1,7),repeat=3) if sum(t)==13), "/216 =", 21/216)
print("C(52,5) =", comb(52,5))
lik=lambda k,t: comb(10,k)*t**k*(1-t)**(10-k)
print("p(7;0.5)=%.4f p(7;0.7)=%.4f p(10;0.5)=%.6f p(10;1)=%.3f p(7;0.3)=%.4f" % (lik(7,.5),lik(7,.7),lik(10,.5),lik(10,1),lik(7,.3)))
print("p(5;0.5)=%.4f" % lik(5,.5))

print("== n2")
coins=list(product('PF',repeat=2)); print("2 coins", coins, sum('P' in c for c in coins), sum('P' not in c for c in coins))
dice=list(product(range(1,7),repeat=2))
A=[d for d in dice if 5 in d]; print("at least one 5:", len(A), F(len(A),36), len(A)/36)
print("method3", F(1,6)+F(5,6)*F(1,6), "complement", 1-F(25,36))
print("sum 7:", sum(1 for d in dice if sum(d)==7), "doubles:", sum(1 for d in dice if d[0]==d[1]))
for q in (1/6, .25, .3, .4, .5):
    print(" loaded q=%.3f P(at least one 5)=%.4f" % (q, 1-(1-q)**2))
ms=list(cwr(range(1,7),2)); print("unordered pairs", len(ms), "with a 5:", sum(5 in m for m in ms), 6/21)
print("dAlembert 2/3 vs 3/4")

print("== n3")
print(2**2, 2**3, 6*6, 2**10, 26**4*10**2, 4*3*5, 4*3*5*5)
print("second die > first:", sum(1 for a,b in dice if b>a))
print("2^1000 ~ 10^%.2f" % (1000*log10(2)))
print("2^5", 2**5)

print("== n4")
print(perm(52,5), 52*51*50*49*48, 52**5)
print(26*25*24*23*10*9, 26*25*24*23, 26**4, (26*25*24*23)/26**4)
print("podium", perm(8,3))
print("52! = %.4e" % factorial(52))
V=50257
print("V^3 = %.4e" % V**3, " V^1024 = 10^%.1f" % (1024*log10(V)))
print("n=5 r=3:", len(list(product(range(5),repeat=3))), len(list(permutations(range(5),3))))
for n,rs in ((6,(1,2,3,4,5,6)),(26,(2,3,4,5,6,8)),(365,(10,20,22,23,30,40,50,57,70))):
    print(" n=%d" % n, ["r=%d:%.4f" % (r, perm(n,r)/n**r) for r in rs])

print("== n5")
print(perm(52,5)//factorial(5), comb(52,5), perm(5,3), perm(5,3)//6, comb(5,3))
print([comb(10,k) for k in range(11)], sum(comb(10,k) for k in range(11)))
s=sum(comb(10,k) for k in range(5,11)); print("at least 5 heads", s, F(s,1024), s/1024)
print("carre", 13*48, 13*48/comb(52,5), "1 in", comb(52,5)/(13*48))
print("straight flush", 40, 40/comb(52,5))
print("loto 6/49", comb(49,6))
print("C(20,5)", comb(20,5), "2^20", 2**20)
print("C(52,47)", comb(52,47))
for k in range(11): print(" at least %d heads: %d/1024 = %.4f" % (k, sum(comb(10,j) for j in range(k,11)), sum(comb(10,j) for j in range(k,11))/1024))

print("== n6")
print(len(list(cwr(range(6),2))), comb(7,2), comb(8,3), comb(6,3), comb(8,2), comb(19,10))
print("10!/10^10 =", factorial(10)/10**10)
print("{5,5}", 1/36, "{1,5}", 2/36)

print("== n7")
print("dice four:", len(list(product(range(6),repeat=2))), len(list(permutations(range(6),2))), len(list(combinations(range(6),2))), len(list(cwr(range(6),2))))
print("62^8 =", 62**8, "%.3e" % 62**8)
print("carre ordered", 624*120, 624*120/perm(52,5))
print("36/2 =", 36/2, "30/2 =", 30/2)
