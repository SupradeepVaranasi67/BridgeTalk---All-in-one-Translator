import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BridgeTalk</Text>

      <Button title="Text Translation" onPress={() => router.push("/text")} />
      {/* <Button title="Speech Translation" onPress={() => router.push("/speech")} /> */}
      <Button title="OCR Translation" onPress={() => router.push("/ocr")} />
      <Button title="Settings" onPress={() => router.push("/settings")} />
      <Button title="History" onPress={() => router.push("/history")} />
      <Button title="Your Favorites" onPress={() => router.push("/favorites")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
});
