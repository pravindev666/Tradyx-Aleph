import json, sys
from jsonschema import validate, ValidationError

schema = {
  "type":"object",
  "required":["updatedAt","spot","vix","pcr","maxPain","spotSeries","vixSeries","oi"],
  "properties":{
    "updatedAt":{"type":"string"},
    "spot":{"type":["number","null"]},
    "vix":{"type":["number","null"]},
    "pcr":{"type":["number","null"]},
    "maxPain":{"type":["number","null"]},
    "spotSeries":{"type":"array","items":{"type":"number"}},
    "vixSeries":{"type":"array","items":{"type":"number"}},
    "oi":{"type":"object"}
  }
}

try:
    data = json.load(open("data/metrics.json"))
    validate(instance=data, schema=schema)
except (ValidationError, Exception) as e:
    print(f"::error ::schema validation failed: {e}")
    sys.exit(2)
