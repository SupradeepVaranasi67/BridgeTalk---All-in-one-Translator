# language_identifier.py

from language_data import GEO_LANGUAGE_DB, STATE_LANGUAGE_MAP

def get_most_common_language(region_input: str) -> dict:
    """
    Identifies the most common local language for a given region/city input.

    Args:
        region_input: The state, city, or small area entered by the user.

    Returns:
        A dictionary {'language': str, 'code': str} or None if not found.
    """
    if not region_input:
        return None

    # 1. Normalize the input for case-insensitive lookup
    normalized_input = region_input.strip().lower()

    # 2. **Granular Lookup (Simulated Geocoding):** Check the detailed City/District database
    # This simulates how a Geocoding API would resolve even a small colony name
    # to a major city like 'Mumbai' or 'Hyderabad'.
    if normalized_input in GEO_LANGUAGE_DB:
        print(f"INFO: Exact city match found for '{region_input}'.")
        return GEO_LANGUAGE_DB[normalized_input]

    # 3. **Fuzzy/Partial Match (City/Area):**
    # Check if the input contains any known city/region from the granular list.
    # This helps in identifying language for inputs like "Suncity Colony Hyderabad"
    for geo_key, lang_info in GEO_LANGUAGE_DB.items():
        if geo_key in normalized_input:
            print(f"INFO: Partial match found containing '{geo_key}'.")
            return lang_info

    # 4. **State-Level Lookup (Fallback):** Check the State map
    if normalized_input in STATE_LANGUAGE_MAP:
        print(f"INFO: State match found for '{region_input}'.")
        return STATE_LANGUAGE_MAP[normalized_input]

    # 5. **Failure:** Return None if no language could be identified
    print(f"WARNING: No specific language found for '{region_input}'. Falling back to default.")
    
    # **Default Fallback:** Use Hindi as a widely understood language in India
    return {"language": "Hindi", "code": "hi"}