import sys
from pathlib import Path

# Add parent directory to path so we can import from scripts
sys.path.insert(0, str(Path(__file__).parent.parent))

from compute_metrics import max_pain, pcr_from_chain, gamma_exposure

def sample_recs():
    # minimal synthetic sample
    strikes=[19500,19600,19700]
    recs=[]
    for k in strikes:
        recs.append({"strikePrice":k, "CE":{"openInterest":1000,"impliedVolatility":15,"lastPrice":100,"bidprice":99,"askPrice":101,"totalTradedVolume":500},
                                 "PE":{"openInterest":1200,"impliedVolatility":18,"lastPrice":110,"bidprice":109,"askPrice":111,"totalTradedVolume":600}})
    return recs

def test_max_pain():
    m = max_pain(sample_recs())
    assert m in [19500,19600,19700]

def test_pcr_oi():
    p = pcr_from_chain(sample_recs())
    assert p is not None and p > 0

def test_gamma_exposure():
    g = gamma_exposure(sample_recs(), spot=19600)
    assert isinstance(g, list) and len(g) > 0