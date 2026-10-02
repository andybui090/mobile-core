import { CHeader, Wrapper } from '@/components';
import {
  // GAEvents,
  // GALogEvent,
  isIOS,
  keyExtractor,
  screenStyles,
} from '@/configs';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CButton, CEmptyData, CLoading } from '@/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, UIManager } from 'react-native';
import Item from './Item';
import { getMedicalTypes } from '@/redux/slices/onboardSlice';

export const Onboard = ({
  goBack,
  gotoUpdateBasicInfo,
  gotoUpdateNurseInfo,
  // gotoUpdateDoctorInfo,
  // gotoUpdateStudentInfo,
  // gotoUpdateKolKocInfo,
}: any) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const { dataMedicalTypes } = useAppSelector(state => state.onboardReducer);

  const [listMediatypes, setListMediatypes] = useState<any>([]);

  const [itemChoose, setItemChoose] = useState({
    id: -1,
    code: '',
    parent: { code: 'Normal' },
  });

  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (isIOS) {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
    dispatch(getMedicalTypes(null));
  }, []);

  useEffect(() => {
    const processAPIMediatypes = () => {
      const { loading, data, error } = dataMedicalTypes;
      if (!loading) {
        if (data) {
          // setListMediatypes(data.items || []);
          // console.log('🚀 ~ processAPIMediatypes ~ data:', data);

          //Filter lai chi lay user va dieu duong
          const allowedCodes = ['user', 'nurse'];
          const items = data.items.map(item => ({
            ...item,
            children: (item.children ?? []).filter((child: any) =>
              allowedCodes.includes(child.code.toLowerCase()),
            ),
          }));
          console.log('🚀 ~ processAPIMediatypes ~ data:', items);
          setListMediatypes(items || []);

          setFirstRender(false);
        } else if (error) {
          setFirstRender(false);
        }
      }
    };
    processAPIMediatypes();
  }, [dataMedicalTypes]);

  //ACTION
  const handlePressItem = (item: any, parentRef: any) => {
    setItemChoose({
      ...item,
      parent: parentRef,
    });
  };

  const handleRegister = () => {
    if (itemChoose.parent?.code.toLocaleLowerCase() === 'normal') {
      if (itemChoose.code?.toLocaleLowerCase() == 'user') {
        gotoUpdateBasicInfo(itemChoose);
      }
    } else if (itemChoose.parent?.code?.toLocaleLowerCase() === 'expert') {
      if (itemChoose.code?.toLocaleLowerCase() == 'nurse') {
        gotoUpdateNurseInfo(itemChoose);
      }
    } else {
      console.log('CAN NOT GET USER TYPE');
    }
    // if (itemChoose.parent?.code.toLocaleLowerCase() === 'normal') {
    //   if (itemChoose.code?.toLocaleLowerCase() == 'user') {
    //     gotoUpdateBasicInfo(itemChoose);
    //   } else if (itemChoose.code?.toLocaleLowerCase() == 'student') {
    //     gotoUpdateStudentInfo(itemChoose);
    //   }
    // } else if (itemChoose.parent?.code?.toLocaleLowerCase() === 'expert') {
    //   if (itemChoose.code?.toLocaleLowerCase() == 'doctor') {
    //     gotoUpdateDoctorInfo(itemChoose);
    //   } else if (itemChoose.code?.toLocaleLowerCase() == 'nurse') {
    //     gotoUpdateNurseInfo(itemChoose);
    //   } else if (itemChoose.code?.toLocaleLowerCase() == 'expert_other') {
    //     gotoUpdateKolKocInfo(itemChoose);
    //   }
    // } else {
    //   console.log('CAN NOT GET USER TYPE');
    // }
  };

  //RENDER
  const renderItemList = ({ item }: any) => {
    return (
      <Item item={item} onPressItem={handlePressItem} itemChoose={itemChoose} />
    );
  };

  const renderContent = () => {
    if (firstRender) {
      return <CLoading />;
    } else {
      return (
        <FlatList
          contentContainerStyle={screenStyles.flexGrow1}
          data={listMediatypes}
          extraData={listMediatypes}
          keyExtractor={keyExtractor}
          renderItem={renderItemList}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={160}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<CEmptyData />}
          scrollsToTop={false}
        />
      );
    }
  };

  return (
    <Wrapper>
      <CHeader
        rightComponentDisable
        leftComponentOnPress={goBack}
        isBorderBottom
        title={t('onboarding.selectUserType')}
      />
      {renderContent()}
      <CButton
        isBottom
        title={t('common.continue')}
        isDisable={itemChoose.id == -1}
        onPress={handleRegister}
      />
    </Wrapper>
  );
};
