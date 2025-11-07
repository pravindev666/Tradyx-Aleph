"""
Production configuration for data generation scripts
"""
import os
import logging
from pathlib import Path

# Setup production logging
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO').upper()
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('scripts.log') if os.getenv('LOG_TO_FILE') == 'true' else logging.NullHandler()
    ]
)

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR / "data"
PUBLIC_DATA_DIR = Path(__file__).parent.parent / "public" / "data"

# Ensure directories exist
DATA_DIR.mkdir(exist_ok=True)
PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)

# API Configuration
NSE_RETRY_ATTEMPTS = int(os.getenv('NSE_RETRY_ATTEMPTS', '3'))
NSE_RETRY_DELAY = int(os.getenv('NSE_RETRY_DELAY', '2'))
YFINANCE_TIMEOUT = int(os.getenv('YFINANCE_TIMEOUT', '30'))

# Data freshness
STALE_SOFT_MIN = int(os.getenv('STALE_SOFT_MIN', '6'))
STALE_HARD_MIN = int(os.getenv('STALE_HARD_MIN', '20'))

# Production flags
IS_PRODUCTION = os.getenv('NODE_ENV') == 'production' or os.getenv('ENVIRONMENT') == 'production'
ENABLE_DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'

