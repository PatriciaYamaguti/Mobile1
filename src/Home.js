import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Pressable, Alert, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

function makePassword(length = 12) {
  const chars = '1234567890987654321';
  let pw = '';
  for (let i = 0; i < length; i++) {
    pw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pw;
}

export default function Home({ navigation, route }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [appNameModal, setAppNameModal] = useState('');

  useEffect(() => {
    if (route?.params?.email) {
      setEmail(route.params.email);
    }
    console.log('Home mounted');
  }, [route?.params?.email]);

  const savePasswordToHistory = async (appName, pw) => {
    try {
      const existing = await AsyncStorage.getItem('history');
      const arr = existing ? JSON.parse(existing) : [];
      arr.unshift({ id: Date.now().toString(), account: appName, password: pw, createdAt: new Date().toISOString() });
      await AsyncStorage.setItem('history', JSON.stringify(arr));
      Alert.alert('Salvo', 'Senha salva com sucesso no histórico');
    } catch (e) {
      console.warn('could not save password', e);
      Alert.alert('Erro', 'Não foi possível salvar a senha');
    }
  };

  const handleGenerate = () => {
    const pw = makePassword();
    setPassword(pw);
  };

  const handleSave = () => {
    if (!password) return;
    setAppNameModal(account);
    setModalVisible(true);
  };

  const canCreate = password.trim().length > 0 && appNameModal.trim().length > 0;

  const handleCreate = async () => {
    if (!canCreate) return;
    await savePasswordToHistory(appNameModal.trim(), password);
    setModalVisible(false);
    setPassword('');
    setAppNameModal('');
    setAccount('');
  };

  const handleCopy = () => {
    if (password) {
      Clipboard.setStringAsync(password);
      Alert.alert('Copiado', 'Senha copiada para a área de transferência');
    }
  };

  const canSave = password.trim().length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GERADOR DE SENHA</Text>
      {email ? <Text style={styles.subTitle}>Bem-vindo, {email}</Text> : null}
      <Image style={styles.image} source={require('./pass.png')} />

      <View style={styles.codeArea}>
        <Text selectable style={styles.codeText}>{password || '--------'}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Pressable
          style={[styles.button, styles.generateButton]}
          onPress={handleGenerate}
        >
          <Text style={styles.buttonText}>GERAR</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.saveButton, !canSave && styles.buttonDisabled]}
          disabled={!canSave}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>SALVAR</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.copyButton]} onPress={handleCopy}>
          <Text style={styles.buttonText}>COPIAR</Text>
        </Pressable>
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
              <Pressable
                style={[styles.modalActionButton, styles.createButton, !canCreate && styles.buttonDisabled]}
                disabled={!canCreate}
                onPress={handleCreate}
              >
                <Text style={styles.modalActionText}>CRIAR</Text>
              </Pressable>
              <Pressable style={[styles.modalActionButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalActionText}>CANCELAR</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable onPress={() => {
          console.log('nav to history');
          navigation.navigate('History');
        }}>
        <Text style={styles.linkText}>Ver Senhas</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#0057D9',
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  subTitle: {
    color: '#333',
    fontSize: 14,
    marginBottom: 8,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginLeft: 8,
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
  button: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 6,
  },
  generateButton: {
    backgroundColor: '#1976D2',
  },
  copyButton: {
    backgroundColor: '#1976D2',
  },
  saveButton: {
    backgroundColor: '#0288D1',
  },
  cancelButton: {
    backgroundColor: '#1976D2',
  },
  createButton: {
    backgroundColor: '#1976D2',
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#555',
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: 'underline',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalActionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
