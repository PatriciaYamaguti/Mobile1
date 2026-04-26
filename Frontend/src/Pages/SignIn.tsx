import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PageTitle from '../componentes/PageTitle';
import FormField from '../componentes/FormField';
import PrimaryButton from '../componentes/PrimaryButton';
import TextLink from '../componentes/TextLink';
import { signin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/showAlert';
import type { AppError } from '../types';
import type { RootStackParamList } from '../../App';

type SignInProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export default function SignIn({ navigation, route }: SignInProps) {
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
    } catch (error: unknown) {
      const apiError = error as AppError;
      if (apiError.status === 404) {
        setApiEmailError('E-mail nao cadastrado.');
        return;
      }
      if (apiError.status === 401) {
        setApiSenhaError('Senha incorreta');
        return;
      }
      showAlert('Erro no login', apiError.message || 'Nao foi possivel fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white p-5">
      <PageTitle className="mb-[30px] text-4xl">SIGN IN</PageTitle>

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
        inputClassName="mb-[18px]"
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
        inputClassName="mb-[18px]"
        error={submitted ? senhaError || apiSenhaError : ''}
      />

      <PrimaryButton
        title={loading ? 'ENTRANDO...' : 'ENTRAR'}
        disabled={loading}
        onPress={handleSignIn}
      />

      <Text className="mt-3.5 text-center text-sm text-[#555]">
        Nao possui conta ainda? <TextLink onPress={() => navigation.navigate('SignUp')}>Crie agora</TextLink>
      </Text>
    </View>
  );
}
