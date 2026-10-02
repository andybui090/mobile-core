- Su dung react-native-bootsplash de tao splash screen
npx react-native-bootsplash generate src/assets/images/global/logo_transparent.png \
  --platforms=android,ios \
  --background=19A2A7 \
  --logo-width=150
  
- Cau hinh keystore cho android
 # Vector icons
 npx rnvi-update-plist package.json ios/Aloka/Info.plist

 npx react-native-asset