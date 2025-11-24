# language_data.py

# A Geo-Linguistic Database mapping cities/districts to their State and Primary Language.
# In a real system, this would be a much larger SQL database or a connection to a Geocoding API.
GEO_LANGUAGE_DB = {
    # Key: Lowercase city/district/region name
    # Value: {'state': State Name, 'language': Primary Language, 'code': ISO 639-1 Code}

    # Maharashtra Region
    "mumbai": {"state": "Maharashtra", "language": "Marathi", "code": "mr"},
    "pune": {"state": "Maharashtra", "language": "Marathi", "code": "mr"},
    "nagpur": {"state": "Maharashtra", "language": "Marathi", "code": "mr"},
    
    # Telangana / Andhra Pradesh Region
    "hyderabad": {"state": "Telangana", "language": "Telugu", "code": "te"},
    "secunderabad": {"state": "Telangana", "language": "Telugu", "code": "te"},
    "visakhapatnam": {"state": "Andhra Pradesh", "language": "Telugu", "code": "te"},

    # Tamil Nadu Region
    "chennai": {"state": "Tamil Nadu", "language": "Tamil", "code": "ta"},
    "madurai": {"state": "Tamil Nadu", "language": "Tamil", "code": "ta"},

    # West Bengal Region
    "kolkata": {"state": "West Bengal", "language": "Bengali", "code": "bn"},
    "howrah": {"state": "West Bengal", "language": "Bengali", "code": "bn"},

    # Goa Region
    "panaji": {"state": "Goa", "language": "Konkani", "code": "kok"},

    # Delhi NCR
    "delhi": {"state": "Delhi", "language": "Hindi", "code": "hi"},
    "new delhi": {"state": "Delhi", "language": "Hindi", "code": "hi"},
    "gurgaon": {"state": "Haryana", "language": "Hindi", "code": "hi"},
}

# A simpler map for state-level lookups as a fallback or for state-only input
STATE_LANGUAGE_MAP = {
    "maharashtra": {"language": "Marathi", "code": "mr"},
    "telangana": {"language": "Telugu", "code": "te"},
    "tamil nadu": {"language": "Tamil", "code": "ta"},
    "west bengal": {"language": "Bengali", "code": "bn"},
    "goa": {"language": "Konkani", "code": "kok"},
    "delhi": {"language": "Hindi", "code": "hi"},
    "andhra pradesh": {"language": "Telugu", "code": "te"},
}