# python_translator.py (NEW FILE)
# You need to install this library first: pip install googletrans==4.0.0-rc1

from googletrans import Translator

def translate_text_python(text: str, src_lang: str, dest_lang: str) -> str:
    """
    Translates a single text string using the googletrans library.
    """
    try:
        translator = Translator()
        
        # Ensure the destination language code is suitable for the translator
        # (e.g., 'kok' for Konkani might need manual mapping if not supported)
        
        translation = translator.translate(text, src=src_lang, dest=dest_lang)
        return translation.text
    except Exception as e:
        print(f"Error during translation: {e}")
        return f"[Translation Failed for {text}]"

# The main_app.py can now import and call translate_text_python