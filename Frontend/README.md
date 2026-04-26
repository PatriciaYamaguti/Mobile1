# Pass Generator - Frontend

Aplicativo React Native com Expo para gerar senhas, salvar historico e autenticar usuarios.

## Stack

- Expo SDK 54
- React Native 0.81.5
- TypeScript
- NativeWind v4 + Tailwind CSS v3.4.x

## Pre-requisitos

- Node.js `20.19.4` (ou `20.x` compativel)
- npm

Verificacao rapida:

```bash
node -v
npm -v
```

## Instalacao

No diretorio `Frontend`:

```bash
npm install
```

## Execucao

Iniciar o projeto com cache limpo:

```bash
npx expo start --clear
```

Atalhos no terminal do Expo:

- `a` abre no Android
- `i` abre no iOS (macOS)
- `w` abre no Web

```

## Configuracao NativeWind

Arquivos de configuracao:

- `babel.config.js`
- `tailwind.config.js`
- `global.css`
- `metro.config.js`
- `nativewind-env.d.ts`
- `tsconfig.json`

Import do CSS global (ja configurado):

```tsx
// App.tsx (primeira linha)
import './global.css';
```

## Estrutura principal

- `App.tsx` - entrada principal com navegacao
- `src/Pages/Home.tsx` - geracao/copia/salvar senha
- `src/Pages/History.tsx` - lista de historico
- `src/Pages/SignIn.tsx` - login
- `src/Pages/SignUp.tsx` - cadastro
- `src/context/AuthContext.tsx` - estado de autenticacao
- `src/services/api.ts` - comunicacao com backend

## API

A URL base da API pode ser configurada por variavel de ambiente:

- `EXPO_PUBLIC_API_URL`

Sem essa variavel, o app usa:

- Android emulador: `http://10.0.2.2:3333`
- Demais plataformas: `http://localhost:3333`

## Scripts uteis

```bash
npm run start
npm run android
npm run ios
npm run web
npx tsc --noEmit
npx expo-doctor
```
