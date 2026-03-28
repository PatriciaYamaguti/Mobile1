import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export default function SignIn({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    if (route?.params?.email) {
      setEmail(route.params.email);
    }
  }, [route?.params?.email]);

  const canSubmit = email.trim().length > 0 && senha.trim().length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGN IN</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      <Pressable
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        disabled={!canSubmit}
        onPress={() => navigation.navigate('Home', { email })}
      >
        <Text style={styles.buttonText}>ENTRAR</Text>
      </Pressable>

      <Text style={styles.footerText}>
        Não possui conta ainda?{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate('SignUp')}>
          Crie agora
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
    marginLeft: 4,
  },
  input: {
    height: 46,
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 18,
    backgroundColor: '#E8F1FF',
  },
  button: {
    height: 50,
    backgroundColor: '#1976D2',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    marginTop: 14,
    color: '#555',
    textAlign: 'center',
    fontSize: 14,
  },
  linkText: {
    color: '#1976D2',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});