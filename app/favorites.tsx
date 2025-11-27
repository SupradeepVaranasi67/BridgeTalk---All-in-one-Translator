
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './components/themed-text';
import { ThemedView } from './components/themed-view';
import { getFavorites, removeFromFavorites, Translation } from './services/storage';

import * as Speech from 'expo-speech';
import { useThemeColor } from './hooks/use-theme-color';

import { useThemedAlert } from "./hooks/use-themed-alert";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Translation[]>([]);
  const iconColor = useThemeColor({}, 'text');
  const { showAlert, themedAlertElement } = useThemedAlert();

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemoveFavorite = (translationId: string) => {
    showAlert(
      'Remove Favorite',
      'Are you sure you want to remove this from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          style: 'destructive',
          onPress: async () => {
            await removeFromFavorites(translationId);
            setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== translationId));
          }
        },
      ]
    );
  };

  const handleReplay = (text: string, lang: string) => {
    Speech.speak(text, { language: lang });
  };

  const renderItem = ({ item }: { item: Translation }) => (
    <ThemedView style={styles.itemContainer}>
      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.itemText}>{item.sourceText} {'->'} {item.translatedText}</ThemedText>
        <ThemedText style={styles.itemLang}>{item.sourceLang} {'->'} {item.targetLang}</ThemedText>
      </ThemedView>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleReplay(item.translatedText, item.targetLang)} style={styles.actionButton}>
          <FontAwesome name="volume-up" size={20} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={styles.actionButton}>
          <FontAwesome name="heart" size={24} color="#ff4c4c" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      {themedAlertElement}
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>No favorites yet.</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: { flex: 1, backgroundColor: 'transparent' },
  itemText: { fontSize: 16 },
  itemLang: { fontSize: 12, marginTop: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  actionsContainer: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { padding: 8, marginLeft: 5 },
});
