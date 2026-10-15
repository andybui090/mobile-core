import { CSearchBar, IconType, IconX } from '@/components';
import { keyExtractor, screenStyles } from '@/configs';
import { STORAGEKEY } from '@/constants';
import {
  getListSearchLocation,
  resetLocation,
} from '@/redux/slices/locationSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { getObjectData } from '@/storages';
import { CText, Row } from '@/utils';
import { Divider } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

const useStyles = makeStyles(({ colors }) => ({
  itemList: {
    flexDirection: 'row' as const,
    borderBottomColor: colors.cEAECF0,
    borderBottomWidth: 1,
    paddingVertical: 16,
    alignItems: 'center' as const,
    paddingRight: 10,
    marginHorizontal: 16,
  },
  txt: {
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end' as const,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },

  contentContainer: {
    width: '100%',
    height: '87%',
  },
}));

const ModalSearchLocation = ({
  modalVisibled,
  onClose,
  onChooseLocation,
}: any) => {
  const { t } = useTranslation();
  const searchEl = useRef<any>(null);
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  const dispatch = useAppDispatch();
  const { listSearchLocation } = useAppSelector(state => state.locationReducer);

  const [dataSearch, setDataSearch] = useState<any>([]);
  const [locationName, setLocationName] = useState('');

  const [listNearAddress, setListNearAddress] = useState<any>([]);

  useEffect(() => {
    const initData = async () => {
      // Loc theo item.text vi can lay lat long de so sanh vi tri
      const arrHis = (
        (await getObjectData(STORAGEKEY.ALOKA_ADDRESS_HISTORY)) || []
      ).filter((item: any) => {
        const text = item?.text?.trim();

        return typeof text === 'string' && text.length > 0;
      });
      setListNearAddress(arrHis);
    };
    initData();
  }, []);

  useEffect(() => {
    if (locationName.trim() != '') {
      console.log('locationName', locationName);
      const data = {
        input: locationName,
      };
      dispatch(getListSearchLocation(data));
    }
  }, [locationName]);

  useEffect(() => {
    const processAPIPlace = () => {
      const { loading, data, error } = listSearchLocation;
      console.log("🚀 ~ processAPIPlace ~ data:", data)
      if (!loading) {
        if (data) {
          setDataSearch(data.items || []);
          dispatch(resetLocation(null));
        } else if (error) {
          dispatch(resetLocation(null));
        }
      }
    };
    processAPIPlace();
  }, [listSearchLocation]);

  // Action
  const handleSubmitSearch = () => {
    Keyboard.dismiss();
  };

  const onChangeSearchText = (searchText: string) => {
    setLocationName(searchText);
  };

  const handleChooseLocation = (item: any) => {
    // Cho nay luu lai dia chi truoc do
    onChooseLocation(item);
  };

  const renderItemList = ({ item }: any) => {
    return (
      <Pressable
        style={styles.itemList}
        onPress={() => handleChooseLocation(item)}
      >
        <IconX
          type={IconType.OCTICONS}
          name={'location'}
          size={22}
          color={colors.c98A2B3}
        />
        <View style={styles.txt}>
          <CText h5 color={colors.c101828}>
            {item.text || ''}
          </CText>
        </View>
      </Pressable>
    );
  };

  const renderTextNearBy = () => {
    // Cho nay chuyen thanh dia chi da luu truoc do
    return (
      <>
        <Row start style={[screenStyles.pH16]}>
          <CText h5 color={colors.c101828} w500>
            {t('carely.nearby', 'Địa chỉ gần đây')}
          </CText>
        </Row>
        {listNearAddress.map((item: any, idx: any) => (
          <Pressable
            key={idx}
            style={styles.itemList}
            onPress={() => handleChooseLocation(item)}
          >
            <IconX
              type={IconType.OCTICONS}
              name={'location'}
              size={22}
              color={colors.c98A2B3}
            />
            <View style={styles.txt}>
              <CText h5 color={colors.c101828}>
                {item.text || ''}
              </CText>
            </View>
          </Pressable>
        ))}
      </>
    );
  };

  const renderContent = () => {
    return (
      <View style={screenStyles.wrapModalTop}>
        <Row between style={screenStyles.modalTopHeader}>
          <Pressable onPress={onClose}>
            <IconX
              name={'close'}
              type={IconType.ANT_DESIGN}
              color={colors.c667085}
              size={24}
            />
          </Pressable>
          <CText h4 w600 color={colors.c101828}>
            {t('nearbySearch.location', 'Location')}
          </CText>
          <View style={{ width: 24 }} />
        </Row>
        <Divider color={colors.cD0D5DD} width={1} />
        <View style={screenStyles.modalTopSearchBar}>
          <CSearchBar
            ref={searchEl}
            value={locationName}
            placeholder={t('nearbySearch.search')}
            onChangeText={onChangeSearchText}
            onClear={() => {
              // setLocationName('');
            }}
            returnKeyType="search"
            onSubmitEditing={handleSubmitSearch}
            autoFocus
          />
        </View>
        {listNearAddress.length > 0 && locationName == '' ? (
          renderTextNearBy()
        ) : (
          <FlatList
            contentContainerStyle={screenStyles.flexGrowBottom}
            data={dataSearch}
            extraData={dataSearch}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            renderItem={renderItemList}
            scrollEventThrottle={160}
            keyboardDismissMode="on-drag"
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={modalVisibled}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <View style={styles.backdrop} />
        </Pressable>
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>
    </Modal>
  );
};

export default ModalSearchLocation;
