import { Alert, Platform } from 'react-native';

export function showAlert(title, message) {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(`${title}\n${message}`);
    return;
  }

  Alert.alert(title, message);
}
