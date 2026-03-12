import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
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

export default function Home({ navigation }) {
  const [password, setPassword] = useState('');
  useEffect(() => {
    console.log('Home mounted');
  }, []);

  const savePassword = async (pw) => {
    try {
      const existing = await AsyncStorage.getItem('history');
      const arr = existing ? JSON.parse(existing) : [];
      arr.unshift(pw); 
      await AsyncStorage.setItem('history', JSON.stringify(arr));
    } catch (e) {
      console.warn('could not save password', e);
    }
  };

  const handleGenerate = () => {
    const pw = makePassword();
    setPassword(pw);
    savePassword(pw);
  };

  const handleCopy = () => {
    if (password) {
      Clipboard.setStringAsync(password);
      Alert.alert('Copiado', 'Senha copiada para a área de transferência');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GERADOR DE SENHA</Text>
      <Image style={styles.image} source={require('./pass.png')} />

      <View style={styles.codeArea}>
        <Text selectable style={styles.codeText}>{password || '--------'}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Pressable style={[styles.button, styles.generateButton]} onPress={handleGenerate}>
          <Text style={styles.buttonText}>GERAR</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.copyButton]} onPress={handleCopy}>
          <Text style={styles.buttonText}>COPIAR</Text>
        </Pressable>
      </View>

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
    marginBottom: 20,
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
});
