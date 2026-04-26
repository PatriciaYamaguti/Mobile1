import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PageTitle from '../componentes/PageTitle';
import PrimaryButton from '../componentes/PrimaryButton';
import TextLink from '../componentes/TextLink';
import { savePasswordHistory, signout as signoutRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/showAlert';
import type { AppError } from '../types';
import type { RootStackParamList } from '../../App';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

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
  const [modalVisible, setModalVisible] = useState(false);
  const [appNameModal, setAppNameModal] = useState('');
  const [loadingSignout, setLoadingSignout] = useState(false);
  const { user, token, signOut } = useAuth();

  useEffect(() => {
    setDisplayName(user?.name || user?.email || '');
  }, [user?.name, user?.email]);

  const savePasswordToHistory = async (appName: string, pw: string) => {
    try {
      if (!token) {
        throw new Error('Usuario nao autenticado');
      }
      await savePasswordHistory(token, {
        appName,
        password: pw,
      });
      Alert.alert('Salvo', 'Senha salva com sucesso no historico');
    } catch (e: unknown) {
      console.warn('could not save password', e);
      Alert.alert('Erro', getErrorMessage(e, 'Nao foi possivel salvar a senha'));
    }
  };

  const handleGenerate = () => {
    const pw = makePassword();
    setPassword(pw);
  };

  const handleSave = () => {
    if (!password) return;
    setAppNameModal('');
    setModalVisible(true);
  };

  const canCreate = password.trim().length > 0 && appNameModal.trim().length > 0;

  const handleCreate = async () => {
    if (!canCreate) return;
    await savePasswordToHistory(appNameModal.trim(), password);
    setModalVisible(false);
    setPassword('');
    setAppNameModal('');
  };

  const handleCopy = () => {
    if (password) {
      Clipboard.setStringAsync(password);
      Alert.alert('Copiado', 'Senha copiada para a area de transferencia');
    }
  };

  const canSave = password.trim().length > 0;

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
            title="SALVAR"
            disabled={!canSave}
            onPress={handleSave}
            className="mt-0 bg-[#0288D1]"
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

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[90%] items-stretch rounded-xl bg-white p-5">
            <Text className="mb-[15px] text-center text-lg font-bold text-[#1976D2]">CADASTRO DE SENHA</Text>

            <Text className="mb-1.5 ml-1 text-sm text-[#333]">Senha gerada</Text>
            <View className="mb-3 h-[45px] justify-center rounded-md border border-[#1976D2] bg-[#E0F7FF] px-3">
              <Text className="text-base text-black">{password}</Text>
            </View>

            <Text className="mb-1.5 ml-1 text-sm text-[#333]">Nome do aplicativo</Text>
            <TextInput
              className="mb-2.5 h-[46px] w-full rounded-md border border-[#1976D2] bg-[#E8F1FF] px-3"
              value={appNameModal}
              onChangeText={setAppNameModal}
              placeholder="Informe um nome de app"
            />

            <View className="mt-2.5 w-full gap-2.5">
              <PrimaryButton
                title="CRIAR"
                disabled={!canCreate}
                onPress={handleCreate}
                className="mb-0 mt-0 h-12 w-full rounded-md"
              />
              <PrimaryButton
                title="CANCELAR"
                onPress={() => setModalVisible(false)}
                className="mb-0 mt-0 h-12 w-full rounded-md"
              />
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}
