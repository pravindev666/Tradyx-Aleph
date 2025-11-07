# FII/DII Data Integration

## Current Status

**FII/DII data is currently showing placeholder/hardcoded values:**
- FII Net: ₹1,234 Cr
- DII Net: ₹987 Cr
- These are NOT being fetched from any API

## Why Placeholder Data?

FII/DII (Foreign Institutional Investors / Domestic Institutional Investors) flow data requires:
1. **NSE/BSE API Access**: Official institutional flow data is typically available through:
   - NSE Institutional Trading Data API
   - BSE Institutional Trading Data API
   - Third-party data providers (Bloomberg, Reuters, etc.)

2. **Data Sources** (if you want to integrate):
   - **NSE Website**: https://www.nseindia.com/market-data/equity-derivatives-watch
   - **BSE Website**: https://www.bseindia.com/markets/equity/EQReports/NetBuySell.aspx
   - **SEBI Data**: https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=5&smid=0
   - **Third-party APIs**: Moneycontrol, Economic Times APIs (may require subscription)

## How to Add Real FII/DII Data

### Option 1: Web Scraping (Not Recommended)
- Scrape from NSE/BSE websites
- **Risky**: Websites may block scraping, data format may change
- **Legal**: Check terms of service

### Option 2: Official API (Recommended)
- Contact NSE/BSE for API access
- May require registration/subscription
- Most reliable and legal

### Option 3: Third-party Data Provider
- Use services like:
  - Alpha Vantage
  - Quandl
  - Financial Modeling Prep
  - May require API keys and subscriptions

### Option 4: Manual Update Script
- Create a script that you run daily to fetch and update data
- Store in JSON file similar to other metrics

## Current Implementation

The FII/DII tile shows:
- **Placeholder data** with a note: "*Placeholder data - API integration pending"
- **Modal description** explains this is placeholder data
- **Ready for integration** - just need to add data fetching logic

## Next Steps

1. **Choose data source** (NSE API, BSE API, or third-party)
2. **Create fetch script** similar to `fetch_nse_chain.py`:
   ```python
   # scripts/fetch_fii_dii.py
   # Fetch FII/DII data from chosen source
   # Save to data/fii_dii.json
   ```
3. **Update build_dashboard_json.py** to include FII/DII data
4. **Update dashboard component** to read from data instead of hardcoded values

## Note

For now, the placeholder data serves as a UI placeholder. The infrastructure is ready - just needs real data source integration.

