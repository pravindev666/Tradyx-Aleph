import math
from datetime import datetime, timezone

def now_iso():
    return datetime.now(timezone.utc).isoformat()

# Normal CDF via erf (avoid SciPy in Actions)
def norm_cdf(x:float) -> float:
    return 0.5*(1.0 + math.erf(x / math.sqrt(2.0)))

def d1(S,K,T,sigma,r=0.0): 
    if sigma<=0 or T<=0: return 0.0
    return (math.log(S/K)+(r+0.5*sigma*sigma)*T)/(sigma*math.sqrt(T))

def d2(S,K,T,sigma,r=0.0): 
    return d1(S,K,T,sigma,r)-sigma*math.sqrt(T)

def delta_call(S,K,T,sigma,r=0.0): 
    return norm_cdf(d1(S,K,T,sigma,r))

def delta_put(S,K,T,sigma,r=0.0):  
    return delta_call(S,K,T,sigma,r)-1.0

def gamma(S,K,T,sigma,r=0.0):
    if sigma<=0 or T<=0: return 0.0
    return math.exp(-0.5*d1(S,K,T,sigma,r)**2) / math.sqrt(2*math.pi) / (S*sigma*math.sqrt(T)+1e-12)
