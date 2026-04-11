import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import PageTitle from '../componentes/PageTitle';
import PrimaryButton from '../componentes/PrimaryButton';
import HistoryItemCard from '../componentes/HistoryItemCard';
import { deletePasswordHistory, listPasswordHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function History({ navigation }) {
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState({});
  const { token } = useAuth();

  const loadHistory = async () => {
    try {
      if (!token) {
        setItems([]);
        return;
      }

      const arr = await listPasswordHistory(token);
      setItems(arr);
      setVisibleItems({});
    } catch (e) {
      console.warn('Nao foi possivel carregar o historico', e);
      Alert.alert('Erro', e.message || 'Nao foi possivel carregar o historico');
    }
  };

  const togglePasswordVisibility = (id) => {
    setVisibleItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = async (pass) => {
    await Clipboard.setStringAsync(pass);
    Alert.alert('Copiado', 'Senha copiada para a area de transferencia');
  };

  const removeEntry = async (id) => {
    try {
      if (!token) {
        throw new Error('Usuario nao autenticado');
      }

      await deletePasswordHistory(token, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setVisibleItems((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (e) {
      Alert.alert('Erro', e.message || 'Nao foi possivel excluir a senha');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHistory);
    return unsubscribe;
  }, [navigation, token]);

  return (
    <View style={styles.container}>
      <PageTitle style={styles.title}>HISTORICO DE SENHAS</PageTitle>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma senha gerada ainda</Text>
        ) : (
          items.map((entry) => {
            const isVisible = !!visibleItems[entry.id];
            return (
              <HistoryItemCard
                key={entry.id}
                entry={{
                  id: entry.id,
                  account: entry.appName,
                  password: entry.password || '',
                }}
                isVisible={isVisible}
                onToggleVisibility={() => togglePasswordVisibility(entry.id)}
                onCopy={() => copyPassword(entry.password)}
                onRemove={() => removeEntry(entry.id)}
              />
            );
          })
        )}
      </ScrollView>

      <PrimaryButton title="VOLTAR" onPress={() => navigation.goBack()} style={styles.backButton} />
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
    color: '#0057D9',
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
  backButton: {
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    height: 44,
    marginTop: 0,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
    textAlign: 'center',
  },
});
