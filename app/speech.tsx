import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Voice, { SpeechResultsEvent } from "@react-native-voice/voice";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";

import * as TTS from "../utils/tts";
import { ThemedText } from "./components/themed-text";
import { ThemedView } from "./components/themed-view";
import { useThemeColor } from "./hooks/use-theme-color";
import { getSupportedLanguages, translateText } from "./services/engines/google";

import { useThemedAlert } from "./hooks/use-themed-alert";

export default function SpeechTranslateScreen() {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;

  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [langLoading, setLangLoading] = useState(true);

  const [sourceLang, setSourceLang] = useState("en-US");
  const [targetLang, setTargetLang] = useState("es");
  const [languages, setLanguages] = useState<{ language: string; name: string }[]>([]);

  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const inputBackgroundColor = useThemeColor({}, 'input');
  const cardColor = useThemeColor({}, 'card');

  const { showAlert, themedAlertElement } = useThemedAlert();

  useEffect(() => {
    async function loadLanguages() {
      try {
        const langs = await getSupportedLanguages();
        setLanguages(langs);
      } catch (err) {
        console.error("Failed to load languages", err);
      } finally {
        setLangLoading(false);
      }
    }
    loadLanguages();

    // Native Voice setup
    Voice.onSpeechStart = () => {
      console.log("Speech started");
      setIsRecording(true);
    };
    Voice.onSpeechEnd = () => {
      console.log("Speech ended");
      setIsRecording(false);
    };
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = (e) => {
      console.error("Speech error:", e);
      setIsRecording(false);
      // Optional: Show alert on error, but be careful not to spam if it's just no speech detected
      if (e.error?.message && !e.error.message.includes('No match')) {
         // showAlert("Speech Error", e.error.message); 
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log("Native Speech results:", e);
    if (e.value && e.value.length > 0) {
      setRecognizedText(e.value[0]);
    }
  };

  const handleStartRecording = async () => {
    setRecognizedText("");
    setTranslatedText("");
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        showAlert("Permission Required", "Microphone permission is required for speech recognition.");
        return;
      }
      // Ensure any previous session is destroyed
      await Voice.destroy();
      await Voice.start(sourceLang);
    } catch (e) {
      console.error(e);
      showAlert("Error", "Failed to start recording.");
    }
  };

  const handleStopRecording = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (recognizedText && !isRecording) {
      handleTranslate();
    }
  }, [recognizedText, isRecording]);


  const handleTranslate = async () => {
    if (!recognizedText.trim()) return;
    setLoading(true);
    try {
      const sourceIso = sourceLang.split('-')[0];
      const result = await translateText(recognizedText, targetLang, sourceIso);
      setTranslatedText(result);

      TTS.speak(result, targetLang);
    } catch (err) {
      console.error(err);
      showAlert("Error", "Translation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (translatedText) {
      TTS.speak(translatedText, targetLang);
    }
  };

  if (langLoading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={primaryColor} />
        <ThemedText style={{ marginTop: 10 }}>Loading languages...</ThemedText>
      </ThemedView>
    );
  }

  const controlsSection = (
    <View style={styles.controlsSection}>
      <View style={styles.pickerContainer}>
        <View style={[styles.pickerWrapper, { backgroundColor: inputBackgroundColor, overflow: 'hidden' }]}>
          <ThemedText style={styles.label}>Speak in:</ThemedText>
          <Picker
            selectedValue={sourceLang}
            onValueChange={(val) => setSourceLang(val)}
            style={[styles.picker, { backgroundColor: 'transparent', color: textColor }]}
            dropdownIconColor={textColor}
          >
            {languages.map((lang) => (
              <Picker.Item key={lang.language} label={lang.name} value={lang.language} color={textColor} />
            ))}
          </Picker>
        </View>
        <View style={[styles.pickerWrapper, { backgroundColor: inputBackgroundColor, overflow: 'hidden' }]}>
          <ThemedText style={styles.label}>Translate to:</ThemedText>
          <Picker
            selectedValue={targetLang}
            onValueChange={(val) => setTargetLang(val)}
            style={[styles.picker, { backgroundColor: 'transparent', color: textColor }]}
            dropdownIconColor={textColor}
          >
            {languages.map((lang) => (
              <Picker.Item key={lang.language} label={lang.name} value={lang.language} color={textColor} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.micContainer}>
        <TouchableOpacity
          style={[styles.micButton, { backgroundColor: isRecording ? "#ff4c4c" : primaryColor }]}
          onPress={isRecording ? handleStopRecording : handleStartRecording}
        >
          <FontAwesome name={isRecording ? "stop" : "microphone"} size={32} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.micStatus}>{isRecording ? "Listening..." : "Tap to Speak"}</ThemedText>
      </View>
    </View>
  );

  const resultSection = (
    <View style={styles.resultSection}>
      <View style={[styles.resultCard, { backgroundColor: cardColor }]}>
        <ThemedText style={styles.resultLabel}>You said:</ThemedText>
        <ThemedText style={styles.resultText}>{recognizedText || "..."}</ThemedText>
      </View>

      <View style={[styles.resultCard, { backgroundColor: cardColor, marginTop: 20 }]}>
        <View style={styles.translationHeader}>
          <ThemedText style={styles.resultLabel}>Translation:</ThemedText>
          <TouchableOpacity onPress={handleSpeak} disabled={!translatedText}>
            <FontAwesome name="volume-up" size={24} color={translatedText ? primaryColor : "#ccc"} />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator color={primaryColor} style={{ marginTop: 10 }} />
        ) : (
          <ThemedText style={styles.resultText}>{translatedText || "..."}</ThemedText>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {themedAlertElement}
      {isWideScreen ? (
        <View style={styles.horizontalContainer}>
          <View style={styles.column}>{controlsSection}</View>
          <View style={[styles.column, { marginLeft: 20 }]}>{resultSection}</View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {controlsSection}
          {resultSection}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  contentContainer: { padding: 16 },
  horizontalContainer: { flexDirection: 'row', padding: 20, width: '100%', maxWidth: 1200, justifyContent: 'center' },
  column: { flex: 1, maxWidth: 500 },
  controlsSection: { marginBottom: 20 },
  pickerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  pickerWrapper: { flex: 1, marginHorizontal: 4 },
  label: { marginBottom: 8, fontSize: 16 },
  picker: { borderRadius: 8, height: 50, borderWidth: 0 },
  micContainer: { alignItems: 'center', marginTop: 20 },
  micButton: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  micStatus: { marginTop: 10, fontSize: 16 },
  resultSection: { flex: 1 },
  resultCard: { padding: 20, borderRadius: 12, minHeight: 100, justifyContent: 'center' },
  resultLabel: { fontSize: 14, opacity: 0.7, marginBottom: 8 },
  resultText: { fontSize: 20, fontWeight: '500' },
  translationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
