# 📱 React Native Core Template

## 🚀 Overview

A scalable and production-ready **React Native core template** built with modern best practices:

* ⚛️ React Native `0.84+`
* 🧠 TypeScript
* 🧩 Feature-based architecture
* 🧱 Clean Architecture (lightweight & practical)
* 🔄 Reusable across multiple projects

This template is designed to help build **maintainable, scalable, and high-performance mobile applications**.

---

## 🧠 Core Philosophy

This project follows a **pragmatic architecture**:

* ❌ No over-engineering (no DI container, no heavy abstraction)
* ✅ Clear separation of responsibilities
* ✅ Easy to scale when needed

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

> 🔥 Rule: UI **never calls API directly**

---

## 📂 Project Structure

```
src/
├── app/                    # App entry, providers, navigation
│   ├── App.tsx
│   ├── providers.tsx
│   └── routes.tsx
│
├── core/                   # Infrastructure (NO business logic)
│   ├── api/                # Axios client & interceptors
│   ├── storage/            # MMKV wrapper
│   ├── config/             # Env & configs
│   ├── navigation/         # Navigation setup
│   ├── services/           # Socket, analytics, etc.
│   └── utils/
│
├── features/               # Feature modules
│   └── auth/
│       ├── api/            # API calls (feature-specific)
│       ├── usecases/       # Business logic
│       ├── components/     # UI components (local)
│       ├── hooks/          # Orchestration (React Query, etc.)
│       ├── screens/        # Screens
│       ├── store/          # Zustand store (if needed)
│       ├── types.ts
│       └── index.ts
│
├── shared/                 # Reusable across features
│   ├── ui/                 # Design system (Button, Input, etc.)
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   └── theme/
```

---

## 🧩 Feature Structure Example

```
features/auth/
├── api/
│   └── auth.api.ts
│
├── usecases/
│   └── login.ts
│
├── hooks/
│   └── useLogin.ts
│
├── screens/
│   └── LoginScreen.tsx
│
├── components/
│   └── LoginForm.tsx
│
├── store/
│   └── useAuthStore.ts
│
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
* MMKV (storage)

---

## 🔄 State Management

### ✅ Correct Usage

| Data Type     | Tool               |
| ------------- | ------------------ |
| Server data   | React Query        |
| Auth / global | Zustand            |
| UI state      | Zustand (optional) |

---

### ❌ Avoid

* Putting API data into Zustand
* Creating one global store for everything

---

## 🌐 API Layer

* Centralized Axios instance in `core/api`
* Feature APIs inside each feature
* Supports:

  * Auth token injection
  * Error handling
  * Refresh token (optional)

---

## 📐 Coding Guidelines

### ✅ Do

* Use absolute imports (`@/features/...`)
* Keep features isolated
* Put business logic in `usecases`
* Use hooks to orchestrate logic

---

### ❌ Don't

* Call API inside screens
* Put logic inside UI components
* Share logic across features without structure
* Turn `core/` into a dumping folder

---

## 🚀 Production Recommendations

* Add global error boundary
* Add toast/notification system
* Normalize API errors
* Add logging (Sentry, etc.)
* Optimize FlatList for feed
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
