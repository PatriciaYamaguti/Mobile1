import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export default function SignUp({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  const isFormValid = useMemo(() => {
    const hasAll = nome.trim() && email.trim() && senha.trim() && confirmSenha.trim();
    const same = senha === confirmSenha;
    return hasAll && same;
  }, [nome, email, senha, confirmSenha]);

  const handleRegister = () => {
    navigation.navigate('SignIn', { email: email.trim() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGN UP</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

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

      <Text style={styles.label}>Confirmar Senha</Text>
      <TextInput
        style={styles.input}
        value={confirmSenha}
        onChangeText={setConfirmSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      <Pressable
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        disabled={!isFormValid}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>REGISTRAR</Text>
      </Pressable>

      <Text style={styles.footerText} onPress={() => navigation.navigate('SignIn')}>
        Voltar
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
    fontSize: 34,
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
    marginBottom: 16,
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
    textAlign: 'center',
    color: '#1976D2',
    marginTop: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

});