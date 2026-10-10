from scipy import stats
import math
p=1/6;q=5/6
print("P(X=1)",p,"P(X=2)",q*p,"P(X=10)",q**9*p,"P(X>=10)",q**9, "scipy sf(9)",stats.geom.sf(9,p))
print("mean",1/p,"var",q/p**2,"sd",math.sqrt(q/p**2), "scipy", stats.geom.mean(p), stats.geom.var(p))
print("median: P(X<=3)",1-q**3,"P(X<=4)",1-q**4, "ln2/ln(6/5)",math.log(2)/math.log(6/5), "scipy median",stats.geom.median(p))
print("coin p=1/2: P(X=3)",0.5**3,"P(X>=3)",0.5**2)
print("pass@5 p=0.2:",1-0.8**5, "pass@1",0.2, "pass@10",1-0.8**10)
print("mixture half p=.4 half p=0: pass@5", 0.5*(1-0.6**5), "vs mean p .2 ->",1-0.8**5)
print("retries p=0.9: E attempts",1/0.9,"P(>=3 attempts)",0.1**2)
print("memoryless: P(X>20+9 | X>20) =",q**29/q**20, "=q^9", q**9)
# sum geometric series check
s=sum(q**(n-1)*p for n in range(10,2000)); print("series sum",s)
print("P(X>=k) list", [round(q**(k-1),4) for k in range(1,13)])
print("P(X=k) list", [round(q**(k-1)*p,4) for k in range(1,13)])
