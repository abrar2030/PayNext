# PayNext - Expo Mobile App

A full-featured mobile payment app built with **Expo (React Native)** and **Expo Router**, converted from a Next.js 15 web app.

## Tech Stack

| Layer            | Technology                            |
| ---------------- | ------------------------------------- |
| Framework        | Expo SDK 51 + React Native 0.74       |
| Navigation       | Expo Router v3 (file-based)           |
| Auth Persistence | AsyncStorage                          |
| Forms            | React Hook Form + Zod                 |
| QR Scanning      | expo-camera (CameraView)              |
| QR Generation    | react-native-qrcode-svg               |
| Icons            | @expo/vector-icons (Ionicons)         |
| Gradients        | expo-linear-gradient                  |
| Clipboard        | expo-clipboard                        |
| Sharing          | expo-sharing / React Native Share API |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- iOS Simulator (macOS) or Android Emulator / physical device with Expo Go

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Start Expo dev server
npx expo start
```

Then:

- Press **i** for iOS simulator
- Press **a** for Android emulator
- Scan QR code with **Expo Go** on a physical device

---

## Project Structure

```
paynext-expo/
├── app/
│   ├── _layout.tsx          # Root layout (providers)
│   ├── index.tsx            # Entry redirect
│   ├── auth/
│   │   ├── _layout.tsx      # Auth guard (redirects if logged in)
│   │   ├── login.tsx        # Login screen ✨ NEW
│   │   └── register.tsx     # Register screen ✨ NEW
│   └── tabs/
│       ├── _layout.tsx      # Tab bar layout
│       ├── index.tsx        # Dashboard / Home
│       ├── send.tsx         # Send Money
│       ├── request.tsx      # Request Money + QR generation
│       ├── transactions.tsx # Transaction History with filters
│       └── profile.tsx      # Profile + Settings
├── components/
│   ├── QrScanner.tsx        # Native camera QR scanner
│   └── ErrorBoundary.tsx    # React class error boundary
├── contexts/
│   └── AuthContext.tsx      # Auth state + AsyncStorage
├── hooks/
│   ├── useToast.ts
│   └── useColorScheme.ts
├── lib/
│   ├── api-client.ts        # API client + mock data
│   ├── theme.ts             # Design tokens
│   └── utils.ts             # Shared helpers
└── app.json                 # Expo config
```

---

## Features

### ✅ Screens

- **Login** - email/password, form validation, show/hide password
- **Register** - full form + auto-login after registration
- **Dashboard** - balance card, quick actions, recent transactions, pull-to-refresh
- **Send Money** - recipient, amount (with quick-pick pills), memo, success banner
- **Request Money** - generates QR code, copy/share link
- **Transaction History** - search, filter by type (all/received/sent), summary cards
- **Profile** - edit profile, settings toggles (notifications, biometric), logout

### ✅ UX / Quality

- Full **dark mode** support (system-aware)
- **Pull-to-refresh** on Dashboard and Transactions
- **KeyboardAvoidingView** on all forms
- **Quick amount pills** on Send screen (missing in original)
- **Auth guard** - unauthenticated users redirected to login
- **Error boundaries** for crash recovery
- **AsyncStorage** replaces `localStorage` for token persistence
- Mock API always succeeds (original had random 80% success rate - fixed)
- `useMockData` flag fixed to work correctly in dev

### ✅ Native Replacements

| Web (Next.js)           | Native (Expo)                               |
| ----------------------- | ------------------------------------------- |
| `useRouter` / `Link`    | `expo-router` `useRouter` / `Link`          |
| `localStorage`          | `@react-native-async-storage/async-storage` |
| `html5-qrcode`          | `expo-camera` `CameraView`                  |
| `qrcode.react` (canvas) | `react-native-qrcode-svg`                   |
| `navigator.clipboard`   | `expo-clipboard`                            |
| `navigator.share`       | React Native `Share` API                    |
| Tailwind CSS + Radix UI | StyleSheet + custom design tokens           |
| `next/font`             | System fonts                                |
| `sonner` toasts         | `Alert` + inline feedback                   |

---

## Environment Variables

| Variable                      | Default                     | Description                        |
| ----------------------------- | --------------------------- | ---------------------------------- |
| `EXPO_PUBLIC_API_BASE_URL`    | `http://localhost:8080`     | Backend base URL                   |
| `EXPO_PUBLIC_API_GATEWAY_URL` | `http://localhost:8080/api` | API Gateway URL                    |
| `EXPO_PUBLIC_ENV`             | -                           | Set to `development` for mock data |

> **Note:** In development (`__DEV__` = true), mock data is always used regardless of the env var.

---

## Running Tests

```bash
npm test       # watch mode
npm run test:ci  # CI with coverage
```

---

## Building for Production

```bash
# iOS
npx expo build:ios

# Android
npx expo build:android

# Or use EAS Build (recommended)
npx eas build --platform all
```
