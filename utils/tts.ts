import * as Speech from "expo-speech";

export const speak = (text: string, language: string) => {
    if (!text) return;
    Speech.speak(text, { language });
};

export const stopSpeaking = () => {
    Speech.stop();
};

export const isSpeaking = async () => {
    return await Speech.isSpeakingAsync();
};
