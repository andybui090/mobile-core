# 📱 React Native Core Architecture

## 🚀 Overview

This project is a **scalable React Native base template** built with:

* Feature-based architecture
* Pragmatic Clean Architecture
* Design System (Theme + UI primitives)
* MMKV Storage
* Environment configuration (dev / staging / prod)

Goal:

> Build maintainable, scalable, and production-ready mobile apps.

---

## 🧠 Core Principles

* ❌ No over-engineering
* ✅ Clear separation of concerns
* ✅ Reusable across multiple projects
* ✅ Predictable structure

---

## 🔄 Data Flow

```
Screen → Hook → UseCase → API → Response
```

> 🔥 Rule: UI MUST NOT call API directly

---

## 📂 Project Structure

```
src/
├── app/                    # App entry, navigation, providers
│
├── core/                   # Infrastructure layer (NO business logic)
│   ├── network/            # axios client, interceptors
│   ├── storage/            # MMKV wrapper
│   ├── config/             # env config
│   └── utils/
│
├── features/               # Feature-based modules
│   └── auth/
│       ├── data/
│       ├── application/
│       ├── presentation/
│       └── store/
│
├── shared/
│   ├── ui/                 # Design system components
│   ├── theme/              # Theme + tokens
│   └── utils/
│
├── dev/                    # Playground / testing UI
```

---

## 🎨 Design System

### 🔹 Theme Structure

```
shared/theme/
├── colors.ts
├── fonts.ts
├── fontScale.ts
├── tokens/
│   ├── sizes.ts
│   └── spacing.ts
├── theme.ts
├── ThemeProvider.tsx
```

---

### 🔹 Design Tokens

#### Sizes (global scale)

```
sizes = { xs, sm, md, lg, xl, xxl }
```

#### Spacing

```
spacing = {
  xs, sm, md, lg, xl,
  screenPadding,
  cardPadding
}
```

---

### 🔹 Usage Rules

* ❌ Do NOT hardcode values (`padding: 16`)
* ✅ Always use theme (`theme.spacing.md`)

---

## 🧱 UI Layer

```
shared/ui/
├── components/
│   ├── Header/
│   ├── Icon/
│   ├── Text/
│   ├── Pressable/
│
├── layout/
│   ├── Row.tsx
│   ├── Column.tsx
│   ├── Box.tsx
│   ├── Stack.tsx
```

---

### 🔹 Layout Primitives

* Row → horizontal layout
* Column → vertical layout
* Box → padding / margin / background
* Stack → flexible layout (row/column)

---

### 🔹 Rules

* ❌ No business logic
* ❌ No API calls
* ✅ Pure UI only

---

## 🎯 Icon System

* Centralized in `shared/ui/Icon`
* Supports multiple icon sets
* Uses theme sizes

---

## 🧠 Storage (MMKV)

```
core/storage/
├── mmkv.ts
├── index.ts
├── keys.ts
```

### Rules

* ✅ Use constant keys
* ❌ Do NOT store large data
* ❌ Do NOT use in UI layer

---

## 🌐 Environment System

```
core/config/env.ts
```

### Supported environments

* development
* staging
* production

### Usage

```
ENV.API_URL
isDev
isProd
```

---

## 📡 API Layer

```
core/network/
├── client.ts
├── interceptors/
```

### Responsibilities

* attach token
* handle errors
* baseURL from ENV

---

## 🧩 Feature Structure

```
features/auth/
├── data/
├── application/
├── presentation/
```

---

### 🔹 Responsibilities

* data → API calls
* application → business logic
* presentation → UI + hooks

---

## ⚙️ State Management

* Server state → React Query
* Global state → Zustand
* UI state → local state / Zustand

---

## ❌ Anti-patterns

* ❌ API call inside component
* ❌ Business logic in UI
* ❌ Hardcoded spacing/colors
* ❌ Global store for everything
* ❌ Using ENV in UI layer

---

## 🚀 Future Improvements

* Error handling system
* Logging (Sentry)
* Offline support
* Pagination + caching
* Design system expansion

---

## 🧠 Final Thought

> Simple architecture done right > Complex architecture done wrong
