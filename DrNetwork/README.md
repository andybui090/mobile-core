# 📱 DrNetwork – React Native Mobile App

---

## 📌 Overview

DrNetwork là ứng dụng mobile được xây dựng bằng **React Native**, hỗ trợ **iOS** và **Android**.  
Project yêu cầu **môi trường được cấu hình đúng version**, đặc biệt là **Node.js**, để tránh lỗi build.

# Support: iphone, ipad iOS >= 15.1, android >= 7.0
---

## 📦 Environment

> ⚠️ BẮT BUỘC dùng đúng version bên dưới

### Core
- **Node.js**: `22.11.0`
- **nvm**: latest
- **React**: `19.2.3`
- **React Native**: `0.84.0`
- **Package Manager**: yarn / npm

### iOS
- **macOS**: latest
- **Xcode**: `26.2`
- **CocoaPods**: latest
- **Ruby**: system / rbenv

### Android
- **Java JDK**: `11` hoặc `17`
- **Android Studio**: latest
- **Android SDK**: API 33+
- **Gradle**: via wrapper (`gradlew`)
- **ADB**: từ Android SDK

---

## 🔐 Node Version Management (nvm)
Project sử dụng **nvm** để đảm bảo Node version đồng nhất.
### 1. Cài Node theo `.nvmrc`
nvm install
### 2. Vào project và dùng Node đúng version
nvm use

# Fix lỗi không tìm thấy npx khi chạy android studio
Trong Android Studio, Vào phần setting, Gradle JDK, chọn đúng
jbr-17	✅ BEST
openjdk-17	✅ OK
# Máy ảo nên tạo 
- Pixel 7a – daily dev
- Pixel 7 Pro – UI scale
- Pixel 5 – performance

# Structure
src/core/
├── app/
│   ├── bootstrap.ts
│   ├── providers.tsx
│   ├── errorBoundary.tsx
│   └── index.ts
│
├── config/
│   ├── env.ts
│   ├── build.ts
│   ├── constants.ts
│   ├── featureFlags.ts
│   └── index.ts
│
├── services/
│   ├── api/
│   │   ├── client.ts
│   │   ├── request.ts
│   │   ├── error.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── storage/
│   │   ├── storage.interface.ts
│   │   ├── mmkv.ts
│   │   ├── secure.ts
│   │   └── index.ts
│   │
│   ├── socket/
│   │   ├── socket.ts
│   │   └── index.ts
│   │
│   ├── permissions/
│   │   ├── permissions.ts
│   │   └── index.ts
│   │
│   ├── logger/
│   │   ├── logger.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── state/
│   ├── store.ts
│   ├── persist.ts
│   ├── hydration.ts
│   └── index.ts
│
├── navigation/
│   ├── root.tsx
│   ├── types.ts
│   └── index.ts
│
├── ui/
│   ├── theme/
│   │   ├── tokens.ts
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   │
│   ├── primitives/
│   │   ├── Text.tsx
│   │   ├── Box.tsx
│   │   ├── Spacer.tsx
│   │   └── index.ts
│   │
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── feedback/
│   │   ├── Loading.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts
│   │
│   └── index.ts
│
├── hooks/
│   ├── useAppState.ts
│   ├── useNetwork.ts
│   ├── useDebounce.ts
│   ├── useStableCallback.ts
│   └── index.ts
│
├── utils/
│   ├── device.ts
│   ├── platform.ts
│   ├── format.ts
│   ├── validation.ts
│   ├── performance.ts
│   └── index.ts
│
├── i18n/
│   ├── index.ts
│   └── resources.ts
│
└── index.ts

# Link assets: 
- npx react-native-asset --verbose

# Tip
iOS KHÔNG cập nhật Dynamic Type cho app đang chạy
👉 Phải kill app → mở lại thì PixelRatio.getFontScale() mới đổi