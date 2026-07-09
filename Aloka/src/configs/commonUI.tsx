import { ImageHelper } from "@/components";
import { mainRoute } from "@/constants/route_key";
import { navigate2 } from "@/navigation/RootNavigation";
import { CText } from "@/utils";
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

export const HASHTAG_FORMATTER = (string: string, txtColor?: string) => {
    const handlePressHashTag = (txt: string) => {
        navigate2(mainRoute.searchScreen, { hashTag: txt });
    }
    return string?.split(/((?:^|\s)(?:#[a-z\d-]+))/gi).filter(Boolean).map((v, i) => {
        if (v.includes('#')) {
            return <CText h5 key={'#' + i} onPress={() => handlePressHashTag(v)} style={{ color: '#399bf6' }}>{v}</CText>;
        } else {
            return <CText h5 key={'@' + i} style={{ color: txtColor ?? "white" }}>{v}</CText>;
        }
    })
}

export const HASHTAG_NEWSFEED = (string: string, txtColor?:string) => {
    const handlePressHashTag = (txt: string) => {
        console.log("🚀 ~ handlePressHashTag ~ txt:", txt)
    }
    return string?.split(/((?:^|\s)(?:#[\p{L}a-z\d-]+))/giu).filter(Boolean).map((v, i) => {
        if (v.includes('#')) {
            return <CText h5 key={'#' + i} onPress={() => handlePressHashTag(v)} style={{ color: "#0080F6" }}>{v}</CText>;
        } else {
            return <CText h5 key={'@' + i} style={{ color: txtColor ?? "white" }}>{v}</CText>;
        }
    })
}