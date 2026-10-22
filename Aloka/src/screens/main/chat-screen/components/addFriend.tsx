import { images, screenStyles } from '@/configs';
import { CText, Row } from '@/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { Image, Platform, Pressable, View } from 'react-native';

const AddFriend = (props: any) => {
  const {
    listFriends,
    listFriendsWaiting,
    listFriendsInvited,
    item,
    handleResquestFriends,
  } = props;
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();
  const { t } = useTranslation();

  const findMatchingElements = (a: any) => {
    const result = a.some(
      (e: any) => e.friend_id === item.to || e.user_id === item.to,
    );
    return result;
  };

  return (
    <>
      {!findMatchingElements(listFriends) ? (
        <Pressable
          style={[styles.viewAddFriend, styles.shadow]}
          onPress={handleResquestFriends}
        >
          <Row start>
            <View style={{ width: '100%' }}>
              {!findMatchingElements(listFriendsWaiting) ? (
                <>
                  {findMatchingElements(listFriendsInvited) ? (
                    <Row between>
                      <CText numberOfLines={1} color={colors.black}>
                        {t('communityChat.chat.waittingAddfriend')}
                      </CText>
                      <View style={{marginRight:8}}>
                        <View
                          style={{
                            paddingHorizontal: 12,
                            backgroundColor: colors.cD0F0FF,
                            paddingVertical: 3,
                            borderRadius: 10,
                          }}
                        >
                          <CText numberOfLines={1} color={colors.primary}>
                            {t('communityChat.chat.waittingfriend')}
                          </CText>
                        </View>
                      </View>
                    </Row>
                  ) : (
                    <Row center>
                      <Image
                        source={images.community.icon_reqFriends}
                        style={screenStyles.box22}
                      />
                      <View style={{ paddingHorizontal: 8 }}>
                        <CText w500 numberOfLines={1} color={colors.c667085}>
                          {t('communityChat.chat.addfriend')}
                        </CText>
                      </View>
                    </Row>
                  )}
                </>
              ) : (
                <Row center>
                  <View style={{ paddingHorizontal: 8 }}>
                    <CText numberOfLines={1} color={colors.c667085}>
                      {t('communityChat.chat.friend')}
                    </CText>
                  </View>
                </Row>
              )}
            </View>
          </Row>
        </Pressable>
      ) : null}
    </>
  );
};

export default AddFriend;
const useStyles = makeStyles(({ colors }) => ({
  shadow: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#C4C4C4',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  viewAddFriend: {
    position: 'absolute' as const,
    zIndex: 100,
    height: 36,
    paddingStart: 8,
    justifyContent: 'center' as const,
    borderColor: colors.black,
  },
}));
