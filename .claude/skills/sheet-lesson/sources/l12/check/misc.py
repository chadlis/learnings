import numpy as np, math
print('float32 max', np.finfo(np.float32).max, 'ln', math.log(np.finfo(np.float32).max), '/6 =', math.log(np.finfo(np.float32).max)/6)
print('float64 max ln', math.log(np.finfo(np.float64).max), '/6 =', math.log(np.finfo(np.float64).max)/6)
with np.errstate(over='ignore'):
    for t in (14,15,118,119):
        print(t, np.mean(np.exp(np.float32(t)*np.arange(1,7,dtype=np.float32))), np.mean(np.exp(t*np.arange(1,7))))
# Student t3 variance
from scipy import stats
print('t3 var', stats.t(3).var())
# normal M'' check
