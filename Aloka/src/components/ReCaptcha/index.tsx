import { useCallback } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface ReCaptchaProps {
  onVerify: (data: any) => void;
}

const ReCaptcha = ({ onVerify }: ReCaptchaProps) => {
  
  const onMessage = useCallback(
    (data: any) => {
      onVerify(data.nativeEvent.data);
    },
    [onVerify],
  );

  return (
    <View>
      <WebView
        onMessage={(e: any) => onMessage(e)}
        containerStyle={{}}
        source={{
          html: `
            <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <script src="https://www.google.com/recaptcha/api.js?render=6LfmC_0mAAAAAO8Bszr3fS_teBDT9bQ5Au-8MGM6" async defer></script>
        <script>
        function onLoad(e) {
            grecaptcha.ready(function () {
                grecaptcha.execute('6LfmC_0mAAAAAO8Bszr3fS_teBDT9bQ5Au-8MGM6', {action: 'submit'}).then((token) => {
                    window.ReactNativeWebView.postMessage(token);
                });
            })
        }
        </script>
        </head>
        <body onload="onLoad()">
        </body>
        </html>`,
          baseUrl: 'https://staging.sso.doctornetwork.us',
        }}
      />
    </View>
  );
};

export default ReCaptcha;
