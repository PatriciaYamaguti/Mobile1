# Pass Generator

Aplicativo React Native + Expo para gerar senhas e gerenciar histórico.

## Pré-requisitos

- Node.js LTS (>= 18)
- npm ou yarn
- Expo CLI (instalar globalmente):

```bash
npm install -g expo-cli
```

## Instalação

No diretório do projeto:

```bash
npm install
```

ou

```bash
yarn install
```

## Execução

### Iniciar servidor Expo

```bash
npm start
```

ou

```bash
yarn start
```

### Android

```bash
npm run android
```

ou

```bash
yarn android
```

### iOS

```bash
npm run ios
```

ou

```bash
yarn ios
```

### Web

```bash
npm run web
```

ou

```bash
yarn web
```

## Estrutura principal

- `App.js` - componente raiz
- `src/Home.js` - tela principal do gerador de senha
- `src/History.js` - histórico de senhas geradas
- `src/SignIn.js`, `src/SignUp.js` - telas de login/registro

## Notas

- Use um emulador de Android/iOS ou o Expo Go no celular para testar o app em dispositivos reais.
- Se houver cache antigo, limpe com:

```bash
expo start -c
```
