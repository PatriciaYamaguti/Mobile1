import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PageTitle from '../componentes/PageTitle';
import PrimaryButton from '../componentes/PrimaryButton';
import HistoryItemCard from '../componentes/HistoryItemCard';
import { deletePasswordHistory, listPasswordHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { PasswordHistoryEntry } from '../types';
import type { RootStackParamList } from '../../App';

type HistoryProps = NativeStackScreenProps<RootStackParamList, 'History'>;

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function History({ navigation }: HistoryProps) {
  const [items, setItems] = useState<PasswordHistoryEntry[]>([]);
  const [visibleItems, setVisibleItems] = useState<Record<number, boolean>>({});
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
    } catch (e: unknown) {
      console.warn('Nao foi possivel carregar o historico', e);
      Alert.alert('Erro', getErrorMessage(e, 'Nao foi possivel carregar o historico'));
    }
  };

  const togglePasswordVisibility = (id: number) => {
    setVisibleItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = async (pass: string) => {
    await Clipboard.setStringAsync(pass);
    Alert.alert('Copiado', 'Senha copiada para a area de transferencia');
  };

  const removeEntry = async (id: number) => {
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
    } catch (e: unknown) {
      Alert.alert('Erro', getErrorMessage(e, 'Nao foi possivel excluir a senha'));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHistory);
    return unsubscribe;
  }, [navigation, token]);

  return (
    <View className="flex-1 items-center justify-center bg-[#f9f9f9] p-5">
      <PageTitle className="mb-5 text-2xl text-[#0057D9]">HISTORICO DE SENHAS</PageTitle>

      <ScrollView className="mb-5 max-h-[200px] w-full" contentContainerClassName="items-center pb-5">
        {items.length === 0 ? (
          <Text className="mt-10 text-center text-base text-[#666]">Nenhuma senha gerada ainda</Text>
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

      <PrimaryButton
        title="VOLTAR"
        onPress={() => navigation.goBack()}
        className="mt-0 h-11 self-center rounded-[20px] bg-[#2196F3] px-[30px] py-2.5"
      />
    </View>
  );
}
