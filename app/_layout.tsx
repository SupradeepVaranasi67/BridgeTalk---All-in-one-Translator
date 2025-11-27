
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { Colors } from "./constants/theme";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function RootLayoutNav() {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme].background,
          },
          headerTintColor: Colors[colorScheme].text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "BridgeTalk" }} />
        <Stack.Screen name="text" options={{ title: "Text Translator" }} />
        <Stack.Screen name="speech" options={{ title: "Speech Translator" }} />
        <Stack.Screen name="ocr" options={{ title: "Image Translator" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen name="translator" options={{ title: "History" }} />
        <Stack.Screen name="favorites" options={{ title: "Favorites" }} />
      </Stack>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
