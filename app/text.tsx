import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { translateText, getSupportedLanguages } from "./services/engines/google";

export default function TextTranslateScreen() {
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [langLoading, setLangLoading] = useState(true);

  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [languages, setLanguages] = useState<{ language: string; name: string }[]>([]);

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
  }, []);

  async function handleTranslate() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await translateText(input, targetLang, sourceLang);
      setTranslated(result);
    } catch (err: any) {
      console.error(err);
      setTranslated("Translation failed 😔");
    } finally {
      setLoading(false);
    }
  }

  if (langLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading languages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Text Translator</Text>

      <Text style={styles.label}>From:</Text>
      <Picker
        selectedValue={sourceLang}
        style={styles.picker}
        onValueChange={(val) => setSourceLang(val)}
      >
        <Picker.Item label="Auto Detect" value="auto" />
        {languages.map((lang) => (
          <Picker.Item key={lang.language} label={lang.name} value={lang.language} />
        ))}
      </Picker>

      <Text style={styles.label}>To:</Text>
      <Picker
        selectedValue={targetLang}
        style={styles.picker}
        onValueChange={(val) => setTargetLang(val)}
      >
        {languages.map((lang) => (
          <Picker.Item key={lang.language} label={lang.name} value={lang.language} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={input}
        onChangeText={setInput}
      />
      <Button
        title={loading ? "Translating..." : "Translate"}
        onPress={handleTranslate}
      />

      {translated ? <Text style={styles.output}>{translated}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  label: { alignSelf: "flex-start", marginLeft: 10, marginTop: 10, fontSize: 16 },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  output: { fontSize: 20, marginTop: 20, textAlign: "center" },
});
