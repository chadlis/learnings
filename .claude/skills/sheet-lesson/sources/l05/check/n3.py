import math
from scipy import stats, integrate
lam=1/100
print("bulb P(T>=50)",math.exp(-0.5),"sqrt e",math.sqrt(math.e),"1/1.4",1/1.4)
print("bulb median",100*math.log(2),"P(50<T<100)",math.exp(-0.5)-math.exp(-1))
print("brunton interval w/o lambda e^-50 - e^-100", math.exp(-50)-math.exp(-100))
lp=math.log(2)/138
print("polonium lambda/day",lp,"mean life",1/lp,"P(T>365)",math.exp(-365*lp),"2^(-365/138)",2**(-365/138))
print("99% decayed t",math.log(100)/lp, "years",math.log(100)/lp/365.25)
print("90% decayed",math.log(10)/lp)
print("spams 4/h: mean min",60/4,"P(T>15min)",math.exp(-1),"P(T>30)",math.exp(-2),"median min",60*math.log(2)/4,"P(15<T<30)",math.exp(-1)-math.exp(-2))
print("frac waits shorter than mean",1-math.exp(-1))
print("f(0)=lambda=4 per hour; in per minute",4/60)
# normalisation and cdf check
f=lambda t: 4*math.exp(-4*t)
print("integral",integrate.quad(f,0,math.inf)[0],"F(0.25)",integrate.quad(f,0,0.25)[0],1-math.exp(-1))
print("E via survival", integrate.quad(lambda t: math.exp(-4*t),0,math.inf)[0])
print("half-life after 138 days remain 0.5; after 276: 0.25; after 414:",0.125)
for t in [0,69,138,276,365,552,917]: print(t, 2**(-t/138))
print("bulb remaining at t (mean 100):",[ (t, round(math.exp(-t/100),4)) for t in [0,50,69.3,100,200,300]])
