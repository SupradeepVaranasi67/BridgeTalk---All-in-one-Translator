import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './components/themed-text';
import { ThemedView } from './components/themed-view';
import { useThemeColor } from './hooks/use-theme-color';
import { addToFavorites, getFavorites, getHistory, removeFromFavorites, removeFromHistory, Translation } from './services/storage';

export default function TranslationHistoryScreen() {
  const [history, setHistory] = useState<Translation[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const iconColor = useThemeColor({}, 'text');

  const loadData = async () => {
    const hist = await getHistory();
    const favs = await getFavorites();
    setHistory(hist);
    setFavorites(favs.map(f => f.id));
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const clearHistory = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to clear the translation history?');
      if (confirmed) {
        AsyncStorage.removeItem('translation_history').then(() => {
          setHistory([]);
        });
      }
    } else {
      Alert.alert(
        'Clear History',
        'Are you sure you want to clear the translation history?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: async () => {
            await AsyncStorage.removeItem('translation_history');
            setHistory([]);
          }},
        ],
        { cancelable: false }
      );
    }
  };

  const handleDelete = async (id: string) => {
    await removeFromHistory(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleReplay = (text: string, lang: string) => {
    Speech.speak(text, { language: lang });
  };

  const handleToggleFavorite = async (item: Translation) => {
    if (favorites.includes(item.id)) {
      await removeFromFavorites(item.id);
      setFavorites(prev => prev.filter(id => id !== item.id));
    } else {
      await addToFavorites(item);
      setFavorites(prev => [...prev, item.id]);
    }
  };

  const renderItem = ({ item }: { item: Translation }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <ThemedView style={styles.itemContainer}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.itemText}>{item.sourceText} {'->'} {item.translatedText}</ThemedText>
          <ThemedText style={styles.itemLang}>{item.sourceLang} {'->'} {item.targetLang}</ThemedText>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => handleReplay(item.translatedText, item.targetLang)} style={styles.actionButton}>
            <FontAwesome name="volume-up" size={20} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleToggleFavorite(item)} style={styles.actionButton}>
            <FontAwesome name={isFavorite ? "heart" : "heart-o"} size={20} color={isFavorite ? "#ff4c4c" : iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
            <FontAwesome name="trash" size={20} color="#ff4c4c" />
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>No history yet.</ThemedText>}
      />
      {history.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <ThemedText style={styles.clearButtonText}>Clear History</ThemedText>
        </TouchableOpacity>
      )}
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
    backgroundColor: 'rgba(150, 150, 150, 0.1)', // Slight background for separation
  },
  textContainer: { flex: 1, marginRight: 10 },
  itemText: { fontSize: 16 },
  itemLang: { fontSize: 12, marginTop: 5, opacity: 0.7 },
  actionsContainer: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { padding: 8, marginLeft: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  clearButton: {
    backgroundColor: '#ff4c4c',
    padding: 15,
    margin: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
