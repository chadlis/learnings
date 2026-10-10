import numpy as np
for seed in range(6):
    rng = np.random.default_rng(seed); out=[]
    for N in (100, 10_000, 1_000_000):
        x, y = rng.random(N), rng.random(N); ins = x**2+y**2<=1
        est=4*ins.mean(); se=4*ins.std()/np.sqrt(N); out.append(round(abs(est-np.pi)/se,2))
    print('c7 seed',seed,out)
for seed in range(6):
    rng = np.random.default_rng(seed); out=[]
    for n in (1,10,100,1000):
        C=rng.normal(0,np.sqrt(.5),size=(10000,1));E=rng.normal(0,np.sqrt(.5),size=(10000,n));xb=(C+E).mean(axis=1)
        out.append(round(xb.var()-(.5+.5/n),4))
    x=C+E; out.append(round(np.corrcoef(x[:,0],x[:,1])[0,1],3)); print('c6 seed',seed,out)
