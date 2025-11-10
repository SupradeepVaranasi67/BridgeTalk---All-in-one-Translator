import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "BridgeTalk" }} />
      <Stack.Screen name="text" options={{ title: "Text Translator" }} />
      <Stack.Screen name="speech" options={{ title: "Speech Translator" }} />
      <Stack.Screen name="ocr" options={{ title: "Image Translator" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="history" options={{ title: "Translation History" }} />
      <Stack.Screen name="favorites" options={{title: "Your Favorites"}} />
    </Stack>
  );
}
