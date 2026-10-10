import numpy as np
from math import comb
from scipy.stats import binom
# lot-level mixture
n=100; ps=[0.01,0.05]
E=np.mean([n*p for p in ps]); V=np.mean([n*p*(1-p) for p in ps])+np.var([n*p for p in ps])
print("mixture E",E,"Var",V,"binom same mean var",n*0.03*0.97)
rng=np.random.default_rng(0); p=rng.choice(ps,size=200000); x=rng.binomial(n,p); print("sim",x.mean(),x.var())
# figure presets
print("4 coins P(X=2)",binom.pmf(2,4,.5),"12 dice P3",binom.pmf(3,12,1/6),"100 dice P10",binom.pmf(10,100,1/6))
print("100 dice E, sd", 100/6, np.sqrt(100*(1/6)*(5/6)))
print("12 dice sd", np.sqrt(12/6*5/6))
print((1/6)**3, (5/6)**9, 220*(1/6)**3*(5/6)**9)
