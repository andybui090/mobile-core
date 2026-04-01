# 📱 React Native Core App

## 🚀 Overview

This project is a scalable **React Native core application** built with:

* React Native `0.84.x`
* React `19.x`
* TypeScript
* Yarn
* Feature-based architecture + Clean Architecture principles

---

## 🧱 Project Structure

```
src/
├── app/
├── features/
├── shared/
├── services/
├── store/
├── theme/
├── config/
├── assets/
└── types/
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

## 🧪 Testing

```bash
yarn test
```

---

## 📦 Common Commands

```bash
# add package
yarn add <package>

# add dev dependency
yarn add -D <package>

# remove package
yarn remove <package>

# upgrade package
yarn upgrade
```

---

## 🔑 Environment Setup

Create `.env` file:

```env
API_URL=https://api.example.com
```

---

## 📐 Coding Rules

### ✅ Do

* Use absolute imports (`@features/...`)
* Keep features isolated
* Use hooks for business logic

### ❌ Don't

* Call API directly in screens
* Mix business logic inside UI

---

## 🚀 Notes

* Use `yarn.lock` to ensure consistent dependencies
* Do NOT mix `npm` and `yarn`

---

## 📄 License

Private project
