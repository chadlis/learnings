from scipy.stats import norm
mu,s=1.75,0.07
F=lambda x: norm.cdf(x,mu,s); f=lambda x: norm.pdf(x,mu,s)
for a,b in ((1.70,1.82),(1.70,1.80),(1.74,1.76)):
    print(a,b,"F(a)",round(F(a),4),"F(b)",round(F(b),4),"area",round(F(b)-F(a),4),"f(a)",round(f(a),3),"f(b)",round(f(b),3))
# v2 bins
for w in (0.10,0.05,0.02,0.01):
    pc=F(mu+w/2)-F(mu-w/2); print("w",w,"central",round(pc,4),"ratio",round(pc/w,3))
print("f(1.75)",f(1.75),"in cm",norm.pdf(175,175,7))
print("F(1.70)",F(1.70),"F(1.80)",F(1.80))
