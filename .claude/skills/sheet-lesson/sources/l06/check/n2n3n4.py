"""Check every number of notions n2 (aX + b), n3 (standardisation) and n4 (chi-square, 1 dof)."""
import numpy as np
from scipy import integrate, stats, special

N = stats.norm
mu, s = 15, 5
print("=== n2")
print("Y=1.8X+32: mean", 1.8 * mu + 32, " sd", 1.8 * s, " var", (1.8 * s) ** 2)
print("P(Y<=68) = P(X<=20) = Phi(1) =", round(N.cdf(1), 4), " check", round(N.cdf(68, 59, 9), 4))
print("peak f_X(15) =", round(N.pdf(15, mu, s), 4), " peak f_Y(59) =", round(N.pdf(59, 59, 9), 4),
      " ratio", round(N.pdf(15, mu, s) / N.pdf(59, 59, 9), 4))
print("f_X(20) =", round(N.pdf(20, mu, s), 4), " f_Y(68)", round(N.pdf(68, 59, 9), 4))
# heating degrees Y = 20 - X
print("Y=20-X: mean", 20 - mu, " sd", s)
print("P(Y<=0)=P(X>=20)=", round(1 - N.cdf(20, mu, s), 4), " wrong F_X(20)=", round(N.cdf(20, mu, s), 4))
print("P(Y<=5) =", round(N.cdf(5, 5, 5), 4))
# Brunton's 1/a for a=-1 gives negative density
print("1/a * f_X at a=-1, y=5:", -N.pdf(15, mu, s))
# figure 2: exponential mean 15 min under aX+b
for a, b in [(1, 0), (2, 0), (-1, 60), (0.5, 10), (-2, 30)]:
    m, sd = 15 * a + b, 15 * abs(a)
    print(f"a={a}, b={b}: E={m}, sd={sd}, f max={(1/15)/abs(a):.4f} at y={b}")
# check the density formula by numeric integration for a<0
a, b = -2, 30
f = lambda y: stats.expon.pdf((y - b) / a, scale=15) / abs(a)
v, _ = integrate.quad(f, -np.inf, b)
print("area of f_X((y-b)/a)/|a| for a=-2:", round(v, 6))
print("skew of exp:", stats.expon.stats(moments='s'))

print("=== n3")
print("P(10<X<20)=", round(N.cdf(1) - N.cdf(-1), 4))
print("P(X<7) = Phi(-1.6) =", round(N.cdf(-1.6), 4), " z=", (7 - 15) / 5)
print("P(10<X<25) = Phi(2)-Phi(-1) =", round(N.cdf(2), 4), "-", round(N.cdf(-1), 4), "=", round(N.cdf(2) - N.cdf(-1), 4))
print("P(5<X<25)=", round(N.cdf(2) - N.cdf(-2), 4), " P(0<X<30)=", round(N.cdf(3) - N.cdf(-3), 4))
print("Brunton 16: Phi(3)-Phi(-1) =", round(N.cdf(3) - N.cdf(-1), 4))
print("phi heights: N(15,25) peak", round(N.pdf(0) / 5, 4), " N(0,1) peak", round(N.pdf(0), 4))
print("erf relation: Phi(1) =", N.cdf(1), " 0.5(1+erf(1/sqrt2)) =", 0.5 * (1 + special.erf(1 / np.sqrt(2))))
print("erf(1) =", round(special.erf(1), 4), " vs Phi(1)", round(N.cdf(1), 4))
# standardising non-normal laws
print("normal: P(|Z|<1)", round(N.cdf(1) - N.cdf(-1), 4), " P(Z>2)", round(1 - N.cdf(2), 4), " P(Z<-1)", round(N.cdf(-1), 4))
print("exp(1): Z=T-1: P(|Z|<1)=P(0<T<2)", round(1 - np.exp(-2), 4), " P(Z>2)=P(T>3)", round(np.exp(-3), 4), " P(Z<-1)=0")
su = 1 / np.sqrt(12)
print("unif: sd", round(su, 4), " support +-", round(0.5 / su, 4), " P(|Z|<1)", round(2 * su, 4), " P(Z>2) = 0")
print("unif density height in z", round(su, 4))
# ML example: k-means distances
A, B, C = np.array([170, 30]), np.array([180, 30]), np.array([170, 40])
print("dist cm/k€: AB", np.linalg.norm(A - B), " AC", np.linalg.norm(A - C))
A2, B2, C2 = np.array([170, 30000]), np.array([180, 30000]), np.array([170, 40000])
print("dist cm/€: AB", np.linalg.norm(A2 - B2), " AC", np.linalg.norm(A2 - C2))
sd = np.array([10, 20])
print("standardised: AB", np.linalg.norm((A - B) / sd), " AC", np.linalg.norm((A - C) / sd))

print("=== n4")
c = stats.chi2(1)
fy = lambda y: np.exp(-y / 2) / np.sqrt(2 * np.pi * y)
for y in [0.01, 0.1, 0.5, 1, 2, 3.84, 4]:
    print(f"y={y}: f_Y={fy(y):.4f} chi2.pdf={c.pdf(y):.4f} F_Y={c.cdf(y):.4f} 2Phi(sqrt y)-1={2*N.cdf(np.sqrt(y))-1:.4f} sqrt y={np.sqrt(y):.4f}")
print("1.96^2 =", 1.96 ** 2, " chi2 0.95 quantile", round(c.ppf(0.95), 4), " norm 0.975 q", round(N.ppf(0.975), 4))
print("P(Y<=3.84) =", round(c.cdf(3.84), 4))
print("mean, var", c.mean(), c.var())
print("P(Y<=0.01) = P(|X|<=0.1)", round(c.cdf(0.01), 4), " avg density over [0,0.01]", round(c.cdf(0.01) / 0.01, 2))
v, _ = integrate.quad(lambda y: N.pdf(np.sqrt(y)) / (2 * np.sqrt(y)), 0, np.inf)
print("one branch only area", round(v, 4))
print("phi(1)=", round(N.pdf(1), 4), " contrib each at y=1:", round(N.pdf(1) / 2, 4))
for y in [0.25, 1, 2.25, 4]:
    r = np.sqrt(y)
    print(f"y={y}: sqrt={r}, phi(sqrt y)={N.pdf(r):.4f}, inner deriv 1/(2 sqrt y)={1/(2*r):.4f}, each term={N.pdf(r)/(2*r):.4f}, f_Y={N.pdf(r)/r:.4f}, F_Y={2*N.cdf(r)-1:.4f}")
# Gamma link
print("Gamma(1/2, rate 1/2) pdf at 1:", round(stats.gamma(a=0.5, scale=2).pdf(1), 4))
# chi2_k sums
for k in [1, 2, 5, 10]:
    print(f"chi2_{k}: mean {stats.chi2(k).mean()}, var {stats.chi2(k).var()}, 95% quantile {stats.chi2(k).ppf(0.95):.3f}")
# MSE as scaled chi-square
print("non-standardised: X~N(15,25), E[X^2] =", 25 + 225)
