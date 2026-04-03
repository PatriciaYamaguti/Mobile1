import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageTitle from '../componentes/PageTitle';
import PrimaryButton from '../componentes/PrimaryButton';
import TextLink from '../componentes/TextLink';
import { signout as signoutRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/showAlert';

function makePassword(length = 12) {
  const chars = '1234567890987654321';
  let pw = '';
  for (let i = 0; i < length; i++) {
    pw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pw;
}

export default function Home({ navigation }) {
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [appNameModal, setAppNameModal] = useState('');
  const [loadingSignout, setLoadingSignout] = useState(false);
  const { user, token, signOut } = useAuth();

  useEffect(() => {
    setDisplayName(user?.name || user?.email || '');
  }, [user?.name, user?.email]);

  const savePasswordToHistory = async (appName, pw) => {
    try {
      const existing = await AsyncStorage.getItem('history');
      const arr = existing ? JSON.parse(existing) : [];
      arr.unshift({ id: Date.now().toString(), account: appName, password: pw, createdAt: new Date().toISOString() });
      await AsyncStorage.setItem('history', JSON.stringify(arr));
      Alert.alert('Salvo', 'Senha salva com sucesso no historico');
    } catch (e) {
      console.warn('could not save password', e);
      Alert.alert('Erro', 'Nao foi possivel salvar a senha');
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

    try {
      setLoadingSignout(true);
      if (token) {
        await signoutRequest(token);
      }
      await signOut();
    } catch (error) {
      showAlert('Erro ao sair', error.message || 'Nao foi possivel finalizar sessao');
    } finally {
      setLoadingSignout(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <PageTitle style={styles.title}>GERADOR DE SENHA</PageTitle>
        {displayName ? <Text style={styles.subTitle}>Bem-vindo, {displayName}</Text> : null}
        <Image style={styles.image} source={require('../pass.png')} />

        <View style={styles.codeArea}>
          <Text selectable style={styles.codeText}>{password || '--------'}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <PrimaryButton
            title="GERAR"
            onPress={handleGenerate}
            style={styles.generateButton}
            textStyle={styles.homeButtonText}
          />

          <PrimaryButton
            title="SALVAR"
            disabled={!canSave}
            onPress={handleSave}
            style={styles.saveButton}
            textStyle={styles.homeButtonText}
          />

          <PrimaryButton
            title="COPIAR"
            onPress={handleCopy}
            style={styles.copyButton}
            textStyle={styles.homeButtonText}
          />
        </View>

        <TextLink style={styles.linkText} onPress={() => navigation.navigate('History')}>
          Ver Senhas
        </TextLink>
      </View>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>CADASTRO DE SENHA</Text>

            <Text style={styles.modalLabel}>Senha gerada</Text>
            <View style={styles.modalPasswordBox}>
              <Text style={styles.modalPassword}>{password}</Text>
            </View>

            <Text style={styles.modalLabel}>Nome do aplicativo</Text>
            <TextInput
              style={styles.input}
              value={appNameModal}
              onChangeText={setAppNameModal}
              placeholder="Informe um nome de app"
            />

            <View style={styles.modalButtons}>
              <PrimaryButton
                title="CRIAR"
                disabled={!canCreate}
                onPress={handleCreate}
                style={styles.modalActionButton}
              />
              <PrimaryButton
                title="CANCELAR"
                onPress={() => setModalVisible(false)}
                style={styles.modalActionButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.signoutContainer}>
        <PrimaryButton
          title={loadingSignout ? 'SAINDO...' : 'SAIR'}
          onPress={handleSignOut}
          disabled={loadingSignout}
          style={styles.signoutButton}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    padding: 20,
  },
  mainContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#0057D9',
    fontSize: 28,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  subTitle: {
    color: '#333',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 46,
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E8F1FF',
    marginBottom: 10,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  codeArea: {
    width: '100%',
    minHeight: 60,
    backgroundColor: '#4DB5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: '#1976D2',
    marginTop: 0,
  },
  copyButton: {
    backgroundColor: '#1976D2',
    marginTop: 0,
  },
  saveButton: {
    backgroundColor: '#0288D1',
    marginTop: 0,
  },
  homeButtonText: {
    fontSize: 18,
  },
  linkText: {
    color: '#555',
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'normal',
  },
  signoutButton: {
    width: 130,
    marginTop: 0,
    backgroundColor: '#d32f2f',
  },
  signoutContainer: {
    width: '100%',
    marginTop: 'auto',
    alignItems: 'flex-end',
    paddingBottom: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginLeft: 4,
  },
  modalPasswordBox: {
    height: 45,
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: 6,
    marginBottom: 12,
    justifyContent: 'center',
    backgroundColor: '#E0F7FF',
    paddingHorizontal: 12,
  },
  modalPassword: {
    fontSize: 16,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  modalActionButton: {
    width: '100%',
    height: 48,
    borderRadius: 6,
    marginBottom: 0,
  },
});
