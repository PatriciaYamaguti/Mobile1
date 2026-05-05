import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PageTitle from '../componentes/PageTitle';
import PrimaryButton from '../componentes/PrimaryButton';
import HistoryItemCard from '../componentes/HistoryItemCard';
import { useAuthStore } from '../store/authStore';
import { usePasswordStore } from '../store/passwordStore';
import type { RootStackParamList } from '../../App';

type HistoryProps = NativeStackScreenProps<RootStackParamList, 'History'>;

export default function History({ navigation }: HistoryProps) {
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});
  const token = useAuthStore((state) => state.token);
  const items = usePasswordStore((state) => state.history);
  const isOnline = usePasswordStore((state) => state.isOnline);
  const removeFromHistory = usePasswordStore((state) => state.removeFromHistory);

  const togglePasswordVisibility = (id: string) => {
    setVisibleItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = async (pass: string) => {
    await Clipboard.setStringAsync(pass);
    Alert.alert('Copiado', 'Senha copiada para a area de transferencia');
  };

  const removeEntry = async (id: string) => {
    await removeFromHistory(id, token);
    setVisibleItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  useEffect(() => {
    setVisibleItems({});
  }, [items.length]);

  return (
    <View className="flex-1 items-center justify-center bg-[#f9f9f9] p-5">
      <PageTitle className="mb-5 text-[22px] text-[#0057D9]">HISTORICO DE SENHAS</PageTitle>
      <Text className={`mb-3 text-sm font-semibold ${isOnline ? 'text-[#2e7d32]' : 'text-[#d32f2f]'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </Text>

      <ScrollView className="mb-5 max-h-[300px] w-full" contentContainerClassName="items-center pb-5">
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
                  createdAt: entry.createdAt,
                  syncStatus: entry.syncStatus,
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
