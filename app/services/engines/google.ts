// app/services/engines/google.ts
export async function translateText(
  text: string,
  target: string = "en",
  source: string = "auto"
) {
  const url = "https://google-translate113.p.rapidapi.com/api/v1/translator/text";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-key": "2313984740msh78647075e369a68p14bcb9jsnf356f69bca55", // your key
      "x-rapidapi-host": "google-translate113.p.rapidapi.com",
    },
    body: JSON.stringify({
      from: source,
      to: target,
      text: text,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Translation failed: ${res.status} - ${errorText}`);
  }

  const data = await res.json();

  // Try to safely extract the translated text
  return (
    data.translated_text ||
    data.trans ||
    data.translation ||
    "No translation found"
  );
}


export async function getSupportedLanguages() {
  const url = "https://google-translate113.p.rapidapi.com/api/v1/translator/support-languages";

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "2313984740msh78647075e369a68p14bcb9jsnf356f69bca55",
      "x-rapidapi-host": "google-translate113.p.rapidapi.com",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Languages fetch failed: ${res.status} - ${text}`);
  }

  const data = await res.json();

  // Normalize to { language: string; name: string }
  // (the API returns { code, language })
  return data.map((item: { code: string; language: string }) => ({
    language: item.code,
    name: item.language,
  }));
}

