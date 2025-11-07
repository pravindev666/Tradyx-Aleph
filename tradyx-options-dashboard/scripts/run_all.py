#!/usr/bin/env python3
"""
Master script to run all data collection and computation scripts in order.
This ensures all data is up-to-date and properly formatted for the dashboard.

Production-ready with error handling, logging, and exit codes for CI/CD.
"""
import subprocess
import sys
import os
import logging
from pathlib import Path
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Change to scripts directory
script_dir = Path(__file__).parent
os.chdir(script_dir)

def run_script(name, description):
    """Run a Python script and handle errors with production-level logging"""
    logger.info(f"\n{'='*70}")
    logger.info(f"Running: {name}")
    logger.info(f"Description: {description}")
    logger.info(f"{'='*70}")
    
    start_time = datetime.now()
    
    try:
        result = subprocess.run(
            [sys.executable, name],
            capture_output=True,
            text=True,
            check=True,
            timeout=600  # 10 minute timeout per script
        )
        if result.stdout:
            logger.info(result.stdout)
        if result.stderr:
            logger.warning(f"Warnings from {name}: {result.stderr}")
        
        elapsed = (datetime.now() - start_time).total_seconds()
        logger.info(f"[OK] {name} completed successfully in {elapsed:.2f}s")
        return True
    except subprocess.TimeoutExpired:
        logger.error(f"[ERROR] {name} timed out after 10 minutes")
        return False
    except subprocess.CalledProcessError as e:
        logger.error(f"[ERROR] {name} failed with exit code {e.returncode}")
        if e.stdout:
            logger.error(f"STDOUT: {e.stdout}")
        if e.stderr:
            logger.error(f"STDERR: {e.stderr}")
        return False
    except Exception as e:
        logger.error(f"[ERROR] {name} failed with exception: {e}", exc_info=True)
        return False

def main():
    """Run all scripts in the correct order with production-level error handling"""
    start_time_main = datetime.now()
    logger.info("="*70)
    logger.info("Tradyx Dashboard - Data Update Script")
    logger.info("="*70)
    logger.info("This script will run all data collection and computation scripts")
    logger.info("in the correct order to update the dashboard data.")
    logger.info(f"Start time: {start_time_main.isoformat()}")
    logger.info("")
    
    # Define scripts in execution order
    scripts = [
        ("fetch_nse_chain.py", "Fetch NSE option chain data"),
        ("fetch_yf.py", "Fetch Yahoo Finance data (NIFTY, VIX, OHLC)"),
        ("fetch_predictions.py", "Fetch prediction data (OHLC, sectors)"),
        ("compute_metrics.py", "Compute option metrics (PCR, Max Pain, IV Rank, etc.)"),
        ("compute_volatility_indicators.py", "Compute 10+ volatility indicators (including VRP Slope)"),
        ("compute_ml_predictions.py", "Compute ML-based predictions (5 models)"),
        ("compute_breadth_momentum.py", "Compute drift direction and momentum strength"),
        ("build_dashboard_json.py", "Build final dashboard.json"),
    ]
    
    results = []
    for script, description in scripts:
        success = run_script(script, description)
        results.append((script, success))
        # Continue even if one fails (non-critical scripts)
        if not success and script in ["fetch_nse_chain.py", "fetch_yf.py"]:
            logger.error(f"Critical script {script} failed. Stopping execution.")
            break
    
    # Summary
    logger.info("\n" + "="*70)
    logger.info("Execution Summary")
    logger.info("="*70)
    for script, success in results:
        status = "[OK] SUCCESS" if success else "[ERROR] FAILED"
        logger.info(f"{status}: {script}")
    
    all_success = all(success for _, success in results)
    elapsed = (datetime.now() - start_time_main).total_seconds()
    
    if all_success:
        logger.info("\n[OK] All scripts completed successfully!")
        logger.info("Dashboard data is now up-to-date.")
        logger.info(f"End time: {datetime.now().isoformat()}")
        return 0
    else:
        failed_scripts = [script for script, success in results if not success]
        logger.warning(f"\n[WARN] {len(failed_scripts)} script(s) failed: {', '.join(failed_scripts)}")
        logger.warning("Please check the errors above.")
        logger.info(f"End time: {datetime.now().isoformat()}")
        # Return 0 for CI/CD to continue (non-blocking), or 1 to fail the workflow
        return 0 if len(failed_scripts) <= 2 else 1  # Allow up to 2 non-critical failures

if __name__ == "__main__":
    sys.exit(main())

