"""
Production-grade NSE Option Chain Fetcher
Fetches NIFTY options chain data from NSE with retry logic and error handling
"""
import requests
import json
import time
from pathlib import Path
from datetime import datetime, timezone

URL = "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY"
HDR = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json,text/plain,*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/",
    "Origin": "https://www.nseindia.com"
}

def fetch_with_retry(max_retries=3, delay=2):
    """Fetch option chain with retry logic"""
    s = requests.Session()
    s.headers.update(HDR)
    
    for attempt in range(max_retries):
        try:
            # First visit main page to establish session and get cookies
            print(f"Attempt {attempt + 1}: Establishing NSE session...")
            s.get("https://www.nseindia.com", headers=HDR, timeout=10)
            time.sleep(1)  # Small delay to ensure cookies are set
            
            # Fetch option chain
            print(f"Fetching option chain data...")
            r = s.get(URL, headers=HDR, timeout=20)
            r.raise_for_status()
            
            data = r.json()
            
            # Verify data structure
            if not isinstance(data, dict):
                raise ValueError("Invalid response format: not a dictionary")
            
            if "records" not in data:
                raise ValueError("Invalid response: missing 'records' key")
            
            records = data.get("records", {})
            if "data" not in records:
                raise ValueError("Invalid response: missing 'records.data' key")
            
            # Verify we have actual data
            chain_data = records.get("data", [])
            if not chain_data or len(chain_data) == 0:
                raise ValueError("No option chain data found in response")
            
            # Verify spot price exists
            spot = records.get("underlyingValue")
            if not spot or spot <= 0:
                raise ValueError("Invalid or missing spot price")
            
            print(f"[OK] Successfully fetched option chain: {len(chain_data)} strikes, Spot: {spot}")
            return data
            
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] Network error (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                print(f"  Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                raise
        except (ValueError, KeyError) as e:
            print(f"[ERROR] Data validation error (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                print(f"  Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                raise
        except Exception as e:
            print(f"[ERROR] Unexpected error (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                print(f"  Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                raise
    
    raise Exception("Failed to fetch option chain after all retries")

def main():
    try:
        Path("data").mkdir(exist_ok=True)
        
        print("=" * 60)
        print("NSE Option Chain Fetcher")
        print("=" * 60)
        
        data = fetch_with_retry()
        
        # Save raw chain data
        with open("data/chain_raw.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        
        # Save metadata
        meta = {
            "updatedAt": datetime.now(timezone.utc).isoformat(),
            "strikesCount": len(data.get("records", {}).get("data", [])),
            "spot": data.get("records", {}).get("underlyingValue"),
            "status": "success"
        }
        with open("data/chain_meta.json", "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2)
        
        print(f"[OK] Data saved successfully")
        print(f"  - Strikes: {meta['strikesCount']}")
        print(f"  - Spot Price: Rs {meta['spot']}")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n[ERROR] Fatal error: {e}")
        print("Please check your internet connection and NSE website status.")
        raise

if __name__ == "__main__":
    main()
