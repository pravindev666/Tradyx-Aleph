"""
Production-level error handling utilities for Python scripts
"""
import sys
import traceback
import logging
from functools import wraps
from typing import Callable, Any

logger = logging.getLogger(__name__)

def handle_errors(exit_on_error: bool = False):
    """
    Decorator for production-level error handling
    
    Args:
        exit_on_error: If True, exit with code 1 on error. If False, return None.
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            try:
                return func(*args, **kwargs)
            except KeyboardInterrupt:
                logger.warning("Script interrupted by user")
                sys.exit(130)  # Standard exit code for Ctrl+C
            except Exception as e:
                logger.error(f"Error in {func.__name__}: {e}")
                logger.debug(traceback.format_exc())
                if exit_on_error:
                    sys.exit(1)
                return None
        return wrapper
    return decorator

def safe_json_write(data: dict, filepath: str) -> bool:
    """
    Safely write JSON data with error handling
    
    Returns:
        True if successful, False otherwise
    """
    import json
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        logger.error(f"Failed to write {filepath}: {e}")
        return False

def safe_json_read(filepath: str, fallback: dict = None) -> dict:
    """
    Safely read JSON data with error handling
    
    Returns:
        Parsed JSON data or fallback dict
    """
    import json
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning(f"File not found: {filepath}, using fallback")
        return fallback or {}
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {filepath}: {e}")
        return fallback or {}
    except Exception as e:
        logger.error(f"Error reading {filepath}: {e}")
        return fallback or {}

