import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PageTitle from '../componentes/PageTitle';
import FormField from '../componentes/FormField';
import PrimaryButton from '../componentes/PrimaryButton';
import TextLink from '../componentes/TextLink';
import { signin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/showAlert';

export default function SignIn({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [apiEmailError, setApiEmailError] = useState('');
  const [apiSenhaError, setApiSenhaError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { signIn } = useAuth();
  const MIN_PASSWORD_LENGTH = 6;

  useEffect(() => {
    if (route?.params?.email) {
      setEmail(route.params.email);
    }
  }, [route?.params?.email]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailError = !email.trim()
    ? 'Email e obrigatorio'
    : !emailRegex.test(email.trim().toLowerCase())
      ? 'Digite um email valido'
      : '';

  const senhaError = !senha
    ? 'Senha e obrigatoria'
    : senha.length < MIN_PASSWORD_LENGTH
      ? `Senha deve conter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`
      : '';

  const canSubmit = !emailError && !senhaError;

  const handleSignIn = async () => {
    setSubmitted(true);
    setApiEmailError('');
    setApiSenhaError('');
    if (!canSubmit || loading) return;

    try {
      setLoading(true);
      const data = await signin({
        email: email.trim(),
        password: senha,
      });

      await signIn(data.token, data.user);
    } catch (error) {
      if (error.status === 404) {
        setApiEmailError('E-mail nao cadastrado.');
        return;
      }
      if (error.status === 401) {
        setApiSenhaError('Senha incorreta');
        return;
      }
      showAlert('Erro no login', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <PageTitle style={styles.title}>SIGN IN</PageTitle>

      <FormField
        label="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          if (apiEmailError) setApiEmailError('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        inputStyle={styles.input}
        error={submitted ? emailError || apiEmailError : ''}
      />

      <FormField
        label="Senha"
        value={senha}
        onChangeText={(value) => {
          setSenha(value);
          if (apiSenhaError) setApiSenhaError('');
        }}
        secureTextEntry
        autoCapitalize="none"
        inputStyle={styles.input}
        error={submitted ? senhaError || apiSenhaError : ''}
      />

      <PrimaryButton
        title={loading ? 'ENTRANDO...' : 'ENTRAR'}
        disabled={loading}
        onPress={handleSignIn}
      />

      <Text style={styles.footerText}>
        Nao possui conta ainda? <TextLink onPress={() => navigation.navigate('SignUp')}>Crie agora</TextLink>
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
    marginBottom: 30,
  },
  input: {
    marginBottom: 18,
  },
  footerText: {
    marginTop: 14,
    color: '#555',
    textAlign: 'center',
    fontSize: 14,
  },
});
