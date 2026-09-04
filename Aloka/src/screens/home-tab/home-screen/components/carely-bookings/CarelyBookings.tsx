import { ImageHelper } from "@/components";
import { images, isIOS, keyExtractor, screenStyles, ScreenWidth } from "@/configs";
import { AppContext } from "@/contexts";
import i18n from "@/i18n";
import { CText, Row } from "@/utils";
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { BookingLoading } from "./BookingLoading";
import moment from "moment";

const formatISOToVietnameseDate = (isoString?: string, _lang = 'vi', _t?: any) => {
    if (!isoString) return '';
    return moment(isoString).format('DD/MM/YYYY');
};

const formatTimeRangeWithDurationFromISO = (isoString?: string, duration = 0) => {
    if (!isoString) return '';
    const start = moment(isoString).format('HH:mm');
    const end = moment(isoString).add(duration, 'minutes').format('HH:mm');
    return `${start} - ${end}`;
};

const useStyles = makeStyles(({ colors }) =>
    StyleSheet.create({
        page1TopWrap: {
            borderRadius: 16,
            borderColor: colors.cEAECF0,
            borderWidth: 1,
            overflow: 'hidden',
            marginRight: 16,
            width: ScreenWidth - 80,
            backgroundColor: colors.cF9FAFB,
        },
        topWrap: {
            paddingHorizontal: 12,
            paddingVertical: 10,
        },
        thumn: {
            width: 60,
            height: 60,
            borderRadius: 8,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.cEAECF0,
        },
    })
);

const CarelyBookings = (props: any) => {
    const {
        theme: { colors },
    } = useTheme();
    const styles = useStyles();
    const { t } = useTranslation();

    const flatRef = useRef<any>(null);
    const { user } = useContext(AppContext);

    const { loading, listData, onLoadMore, finalLoad, onEndReached, setOnEndReached, onPressItem } = props;
    const renderErrorImage = () => {
        return <Image source={(images.bottomTab as any)?.carely || images.common.img_default} style={screenStyles.box30} resizeMode="contain" />;
    };

    const renderItem = ({ item, index }: any) => {
        // console.log("🚀 ~ renderItem ~ item:", item);
        const { doctor, date, doctor_id, user: userBooking, id, note, type, package: packageInfo, duration, address } = item;
        const isViewByDoctor = doctor_id == user.id;
        const dateShow = formatISOToVietnameseDate(date, i18n.language === 'vi' ? 'vi' : 'en', t);
        const timeShow1 = formatTimeRangeWithDurationFromISO(date, duration || 0) || '';
        return (
            <Pressable onPress={onPressItem} style={styles.page1TopWrap}>
                <View style={styles.topWrap}>
                    <Row start style={[{ alignItems: "flex-start" }]}>
                        <View style={styles.thumn}>
                            <ImageHelper source={{ uri: packageInfo?.thumbnail || '' }} renderErrorImage={renderErrorImage} resizeMode={'cover'} />
                        </View>
                        <View style={screenStyles.mL10}>
                            {packageInfo?.name?.toString().trim() && <CText h4 w500 color={colors.c1D2939}>
                                {packageInfo?.name?.toString().trim()}
                            </CText>}
                            <CText h5 color={colors.c98A2B3} style={[{ marginTop: 2, flexShrink: 1 }]} numberOfLines={1}>
                                {isViewByDoctor
                                    ? userBooking.full_name || ""
                                    : doctor.full_name || ""}
                            </CText>
                            <CText h5 color={colors.c1D2939} style={[{ marginTop: 2, flexShrink: 1 }]} numberOfLines={1}>
                                {dateShow}
                            </CText>
                            <CText h5 color={colors.c1D2939} style={[{ marginTop: 2, flexShrink: 1 }]} numberOfLines={1}>
                                {timeShow1}
                            </CText>
                        </View>
                    </Row>
                </View>
            </Pressable>
        );
    }

    const _renderSearchResultsFooter = () => {
        return !finalLoad && !onEndReached ? (
            <View style={[screenStyles.centerWrap, { height: 100 }]}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        ) : null;
    };

    const renderList = () => {
        if (loading) {
            return <BookingLoading />
        } return (
            <View style={screenStyles.mT12}>
                <FlatList
                    ref={flatRef}
                    contentContainerStyle={[screenStyles.flexGrow1]}
                    data={listData}
                    extraData={listData}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={isIOS ? 160 : 16}
                    scrollsToTop={false}
                    ListEmptyComponent={<Row style={[screenStyles.pH14]}>
                        <CText h5 w500 center color={colors.c667085}>
                            {t('common.noDataAvailable', 'No data available')}
                        </CText>
                    </Row>}
                    ListFooterComponent={_renderSearchResultsFooter}
                    onMomentumScrollBegin={() => setOnEndReached(false)}
                    onEndReached={onLoadMore}
                />
                {/* <Divider color={colors.cF9FAFB} width={7} /> */}
            </View>
        );
    };

    return (
        <View style={[screenStyles.pH14, screenStyles.pV12]}>
            <CText h46 w600 color={colors.c101828}>
                {t('profile.appoints', 'Lịch hẹn')}
            </CText>
            {renderList()}
        </View>
    )
}

export default CarelyBookings;