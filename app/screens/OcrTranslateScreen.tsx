import { View, Text, StyleSheet } from "react-native";

export default function OcrTranslateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>this is the sample second screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24 },
});
