import { Text } from '@/components';

export const HASHTAG_NEWSFEED = (string: string, txtColor?: string) => {
    const handlePressHashTag = (txt: string) => {
        console.log("🚀 ~ handlePressHashTag ~ txt:", txt)
    }
    return string?.split(/((?:^|\s)(?:#[\p{L}a-z\d-]+))/giu).filter(Boolean).map((v, i) => {
        if (v.includes('#')) {
            return <Text h5 key={'#' + i} onPress={() => handlePressHashTag(v)} style={{ color: "#0080F6" }}>{v}</Text>;
        } else {
            return <Text h5 key={'@' + i} style={{ color: txtColor ?? "white" }}>{v}</Text>;
        }
    })
}