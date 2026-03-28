import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Eye, EyeOff, Copy, Trash2 } from 'lucide-react-native';

export default function History({ navigation }) {
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState({});

  const loadHistory = async () => {
    try {
      const existing = await AsyncStorage.getItem('history');
      const arr = existing ? JSON.parse(existing) : [];
      setItems(arr);
      setVisibleItems({});
    } catch (e) {
      console.warn('Não foi possível carregar o histórico', e);
    }
  };

  useEffect(() => {
    console.log('History updated', items.length);
  }, [items]);


  const togglePasswordVisibility = (id) => {
    setVisibleItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = async (pass) => {
    await Clipboard.setStringAsync(pass);
    Alert.alert('Copiado', 'Senha copiada para a área de transferência');
  };

  const removeEntry = async (id) => {
    const remaining = items.filter((item) => item.id !== id);
    setItems(remaining);
    setVisibleItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    await AsyncStorage.setItem('history', JSON.stringify(remaining));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHistory);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HISTÓRICO DE SENHAS</Text>
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma senha gerada ainda</Text>
        ) : (
          items.map((entry) => {
            const isVisible = !!visibleItems[entry.id];
            return (
              <View key={entry.id} style={styles.entry}>
                <Text style={styles.entryAccount}>{entry.account || 'Sem finalidade'}</Text>
                <Text style={styles.entryPassword} selectable>
                  {isVisible ? entry.password : '*'.repeat(Math.max(entry.password.length, 8))}
                </Text>
                <View style={styles.actionRow}>
                  <Pressable onPress={() => togglePasswordVisibility(entry.id)} style={styles.iconButton}>
                    {isVisible ? <EyeOff color="#1976D2" width={22} height={22} /> : <Eye color="#1976D2" width={22} height={22} />}
                  </Pressable>
                  <Pressable onPress={() => copyPassword(entry.password)} style={styles.iconButton}>
                    <Copy color="#1976D2" width={22} height={22} />
                  </Pressable>
                  <Pressable onPress={() => removeEntry(entry.id)} style={styles.iconButton}>
                    <Trash2 color="#D32F2F" width={22} height={22} />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>VOLTAR</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0057D9',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    width: '100%',
    marginBottom: 20,
    maxHeight: 200,
  },
  listContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  item: {
    fontSize: 18,
    color: '#333',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  entry: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  entryAccount: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  entryPassword: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F0F8FF',
  },
  backButton: {
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
    textAlign: 'center',
  },
});
