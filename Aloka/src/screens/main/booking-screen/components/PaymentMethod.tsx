import {
    IconType,
    IconX
} from '@/components';
import { screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { useTheme } from '@rneui/themed';
import React from 'react';
import { Pressable, View } from 'react-native';


type PaymentMethod = {
    title: string;
    isChoose: boolean;
    onPress: () => void;
    renderImage: () => React.ReactNode;
};


const PaymentMethod = ({ title, isChoose, renderImage, onPress }: PaymentMethod) => {
    const {
        theme: { colors },
    } = useTheme();
    return (
        <Pressable onPress={onPress} style={[screenStyles.pV12, 
            screenStyles.bottomLine, 
            screenStyles.rowStart]}>
            <Row start style={[screenStyles.flex1, { alignItems: 'center' }]}>
                <View style={{ width: 40, alignItems: 'center' }}>
                    {renderImage()}
                </View>
                <CText
                    style={screenStyles.mL10}
                    color={colors.c33353A}
                    h5
                    w400
                    numberOfLines={1}
                >
                    {title}
                </CText>
            </Row>
            <View>
                {isChoose ? (
                    <IconX name="radio-btn-active" size={20} type={IconType.FONTISTO} color={colors.c19A2A7} />
                ) : (
                    <IconX name="circle" size={20} type={IconType.ENTYPO} color={colors.c98A2B3} />
                )}
            </View>
        </Pressable>
    )
}

export default PaymentMethod;