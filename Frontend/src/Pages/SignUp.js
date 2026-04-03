import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PageTitle from '../componentes/PageTitle';
import FormField from '../componentes/FormField';
import PrimaryButton from '../componentes/PrimaryButton';
import TextLink from '../componentes/TextLink';
import { signup } from '../services/api';
import { showAlert } from '../utils/showAlert';

export default function SignUp({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const MIN_PASSWORD_LENGTH = 6;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errors = useMemo(() => {
    const nextErrors = {};

    if (!nome.trim()) nextErrors.nome = 'Nome e obrigatorio';

    if (!email.trim()) {
      nextErrors.email = 'Email e obrigatorio';
    } else if (!emailRegex.test(email.trim().toLowerCase())) {
      nextErrors.email = 'Digite um email valido';
    }

    if (!senha) {
      nextErrors.senha = 'Senha e obrigatoria';
    } else if (senha.length < MIN_PASSWORD_LENGTH) {
      nextErrors.senha = `Senha deve conter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`;
    }

    if (!confirmSenha) {
      nextErrors.confirmSenha = 'Confirme sua senha';
    } else if (senha !== confirmSenha) {
      nextErrors.confirmSenha = 'As senhas devem ser iguais';
    }

    return nextErrors;
  }, [nome, email, senha, confirmSenha]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleRegister = async () => {
    setSubmitted(true);
    if (!isFormValid || loading) return;

    try {
      setLoading(true);
      await signup({
        name: nome.trim(),
        email: email.trim(),
        password: senha,
        repeatPassword: confirmSenha,
      });

      showAlert('Sucesso', 'Conta criada com sucesso');
      navigation.navigate('SignIn', { email: email.trim() });
    } catch (error) {
      showAlert('Erro no cadastro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <PageTitle>SIGN UP</PageTitle>

      <FormField
        label="Nome"
        value={nome}
        onChangeText={setNome}
        error={submitted ? errors.nome : ''}
      />

      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={submitted ? errors.email : ''}
      />

      <FormField
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
        error={submitted ? errors.senha : ''}
      />

      <FormField
        label="Confirmar Senha"
        value={confirmSenha}
        onChangeText={setConfirmSenha}
        secureTextEntry
        autoCapitalize="none"
        error={submitted ? errors.confirmSenha : ''}
      />

      <PrimaryButton
        title={loading ? 'REGISTRANDO...' : 'REGISTRAR'}
        disabled={loading}
        onPress={handleRegister}
      />

      <TextLink style={styles.footerText} onPress={() => navigation.navigate('SignIn')}>
        Voltar
      </TextLink>
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
  footerText: {
    textAlign: 'center',
    marginTop: 15,
  },
});
