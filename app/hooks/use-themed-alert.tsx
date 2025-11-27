import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { useThemeColor } from './use-theme-color';

export function useThemedAlert() {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttons, setButtons] = useState<{ text: string, onPress?: () => void, style?: 'cancel' | 'default' | 'destructive' }[]>([]);

  const showAlert = (title: string, message: string, buttons: { text: string, onPress?: () => void, style?: 'cancel' | 'default' | 'destructive' }[] = [{ text: 'OK' }]) => {
    setTitle(title);
    setMessage(message);
    setButtons(buttons);
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  const cardColor = useThemeColor({}, 'card');
  const primaryColor = useThemeColor({}, 'primary');

  const themedAlertElement = (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hideAlert}>
      <View style={styles.overlay}>
        <View style={[styles.alertBox, { backgroundColor: cardColor }]}>
          <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>
          <View style={styles.buttonContainer}>
            {buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (btn.onPress) btn.onPress();
                  hideAlert();
                }}
                style={styles.button}
              >
                <ThemedText style={{ color: btn.style === 'destructive' ? '#ff4c4c' : primaryColor, fontWeight: 'bold' }}>{btn.text}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  return { showAlert, themedAlertElement };
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  alertBox: { width: '80%', padding: 20, borderRadius: 10, elevation: 5, maxWidth: 400 },
  title: { marginBottom: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  message: { marginBottom: 20, textAlign: 'center', fontSize: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap' },
  button: { marginLeft: 20, padding: 10 },
});
