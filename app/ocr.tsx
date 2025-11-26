// app/ocr.tsx
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { recognizeTextFromImage } from "../utils/ocr";
import { ThemedText } from "./components/themed-text";
import { ThemedView } from "./components/themed-view";
import { useThemeColor } from "./hooks/use-theme-color";
import { getSupportedLanguages, translateText } from "./services/engines/google";

export default function OcrTranslateScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  
  const [targetLang, setTargetLang] = useState("en");
  const [languages, setLanguages] = useState<{ language: string; name: string }[]>([]);

  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'card');
  const inputBackgroundColor = useThemeColor({}, 'input');

  useEffect(() => {
    async function loadLanguages() {
      try {
        const langs = await getSupportedLanguages();
        setLanguages(langs);
      } catch (err) {
        console.error("Failed to load languages", err);
      }
    }
    loadLanguages();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      setImageUri(res.assets[0].uri);
      setRecognizedText("");
      setTranslatedText("");
    }
  };

  const handleRecognizeText = async () => {
    if (!imageUri) return;

    setLoading(true);
    try {
      const resultText = await recognizeTextFromImage(imageUri);
      setRecognizedText(resultText || "No text found.");
    } catch (err) {
      setRecognizedText("OCR failed. Check logs.");
    }
    setLoading(false);
  };

  const handleTranslate = async () => {
    if (!recognizedText || recognizedText === "No text found." || recognizedText === "OCR failed. Check logs.") return;

    setTranslating(true);
    try {
      const result = await translateText(recognizedText, targetLang);
      setTranslatedText(result);
    } catch (err) {
      Alert.alert("Error", "Translation failed.");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Button title="Pick Image" onPress={pickImage} color={primaryColor} />

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Recognize Text"
            onPress={handleRecognizeText}
            disabled={!imageUri || loading}
            color={primaryColor}
          />
        </View>

        {loading && <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 20 }} />}

        {recognizedText !== "" && (
          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <ThemedText style={styles.label}>Recognized Text:</ThemedText>
            <ThemedText style={styles.text}>{recognizedText}</ThemedText>
            
            <View style={styles.separator} />
            
            <ThemedText style={styles.label}>Translate to:</ThemedText>
            <View style={[styles.pickerWrapper, { backgroundColor: inputBackgroundColor }]}>
              <Picker
                selectedValue={targetLang}
                onValueChange={(val) => setTargetLang(val)}
                style={{ color: textColor }}
              >
                {languages.map((lang) => (
                  <Picker.Item key={lang.language} label={lang.name} value={lang.language} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity 
              style={[styles.translateButton, { backgroundColor: primaryColor }]} 
              onPress={handleTranslate}
              disabled={translating}
            >
              {translating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.translateButtonText}>Translate</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        )}

        {translatedText !== "" && (
          <View style={[styles.card, { backgroundColor: cardColor, marginTop: 20 }]}>
            <ThemedText style={styles.label}>Translation:</ThemedText>
            <ThemedText style={styles.text}>{translatedText}</ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 20 },
  image: { width: "100%", height: 300, resizeMode: "contain", marginTop: 20, borderRadius: 10 },
  buttonContainer: { marginTop: 20 },
  card: { padding: 15, borderRadius: 10, marginTop: 20 },
  label: { fontSize: 14, opacity: 0.7, marginBottom: 5 },
  text: { fontSize: 16 },
  separator: { height: 1, backgroundColor: '#ccc', marginVertical: 15, opacity: 0.3 },
  pickerWrapper: { borderRadius: 8, overflow: 'hidden', marginBottom: 15 },
  translateButton: { padding: 12, borderRadius: 8, alignItems: 'center' },
  translateButtonText: { color: '#fff', fontWeight: 'bold' },
});
