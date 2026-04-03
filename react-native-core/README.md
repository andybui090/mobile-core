# 📱 React Native Core Template

## 🚀 Overview

A scalable and production-ready **React Native core template** built with modern best practices:

- ⚛️ React Native `0.84+`
- 🧠 TypeScript
- 🧩 Feature-based architecture
- 🧱 Clean Architecture (lightweight & practical)
- 🔄 Reusable across multiple projects

This template is designed to help teams build **maintainable, scalable, and testable mobile applications**.

---

## 🧱 Architecture

### 🔹 Principles

- Feature isolation
- Separation of concerns
- Domain-driven structure (lightweight)
- Scalable for large teams

### 🔹 Data Flow

```
Screen → Hook → UseCase → API → Response
```

---

## 📂 Project Structure

```
src/
├── app/                # App entry, providers, navigation
│   ├── navigation/
│   ├── providers/
│   └── App.tsx
│
├── features/           # Feature modules (domain-driven)
│   └── auth/
│       ├── api/
│       ├── domain/
│       │   ├── entities/
│       │   └── usecases/
│       ├── hooks/
│       ├── screens/
│       ├── components/
│       └── store/
│
├── shared/             # Reusable UI & utilities
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── constants/
│
├── services/           # Core services (no business logic)
│   ├── http/           # Axios instance, interceptors
│   ├── storage/        # MMKV / AsyncStorage wrapper
│   └── logger/
│
├── store/              # Global state (Zustand / Redux)
├── config/             # App configs & env
├── theme/              # Design system
├── assets/             # Images, fonts
└── types/              # Global types
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

- React Native
- TypeScript
- React Query (data fetching)
- Zustand (state management)
- Axios (HTTP client)
- React Navigation

---

## 🧠 Feature Structure Example

```
features/auth/
├── api/            # API calls
├── domain/         # Business logic
│   ├── entities/
│   └── usecases/
├── hooks/          # Orchestration logic
├── screens/        # UI screens
├── components/     # Local components
└── store/          # Feature state
```

---

## 📐 Coding Guidelines

### ✅ Do

- Use absolute imports (`@/features/...`)
- Keep features isolated
- Use hooks for orchestration logic
- Keep business logic in `domain/`

### ❌ Don't

- Call APIs directly inside screens
- Put business logic in UI components
- Share logic across features without abstraction
- Turn `services/` into a dumping folder

---

## 🔄 State Management

- Server state → React Query
- Client state → Zustand (or Redux if needed)

---

## 🌐 API Layer

- Centralized Axios instance
- Interceptors for:

  - Auth token
  - Error handling
  - Refresh token (optional)

---

## 🧪 Testing

```bash
yarn test
```

- Jest
- React Native Testing Library

---

## 🚀 Production Recommendations

- Add global error boundary
- Implement toast/notification system
- Normalize API errors
- Add logging (Sentry, etc.)
- Setup CI/CD pipeline

---

## 📌 Notes

- Use `yarn.lock` for consistent dependencies
- Do NOT mix `npm` and `yarn`
- Keep architecture consistent across projects

---

## 📄 License

Private – Internal usage only
