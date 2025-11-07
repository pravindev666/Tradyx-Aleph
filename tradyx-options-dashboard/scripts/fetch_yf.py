import yfinance as yf, json
from datetime import datetime, timezone
from pathlib import Path

def series(ticker, period="5d", interval="5m", n=120):
    df = yf.Ticker(ticker).history(period=period, interval=interval, auto_adjust=False)
    if df.empty: return []
    return [float(x) for x in df["Close"].tail(n).values]

def daily_series(ticker, period="1y"):
    df = yf.Ticker(ticker).history(period=period, interval="1d", auto_adjust=False)
    if df.empty: return []
    return [float(x) for x in df["Close"].values]

def main():
    Path("data").mkdir(exist_ok=True)
    spotSeries = series("^NSEI","5d","5m",120)
    vixSeries  = series("^INDIAVIX","5d","5m",120)
    vixDaily   = daily_series("^INDIAVIX","1y")
    
    # Fetch LIVE/CURRENT spot price from yfinance (real-time during market hours, close when closed)
    nifty_ticker = yf.Ticker("^NSEI")
    try:
        # Get current/live price from yfinance info (this gives real-time price during market hours)
        nifty_info = nifty_ticker.info
        current_spot = nifty_info.get("regularMarketPrice") or nifty_info.get("currentPrice") or nifty_info.get("previousClose")
        
        # If info doesn't have live price, try fast_info
        if current_spot is None:
            try:
                fast_info = nifty_ticker.fast_info
                current_spot = fast_info.get("lastPrice") or fast_info.get("regularMarketPrice")
            except:
                pass
        
        # If still None, get from latest 1-day data (will be close if market closed, or latest if market open)
        if current_spot is None:
            nifty_hist = nifty_ticker.history(period="1d", interval="1m", auto_adjust=False)
            if not nifty_hist.empty:
                current_spot = float(nifty_hist["Close"].iloc[-1])
        
        # Final fallback to last 5-minute value
        if current_spot is None:
            current_spot = spotSeries[-1] if spotSeries else None
    except Exception as e:
        print(f"[WARN] Error fetching live NIFTY price: {e}")
        # Fallback to last 5-minute value
        current_spot = spotSeries[-1] if spotSeries else None
    
    # Fetch NIFTY daily OHLC data for reference
    nifty_hist = nifty_ticker.history(period="5d", interval="1d", auto_adjust=False)
    nifty_ohlc = {}
    if not nifty_hist.empty and len(nifty_hist) >= 1:
        latest = nifty_hist.iloc[-1]
        nifty_ohlc = {
            "open": float(latest["Open"]) if "Open" in latest else None,
            "high": float(latest["High"]) if "High" in latest else None,
            "low": float(latest["Low"]) if "Low" in latest else None,
            "close": float(latest["Close"]) if "Close" in latest else None
        }
    
    # Fetch LIVE/CURRENT VIX from yfinance (real-time during market hours, close when closed)
    vix_ticker = yf.Ticker("^INDIAVIX")
    try:
        # Get current/live VIX from yfinance info
        vix_info = vix_ticker.info
        current_vix = vix_info.get("regularMarketPrice") or vix_info.get("currentPrice") or vix_info.get("previousClose")
        
        # If info doesn't have live price, try fast_info
        if current_vix is None:
            try:
                fast_info = vix_ticker.fast_info
                current_vix = fast_info.get("lastPrice") or fast_info.get("regularMarketPrice")
            except:
                pass
        
        # If still None, get from latest 1-day data
        if current_vix is None:
            vix_hist_live = vix_ticker.history(period="1d", interval="1m", auto_adjust=False)
            if not vix_hist_live.empty:
                current_vix = float(vix_hist_live["Close"].iloc[-1])
        
        # Final fallback to last 5-minute value
        if current_vix is None:
            current_vix = vixSeries[-1] if vixSeries else None
    except Exception as e:
        print(f"[WARN] Error fetching live VIX: {e}")
        # Fallback to last 5-minute value
        current_vix = vixSeries[-1] if vixSeries else None
    
    # Fetch VIX daily OHLC data (last 2 days to calculate change)
    vix_hist = vix_ticker.history(period="5d", interval="1d", auto_adjust=False)
    vix_ohlc = {}
    if not vix_hist.empty and len(vix_hist) >= 2:
        latest = vix_hist.iloc[-1]
        previous = vix_hist.iloc[-2]
        vix_ohlc = {
            "open": float(latest["Open"]) if "Open" in latest else None,
            "high": float(latest["High"]) if "High" in latest else None,
            "low": float(latest["Low"]) if "Low" in latest else None,
            "close": float(latest["Close"]) if "Close" in latest else None,
            "previousClose": float(previous["Close"]) if "Close" in previous else None
        }
    
    # Calculate 52-week high and low for VIX
    vix_52w_high = max(vixDaily) if vixDaily else None
    vix_52w_low = min(vixDaily) if vixDaily else None
    
    out = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "spotSeries": spotSeries, 
        "vixSeries": vixSeries,
        "spot": current_spot,  # LIVE spot price from yfinance (real-time during market hours, close when closed)
        "vix": current_vix,  # LIVE VIX from yfinance (real-time during market hours, close when closed)
        "vixDaily": vixDaily,
        "vix52wHigh": vix_52w_high,
        "vix52wLow": vix_52w_low,
        "vixOhlc": vix_ohlc,
        "niftyOhlc": nifty_ohlc  # Include NIFTY OHLC for reference
    }
    with open("data/yf.json","w", encoding="utf-8") as f: json.dump(out, f, indent=2)

if __name__=="__main__":
    main()