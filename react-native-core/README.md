# 📱 React Native Core Template

## 🚀 Overview

A scalable and production-ready **React Native core template** built with modern best practices:

* ⚛️ React Native `0.84+`
* 🧠 TypeScript
* 🧩 Feature-based architecture
* 🧱 Pragmatic Clean Architecture
* 🔄 Reusable across multiple projects

Designed to build **maintainable, scalable, and high-performance mobile applications** without unnecessary complexity.

---

## 🧠 Core Philosophy

This project follows a **pragmatic approach**:

* ❌ No over-engineering (no DI container, no heavy abstraction)
* ✅ Clear separation of concerns
* ✅ Predictable structure for teams
* ✅ Easy onboarding & scalability

---

## 🧱 Architecture

### 🔹 Principles

* Feature isolation
* Separation of concerns
* Keep it simple & scalable
* Avoid premature abstraction

---

### 🔹 Data Flow (IMPORTANT)

```
Screen → Hook → UseCase → API → Response
```

> 🔥 Rule: UI **must never call API directly**

---

## 📂 Project Structure

```
src/
├── app/                    # App entry, navigation, providers
│   ├── App.tsx
│   ├── navigation/
│   └── providers/
│
├── core/                   # Infrastructure (NO business logic)
│   ├── network/            # Axios client & interceptors
│   ├── storage/            # MMKV wrapper
│   ├── config/             # Env & configs
│   └── utils/
│
├── features/               # Feature modules
│   └── auth/
│       ├── domain/         # Business contracts (optional layer)
│       │   ├── models/
│       │   └── repositories/
│       │
│       ├── data/           # Implementation layer
│       │   ├── api/
│       │   └── repositories/
│       │
│       ├── application/    # Use cases (business logic)
│       │   └── usecases/
│       │
│       ├── presentation/   # UI layer
│       │   ├── hooks/
│       │   ├── screens/
│       │   └── components/
│       │
│       ├── store/          # Zustand (if needed)
│       ├── types.ts
│       └── index.ts
│
├── shared/                 # Reusable across features
│   ├── ui/                 # Design system (Button, Input...)
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   └── theme/
│
├── dev/                    # Development-only tools
│   └── playground/
│       ├── components/     # Test UI components
│       └── screens/        # Playground screens
```

---

## 🧩 Feature Structure Example

```
features/auth/
├── data/api/auth.api.ts
├── application/usecases/login.ts
├── presentation/hooks/useLogin.ts
├── presentation/screens/LoginScreen.tsx
├── presentation/components/LoginForm.tsx
├── store/useAuthStore.ts
├── types.ts
└── index.ts
```

---

## ⚙️ Setup

### Install dependencies

```bash
yarn install
```

---

### Run app

```bash
yarn android
yarn ios
```

---

### Start Metro

```bash
yarn start
```

---

## 🔑 Environment

Create `.env` file:

```env
API_URL=https://api.example.com
```

---

## 📦 Tech Stack

* React Native
* TypeScript
* @tanstack/react-query
* Zustand
* Axios
* React Navigation
* MMKV

---

## 🔄 State Management

### ✅ Recommended

| Data Type   | Tool        |
| ----------- | ----------- |
| Server data | React Query |
| Auth/global | Zustand     |
| UI state    | Zustand     |

---

### ❌ Avoid

* Storing server data in Zustand
* Creating one global store for everything

---

## 🌐 API Layer

* Centralized API client in `core/network`
* Feature-specific APIs inside each feature
* Supports:

  * Auth token injection
  * Error handling
  * Token refresh (optional)

---

## 🧪 Dev Playground

A dedicated space for testing UI and experimenting:

```
src/dev/playground/
```

### Use cases:

* Build & test design system components
* Try UI without affecting real features
* Debug layouts quickly

> ⚠️ This folder is **development-only** and should not contain business logic

---

## 📐 Coding Guidelines

### ✅ Do

* Use absolute imports (`@/features/...`)
* Keep features isolated
* Put business logic in `usecases`
* Use hooks to orchestrate logic
* Keep UI components dumb

---

### ❌ Don't

* Call API inside screens
* Put business logic inside components
* Share logic across features without structure
* Turn `core/` into a dumping folder

---

## 🚀 Production Recommendations

* Add global error boundary
* Add toast/notification system
* Normalize API errors
* Add logging (Sentry, etc.)
* Optimize FlatList performance
* Use pagination & caching (React Query)

---

## 🧪 Testing

```bash
yarn test
```

* Jest
* React Native Testing Library

---

## 📌 Notes

* Use `yarn.lock` for consistency
* Do NOT mix `npm` and `yarn`
* Keep architecture consistent across features

---

## 🧠 Final Thought

> Simple architecture done right > Complex architecture done wrong

---

## 📄 License

Private – Internal usage only