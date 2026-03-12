import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function History({ navigation }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    console.log('History mounted, items:', items);
  }, [items]);
  useEffect(() => {
    console.log('History mounted');
  }, []);

  const loadHistory = async () => {
    try {
      const existing = await AsyncStorage.getItem('history');
      const arr = existing ? JSON.parse(existing) : [];
      setItems(arr);
    } catch (e) {
      console.warn('could not load history', e);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('history');
      setItems([]);
    } catch (e) {
      console.warn('could not clear history', e);
    }
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
          items.map((pw, index) => (
            <Text key={index} style={styles.item} selectable>
              {pw}
            </Text>
          ))
        )}
      </ScrollView>

      <Pressable style={styles.clearButton} onPress={clearHistory}>
        <Text style={styles.clearText}>LIMPAR</Text>
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
  clearButton: {
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  clearText: {
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
