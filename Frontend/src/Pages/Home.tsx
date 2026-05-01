import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PageTitle from '../componentes/PageTitle';
import PrimaryButton from '../componentes/PrimaryButton';
import TextLink from '../componentes/TextLink';
import { signout as signoutRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePasswords } from '../context/PasswordContext';
import { showAlert } from '../utils/showAlert';
import type { AppError } from '../types';
import type { RootStackParamList } from '../../App';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function makePassword(length = 12): string {
  const chars = '1234567890987654321';
  let pw = '';
  for (let i = 0; i < length; i++) {
    pw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pw;
}

export default function Home({ navigation }: HomeProps) {
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loadingSignout, setLoadingSignout] = useState(false);
  const { user, token, signOut } = useAuth();
  const { addPassword, isOnline, syncing, syncPending } = usePasswords();

  useEffect(() => {
    setDisplayName(user?.name || user?.email || '');
  }, [user?.name, user?.email]);

  const handleGenerate = async () => {
    const pw = makePassword();
    setPassword(pw);
    await addPassword('Gerada no app', pw);
    if (isOnline) {
      await syncPending();
    }
  };

  const handleCopy = () => {
    if (password) {
      Clipboard.setStringAsync(password);
      Alert.alert('Copiado', 'Senha copiada para a area de transferencia');
    }
  };

  const handleSignOut = async () => {
    if (loadingSignout) return;

    let signoutApiError: AppError | null = null;

    try {
      setLoadingSignout(true);
      if (token) {
        await signoutRequest(token);
      }
    } catch (error: unknown) {
      signoutApiError = error as AppError;
    } finally {
      await signOut();
      setLoadingSignout(false);
    }

    if (signoutApiError) {
      showAlert('Aviso', 'Sessao local encerrada, mas nao foi possivel avisar o servidor');
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      <View className="flex-1 w-full items-center justify-center">
        <PageTitle className="mb-3 text-[28px] uppercase text-[#0057D9]">GERADOR DE SENHA</PageTitle>
        {displayName ? <Text className="mb-2 text-sm text-[#333]">Bem-vindo, {displayName}</Text> : null}
        <Text className={`mb-2 text-sm font-semibold ${isOnline ? 'text-[#2e7d32]' : 'text-[#d32f2f]'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
        {syncing ? <Text className="mb-2 text-xs text-[#1976D2]">Sincronizando pendencias...</Text> : null}
        <Image className="mb-5 h-[180px] w-[180px]" resizeMode="contain" source={require('../pass.png')} />

        <View className="mb-2.5 min-h-[60px] w-full items-center justify-center rounded-md bg-[#4DB5FF] p-2.5">
          <Text selectable className="font-mono text-xl font-bold text-white">
            {password || '--------'}
          </Text>
        </View>

        <View className="mb-2.5 w-full gap-2.5">
          <PrimaryButton
            title="GERAR"
            onPress={handleGenerate}
            className="mt-0 bg-[#1976D2]"
            textClassName="text-lg"
          />

          <PrimaryButton
            title="COPIAR"
            onPress={handleCopy}
            className="mt-0 bg-[#1976D2]"
            textClassName="text-lg"
          />

          <PrimaryButton
            title={loadingSignout ? 'SAINDO...' : 'SAIR'}
            onPress={handleSignOut}
            disabled={loadingSignout}
            className="mt-0 bg-[#d32f2f]"
            textClassName="text-lg"
          />
        </View>

        <TextLink className="mt-2.5 text-sm font-normal text-[#555]" onPress={() => navigation.navigate('History')}>
          Ver Senhas
        </TextLink>

      </View>

      <StatusBar style="auto" />
    </View>
  );
}
