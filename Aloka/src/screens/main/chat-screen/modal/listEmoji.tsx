import { ImageHelper } from '@/components';
import {
  getBottomSpace,
  ifIphoneX,
  images,
  keyExtractor,
  screenStyles,
} from '@/configs';
import { convertData, convertMemberLikeInfo } from '@/functions/community';
import { useAppSelector } from '@/redux/store/customReduxHook';
import { CText, Row } from '@/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Divider, makeStyles, useTheme } from '@rneui/themed';
import { type IWaveformRef } from '@simform_solutions/react-native-audio-waveform';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, ScrollView, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const useStyles = makeStyles(({ colors }) => ({
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cEAECF0,
  },
  pulseWrapper: {
    width: 50,
    height: 10,
    top: 17,
    left: 23,
    position: 'absolute',
    zIndex: -1,
  },
  avatar36: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: colors.cF2F4F7,
    backgroundColor: colors.cEAECF0,
  },
}));

export const BottomSheetListEmojji = ({
  bottomSheetRef,
  listViewEmoji,
  listLikeEmoji,
  listTotalMember,
}: any) => {
  const ref = useRef<IWaveformRef>(null);
  const { t } = useTranslation();
  const { likeEmoji, recallEmoji } = useAppSelector(
    state => state.socketioReducer,
  );

  // const DELAY_TIME = 0

  const [snapPoints, setSnapPoints] = useState([390, 390]);
  const [checkTab, setCheckTab] = useState<boolean>(true);
  const [checkShowItem, setCheckShowItem] = useState<boolean>(false);

  const [tabIdEmoji, setTabIdEmoji] = useState<any>('');

  const {
    theme: { colors },
  } = useTheme();

  const styles = useStyles();
  let listResult = convertData(listViewEmoji);
  let listFinalEmoji = convertMemberLikeInfo(listResult, listTotalMember);

  useEffect(() => {
    const checkPermission = async () => {
      listResult = convertData(listViewEmoji);
      listFinalEmoji = convertMemberLikeInfo(listResult, listTotalMember);
    };
    checkPermission();
  }, [likeEmoji, recallEmoji]);

  const groundEmoji = (arr: any) => {
    const grouped: any = {};
    arr.forEach((item: any) => {
      const key = `${item.emoji_id}-${item.message_id}-${item.user_id}`;
      if (!grouped[key]) {
        grouped[key] = { ...item, number_emoji: 0 };
      }
      grouped[key].number_emoji += 1;
    });
    return Object.values(grouped);
  };

  const converntEmoji = (id: any) => {
    let arr = [...listLikeEmoji];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id.emoji_id) {
        return arr[i].icon;
      }
    }
    // setMessages(arr);
  };

  const convernt = (uniqueArray: any) => {
    uniqueArray = listViewEmoji.filter(
      (item: any, index: any, self: any) =>
        index ===
        self.findIndex(
          (t: any) =>
            t.emoji_id === item.emoji_id && t.message_id === item.message_id,
        ),
    );
    return uniqueArray;
    // setMessages(arr);
  };

  const result = Object.values(
    listViewEmoji.reduce((acc: any, { emoji_id, message_id }: any) => {
      const key = `${emoji_id}`; // Unique key based on emoji_id and user_id
      if (!acc[key]) {
        acc[key] = { emoji_id, total: 0, message_id };
      }
      acc[key].total += 1;
      return acc;
    }, {}),
  );

  // function checkEmojiId(input: any) {
  //     return a.;
  //   }

  const renderErrorImage = () => {
    return (
      <Image
        source={images.global.no_avatar}
        style={screenStyles.box20}
        resizeMode="contain"
      />
    );
  };

  const _renderEmojiV2 = (item: any, index: any) => {
    return (
      <View key={index}>
        {item.emoji_id === tabIdEmoji.emoji_id ? (
          <View style={{ paddingVertical: 5, paddingHorizontal: 2 }}>
            {item.user_id === tabIdEmoji.user_id ? (
              <Row>
                <View style={screenStyles.box18}>
                  <FastImage
                    source={{ uri: converntEmoji(item) }}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ marginLeft: 5 }}>
                  {/* <CText h5 color={'#84CAFF'}>{item.number_emoji}</CText> */}
                </View>
              </Row>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  };

  const _renderEmoji = (item: any, index: any) => {
    return (
      <View key={index}>
        {checkTab == true ? (
          <View style={{ marginLeft: 5, paddingVertical: 5 }}>
            <View style={screenStyles.box18}>
              <FastImage
                source={{ uri: converntEmoji(item) }}
                resizeMode="contain"
              />
            </View>
          </View>
        ) : item.emoji_id === tabIdEmoji.emoji_id ? (
          <Row style={{ paddingVertical: 5, paddingHorizontal: 8 }}>
            <View style={screenStyles.box18}>
              <FastImage
                source={{ uri: converntEmoji(item) }}
                resizeMode="contain"
              />
            </View>
            <View style={{ marginLeft: 5 }}>
              <CText h5 color={'#84CAFF'}>
                {item.number}
              </CText>
            </View>
          </Row>
        ) : null}
      </View>
    );
  };

  const _renderTabIcon = (item: any, index: any) => {
    return (
      <Pressable
        key={index}
        onPress={() => {
          setCheckTab(false);
          setTabIdEmoji(item);
        }}
      >
        <View style={{ width: 80, paddingHorizontal: 17 }}>
          <Row center>
            <View style={screenStyles.box18}>
              <FastImage
                // style={screenStyles.box18}
                source={{ uri: converntEmoji(item) }}
                resizeMode="contain"
              />
            </View>

            <CText h4 color={colors.primary}>{` ${item.total}`}</CText>
          </Row>
        </View>
      </Pressable>
    );
  };
  const _renderNumberLike = (item: any, index: any) => {
    return (
      <View key={index}>
        <Row
          start
          // onLayout={e => onLayoutLike(e, item)}
        >
          {checkTab === true ? (
            <View style={screenStyles.pV12}>
              <View style={styles.avatar36}>
                <ImageHelper
                  source={{ uri: item.avatar }}
                  renderErrorImage={renderErrorImage}
                />
              </View>
            </View>
          ) : item.listEmoij.some(
              (item: any) => item.emoji_id === tabIdEmoji.emoji_id,
            ) ? (
            <View style={screenStyles.pV12}>
              <View style={styles.avatar36}>
                <ImageHelper
                  source={{ uri: item.avatar }}
                  renderErrorImage={renderErrorImage}
                />
              </View>
            </View>
          ) : null}

          <View style={screenStyles.pH12}>
            {checkTab === true ? (
              <View style={{ marginLeft: 5 }}>
                <CText h5 color={colors.primary}>
                  {item.full_name || t('comment.user.deleted')}
                </CText>
              </View>
            ) : item.listEmoij.some(
                (item: any) => item.emoji_id === tabIdEmoji.emoji_id,
              ) > 0 ? (
              <View style={{ marginLeft: 5 }}>
                <CText h5 color={colors.primary}>
                  {item.full_name || t('comment.user.deleted')}
                </CText>
              </View>
            ) : null}

            <Row start>
              {item.listEmoij.map((item: any, index: any) =>
                _renderEmoji(item, index),
              )}
              {checkTab === true ? (
                <View style={{ marginLeft: 5 }}>
                  <CText h5 color={'#84CAFF'}>
                    {item.numberEmoji}
                  </CText>
                </View>
              ) : null}
            </Row>
          </View>
        </Row>
      </View>
    );
  };

  return (
    <BottomSheetModal
      onDismiss={() => {
        bottomSheetRef.current?.close();
      }}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      //   onChange={onActionChange}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: colors.cD0D5DD,
      }}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          onPress={() => {
            bottomSheetRef.current?.close();
            setCheckTab(true);
            setTabIdEmoji('');
          }}
          appearsOnIndex={1}
        />
      )}
    >
      <BottomSheetView
        style={{
          // paddingHorizontal: 20,
          paddingBottom: getBottomSpace() + ifIphoneX(-15, 0),
        }}
      >
        <Row center style={{ paddingHorizontal: 10 }}>
          <Pressable onPress={() => setCheckTab(true)}>
            <CText h4 color={colors.primary}>{`${t(
              'communityChat.modalEmoji.all',
            )} ${listViewEmoji.length}`}</CText>
          </Pressable>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Row>
              {result.map((item: any, index: any) =>
                _renderTabIcon(item, index),
              )}
            </Row>
          </ScrollView>
        </Row>
        <View style={{ paddingVertical: 10 }}>
          <Divider color={'#84CAFF'} />
        </View>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          {listFinalEmoji.map((item: any, index: any) =>
            _renderNumberLike(item, index),
          )}
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
