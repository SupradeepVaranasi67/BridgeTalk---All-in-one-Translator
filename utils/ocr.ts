// utils/ocr.ts
import * as FileSystem from "expo-file-system/legacy";

const GOOGLE_VISION_API_KEY = "AIzaSyA-CLStO5vLF0Mr7Q82eBbm2Kasow4DEgs";
const GOOGLE_VISION_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

export async function recognizeTextFromImage(imageUri: string): Promise<string> {
  try {
    // Convert image to base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const requestBody = {
      requests: [
        {
          image: {
            content: base64,
          },
          features: [
            {
              type: "TEXT_DETECTION",
            },
          ],
        },
      ],
    };

    const response = await fetch(GOOGLE_VISION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    // console.log("Google Vision API Result:", JSON.stringify(result, null, 2));

    if (!result || !result.responses || result.responses.length === 0 || !result.responses[0].fullTextAnnotation) {
      return "";
    }

    return result.responses[0].fullTextAnnotation.text ?? "";
  } catch (error) {
    console.error("Google Cloud Vision API error:", error);
    throw new Error("Failed to recognize text");
  }
}