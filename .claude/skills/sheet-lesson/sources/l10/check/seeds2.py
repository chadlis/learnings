import numpy as np
for seed in range(30):
    rng = np.random.default_rng(seed); out=[]
    for N in (100, 10_000, 1_000_000):
        x, y = rng.random(N), rng.random(N); ins = x**2+y**2<=1
        est=4*ins.mean(); se=4*ins.std()/np.sqrt(N); out.append(round(abs(est-np.pi)/se,2))
    z=rng.normal(size=1_000_000); d=(np.exp(z).mean()-np.exp(.5))/0.00216
    if max(out)<1.2 and abs(d)<1: print('seed',seed,out,round(d,2), round(np.exp(z).mean(),4))
