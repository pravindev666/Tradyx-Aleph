#!/usr/bin/env python3
"""
Production validation script
Validates all data files and ensures production readiness
"""
import json
import sys
from pathlib import Path
from datetime import datetime, timezone

def validate_json_file(filepath: Path, required_fields: list = None):
    """Validate a JSON file exists and has required fields"""
    if not filepath.exists():
        print(f"[ERROR] {filepath} does not exist")
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if required_fields:
            missing = [field for field in required_fields if field not in data]
            if missing:
                print(f"[ERROR] {filepath} missing fields: {missing}")
                return False
        
        # Check updatedAt is recent (within last hour)
        if 'updatedAt' in data:
            try:
                updated = datetime.fromisoformat(data['updatedAt'].replace('Z', '+00:00'))
                age_minutes = (datetime.now(timezone.utc) - updated).total_seconds() / 60
                if age_minutes > 60:
                    print(f"[WARN] {filepath} data is {age_minutes:.1f} minutes old")
            except:
                pass
        
        print(f"[OK] {filepath} is valid")
        return True
    except json.JSONDecodeError as e:
        print(f"[ERROR] {filepath} has invalid JSON: {e}")
        return False
    except Exception as e:
        print(f"[ERROR] {filepath} validation failed: {e}")
        return False

def main():
    """Validate all production data files"""
    script_dir = Path(__file__).parent
    data_dir = script_dir / "data"
    public_data_dir = script_dir.parent / "public" / "data"
    
    print("=" * 70)
    print("Production Data Validation")
    print("=" * 70)
    
    results = []
    
    # Validate critical files
    critical_files = [
        (data_dir / "yf.json", ["spot", "vix", "spotSeries", "vixSeries"]),
        (data_dir / "metrics.json", ["spot", "pcr", "ivRank"]),
        (data_dir / "dashboard.json", ["spot", "vix", "updatedAt"]),
        (public_data_dir / "dashboard.json", ["spot", "vix", "updatedAt"]),
    ]
    
    for filepath, required_fields in critical_files:
        result = validate_json_file(filepath, required_fields)
        results.append((filepath.name, result))
    
    # Validate optional files
    optional_files = [
        (data_dir / "ml_predictions.json", None),
        (data_dir / "volatility_indicators.json", None),
        (data_dir / "breadth_momentum.json", None),
    ]
    
    for filepath, required_fields in optional_files:
        result = validate_json_file(filepath, required_fields)
        results.append((filepath.name, result))
    
    # Summary
    print("\n" + "=" * 70)
    print("Validation Summary")
    print("=" * 70)
    
    all_passed = True
    for name, result in results:
        status = "[OK]" if result else "[FAIL]"
        print(f"{status} {name}")
        if not result:
            all_passed = False
    
    if all_passed:
        print("\n[OK] All validations passed. Production ready!")
        return 0
    else:
        print("\n[ERROR] Some validations failed. Please fix errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())

