import { ImageHelper } from "@/components";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { screenStyles } from "./screenStyles";

export const showNotiLocal = (title: string, msg: string, onPress: any, imgUri: string) => {
    Toast.show(
        {
            type: 'info',
            text1: title,
            text2: msg,
            props: {
                onPress: onPress,
                renderLeading: () => <View style={{
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={screenStyles.round40R}>
                        <ImageHelper source={{ uri: imgUri }}
                        />
                    </View>
                </View>
            }
        }
    )
};