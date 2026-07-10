module.exports = {
  assets: ['./src/assets/fonts'],
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null, // disable autolink for iOS (bản RN cần cái này)
      },
    },
  },
};
