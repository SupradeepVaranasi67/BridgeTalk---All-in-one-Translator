# main_app.py (Flask Version)
from flask import Flask, render_template, request
from language_identifier import get_most_common_language
from python_translator import translate_text_python

app = Flask(__name__)

# The 5 Fixed English Questions
ENGLISH_QUESTIONS = [
    "Where is this hotel?",
    "Where will I find a bus stop nearby?",
    "Can you guide me the route to this local market shop?",
    "Where will I find a market with cheap rates for shopping?",
    "Which is the best vegetarian restaurant here?",
]

@app.route('/', methods=['GET', 'POST'])
def run_tourist_system():
    # Variables to be passed to the HTML template
    target_lang_name = None
    translated_phrases = []
    region_input = ""
    
    # Check if the user has submitted the form
    if request.method == 'POST':
        # 1. Get the User's Location Input from the form
        region_input = request.form.get('region_input')

        # 2. Language Identification Module Call
        target_lang_info = get_most_common_language(region_input)

        if target_lang_info:
            target_lang_name = target_lang_info['language']
            target_lang_code = target_lang_info['code']

            # 3. Integration with Translation Tool
            for question in ENGLISH_QUESTIONS:
                translated_phrase = translate_text_python(
                    text=question,
                    src_lang="en",
                    dest_lang=target_lang_code 
                )
                translated_phrases.append(translated_phrase)
        else:
            # Handle case where language couldn't be determined
            target_lang_name = "Undetermined (Defaulting to English)"


    # Render the HTML template, passing the data we collected
    return render_template(
        'index.html',
        questions=ENGLISH_QUESTIONS,
        translated_phrases=translated_phrases,
        target_lang_name=target_lang_name,
        region_input=region_input
    )

if __name__ == "__main__":
    # Ensure you have Flask installed: pip install Flask
    app.run(debug=True)