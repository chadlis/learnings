from scipy.stats import binom, norm

n, p = 400, 0.5
mu, sigma = n * p, (n * p * (1 - p)) ** 0.5   # 200 and 10
terms = range(190, 231)
exact = sum(binom.pmf(k, n, p) for k in terms)   # Brunton's "monster" sum
print(f"{len(terms)} terms, exact = {exact:.4f}")
naive = norm.cdf(230, mu, sigma) - norm.cdf(190, mu, sigma)
cc = norm.cdf(230.5, mu, sigma) - norm.cdf(189.5, mu, sigma)
print(f"normal from 190 to 230 = {naive:.4f}   from 189.5 to 230.5 = {cc:.4f}")
print(f"half of the two end bars = {(binom.pmf(190, n, p) + binom.pmf(230, n, p)) / 2:.4f}")

s = 2.5 ** 0.5                                # 10 coins: sigma = sqrt(2.5)
print(f"10 coins, P(X <= 3): exact {binom.cdf(3, 10, 0.5):.4f}, "
      f"no correction {norm.cdf(3, 5, s):.4f}, corrected {norm.cdf(3.5, 5, s):.4f}")
