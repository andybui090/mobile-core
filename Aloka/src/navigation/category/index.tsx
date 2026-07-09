// import {
//   CHeader,
//   CSearchBar,
//   ICON_TYPE,
//   IconX,
//   ImageHelper,
//   ModalLanguage,
//   Wrapper,
// } from '@/components';
// import {
//   GAEvents,
//   GALogEvent,
//   ScreenWidth,
//   changeAlias,
//   getBottomSpace,
//   ifIphoneX,
//   isIOS,
//   keyExtractor,
//   replaceOverSpace,
//   screenStyles,
// } from '@/configs';
// import {STORAGEKEY} from '@/constants';
// import {AppContext} from '@/contexts/AppContext';
// import useI18n from '@/hooks/useI18n';
// import {getCategories, getLanguages} from '@/redux/slices/globalSlice';
// import {getSettingsOnboarding} from '@/redux/slices/settingSlice';
// import {useAppDispatch, useAppSelector} from '@/redux/store/customReduxHook';
// import {removeValue, storeObjectData, storeStringData} from '@/storages';
// import {CButton, CEmptyData, CEmptySearch, CLoading, CText, Row} from '@/utils';
// import {Divider} from '@rneui/base';
// import {makeStyles, useTheme} from '@rneui/themed';
// import {useContext, useEffect, useState} from 'react';
// import {useTranslation} from 'react-i18next';
// import {FlatList, TouchableOpacity, UIManager, View} from 'react-native';
// import Item from './Item';

// const useStyles = makeStyles(({colors}) => ({
//   rightWrapper: {
//     right: 16,
//     position: 'absolute',
//     ...screenStyles.rowCenter,
//   },
//   countryWrap: {
//     backgroundColor: colors.cF9FAFB,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     ...screenStyles.rowCenter,
//   },
//   countryEnsign: {
//     ...screenStyles.box20,
//     ...screenStyles.centerWrap,
//   },
//   wrapSearch: {
//     paddingHorizontal: 20,
//     marginTop: 10,
//   },
//   btnWrapper: {
//     ...screenStyles.pH20,
//     width: ScreenWidth,
//     paddingBottom: getBottomSpace() + ifIphoneX(-8, 12),
//     paddingTop: 12,
//   },
// }));

// export default function CategoryApp() {
//   const {t} = useTranslation();
//   const styles = useStyles();
//   const {
//     theme: {colors},
//   } = useTheme();
//   const {lang, setLang} = useI18n();
//   //State & Props
//   const dispatch = useAppDispatch();
//   const {categoryList, languageList} = useAppSelector(
//     state => state.globalReducer,
//   );

//   const {settingOnboarding} = useAppSelector(state => state.settingReducer);

//   const {closeCategory} = useContext(AppContext);

//   const [listCategory, setListCategory] = useState<any>([]);
//   const [searchValue, setSearchValue] = useState<string>('');
//   const [listItemChoose, setListItemChoose] = useState<any>([]);
//   const [isActiveAction, setIsActiveAction] = useState(false);

//   const [firstRender, setFirstRender] = useState<boolean>(true);

//   const [language, setLanguage] = useState({
//     flag: 'https://flagsapi.com/GB/flat/64.png',
//     id: 31,
//     lang: 'en',
//     locale: 'English',
//   });

//   const [showModalLanguage, setShowModalLanguage] = useState<boolean>(false);

//   const [minSelect, setMinSelect] = useState<number>(0);

//   useEffect(() => {
//     dispatch(getSettingsOnboarding({fq: 'type:onboard'}));
//   }, []);

//   useEffect(() => {
//     const processSettingsOnboardingAPI = () => {
//       const {loading, data, error} = settingOnboarding;
//       if (!loading) {
//         if (data) {
//           if (data?.items) {
//             for (let i = 0; i < data.items.length; i++) {
//               if (data.items[i].code === 'required_interest') {
//                 setMinSelect(data.items[i].value ? data.items[i].value : 0);
//                 break;
//               }
//             }
//           }
//         } else if (error) {
//         }
//       }
//     };
//     processSettingsOnboardingAPI();
//   }, [settingOnboarding]);

//   useEffect(() => {
//     const initLanguageDefault = () => {
//       const {loading, data, error} = languageList;
//       if (!loading) {
//         if (data) {
//           if (data.items) {
//             for (let i = 0; i < data.items.length; i++) {
//               if (data.items[i].lang === lang) {
//                 setLanguage(data.items[i]);
//                 break;
//               }
//             }
//           }
//         } else if (error) {
//         }
//       }
//     };
//     initLanguageDefault();
//   }, [languageList, lang]);

//   useEffect(() => {
//     setIsActiveAction(listItemChoose.length >= minSelect);
//   }, [listItemChoose, minSelect]);

//   useEffect(() => {
//     if (isIOS) {
//       if (UIManager.setLayoutAnimationEnabledExperimental) {
//         UIManager.setLayoutAnimationEnabledExperimental(true);
//       }
//     }
//     dispatch(getCategories(null));
//     dispatch(
//       getLanguages({
//         fq: `status:1`,
//       }),
//     );
//   }, []);

//   useEffect(() => {
//     const processCategoryAPI = () => {
//       const {loading, data, error} = categoryList;
//       if (!loading) {
//         if (data) {
//           setFirstRender(false);
//           setListCategory(data?.items || []);
//         } else if (error) {
//           setFirstRender(false);
//         }
//       }
//     };
//     processCategoryAPI();
//   }, [categoryList]);

//   //ACTION
//   const onChangeTextSearch = (value: string) => {
//     let removeSpace = replaceOverSpace(value);
//     if (removeSpace !== '') {
//       const textData = changeAlias(removeSpace);
//       let arr = [];
//       let defaultData = categoryList.data?.items || [];
//       for (let i = 0; i < defaultData.length; i++) {
//         const itemData = defaultData[i].children;
//         let obj = {...defaultData[i]};
//         let arrChild = [];
//         let found = false;
//         for (let j = 0; j < itemData.length; j++) {
//           const itemChild = changeAlias(itemData[j].name);
//           if (itemChild.indexOf(textData) > -1) {
//             arrChild.push(itemData[j]);
//             found = true;
//           }
//         }
//         if (found) {
//           obj.children = arrChild;
//           arr.push(obj);
//         }
//       }
//       setListCategory(arr);
//       setSearchValue(removeSpace);
//     } else {
//       setListCategory(categoryList.data?.items || []);
//       setSearchValue(removeSpace);
//     }
//   };

//   const handleChooseItem = (item: any) => {
//     let arr = [...listItemChoose];
//     let found = false;
//     for (let i = 0; i < listItemChoose.length; i++) {
//       if (item.id === listItemChoose[i].id) {
//         arr.splice(i, 1);
//         found = true;
//         break;
//       }
//     }
//     if (!found) {
//       arr.push(item);
//     }
//     setListItemChoose(arr);
//   };

//   const storeLocalInterest = async () => {
//     // console.log('========== ', listItemChoose);
//     let str = '';
//     //sap xep theo thu tu alpha B
//     let arrSortAZ = [];
//     arrSortAZ = listItemChoose.sort(function (a: any, b: any) {
//       var textA = a.name.toUpperCase();
//       var textB = b.name.toUpperCase();
//       return textA < textB ? -1 : textA > textB ? 1 : 0;
//     });
//     // console.log('========== ', arrSortAZ);
//     for (let i = 0; i < arrSortAZ.length; i++) {
//       if (i == 0) {
//         str = arrSortAZ[i].id.toString();
//       } else {
//         str = str + ',' + arrSortAZ[i].id;
//       }
//     }
//     await storeStringData(STORAGEKEY.CATEGORIES, str);
//     let obj: any = {
//       categoryStore: arrSortAZ,
//     };
//     await storeObjectData(STORAGEKEY.CATEGORIES_CHOOSE, obj);
//   };

//   const handleDiscovery = async () => {
//     // // Read Clipboard o day
//     // const text = await Clipboard.getString();
//     // console.log("🚀 ~ handleDiscovery ~ text:", text)
//     await storeLocalInterest();
//     closeCategory();
//   };

//   const handleSkip = async () => {
//     GALogEvent(GAEvents.INTEREST_SELECTION_SKIPPED, {
//       method: 'App interest selection skipped',
//     });
//     await removeValue(STORAGEKEY.CATEGORIES);
//     await removeValue(STORAGEKEY.CATEGORIES_CHOOSE);
//     closeCategory();
//   };

//   const handleClearSearch = () => {
//     setSearchValue('');
//     setListCategory(categoryList.data?.items || []);
//   };

//   const handleChangeLanguage = () => {
//     setShowModalLanguage(true);
//   };

//   const handleChooseLanguage = (languageChange: any) => {
//     setShowModalLanguage(false);
//     if (languageChange.lang && languageChange.lang != lang) {
//       setLanguage(languageChange);
//       setLang(languageChange?.lang || lang);
//       setFirstRender(true);
//       setSearchValue('');
//       setTimeout(() => {
//         dispatch(getCategories(null));
//       }, 500);
//     }
//   };

//   //RENDER
//   const renderItemList = ({item}: any) => {
//     return (
//       <Item
//         item={item}
//         onPressItem={handleChooseItem}
//         listItemChoose={listItemChoose}
//       />
//     );
//   };

//   const renderListEmpty = () => {
//     if (searchValue != '') {
//       <CEmptySearch />;
//     }
//     return <CEmptyData />;
//   };

//   const renderListCategory = () => {
//     return (
//       <FlatList
//         contentContainerStyle={screenStyles.flexGrow1}
//         data={listCategory}
//         extraData={listCategory}
//         keyExtractor={keyExtractor}
//         renderItem={renderItemList}
//         showsVerticalScrollIndicator={false}
//         scrollEventThrottle={160}
//         ListEmptyComponent={renderListEmpty}
//         keyboardDismissMode="on-drag"
//         scrollsToTop={false}
//       />
//     );
//   };

//   const renderData = () => {
//     if (categoryList.loading || firstRender) {
//       return <CLoading />;
//     }
//     return renderListCategory();
//   };

//   const renderBtnAction = () => {
//     if (minSelect == 0) {
//       return (
//         <Row between style={styles.btnWrapper}>
//           <CButton
//             style={screenStyles.flex1}
//             backgroundColor={colors.cF2F4F7}
//             titleColor={colors.c344054}
//             title={t('tutorial.skip', 'Skip')}
//             onPress={handleSkip}
//             btnWidth={'90%'}
//             paddingVertical={14}
//           />
//           <CButton
//             style={screenStyles.flex1}
//             title={t('common.continue', 'Continue')}
//             isDisable={!isActiveAction}
//             onPress={handleDiscovery}
//             btnWidth={'90%'}
//             paddingVertical={14}
//           />
//         </Row>
//       );
//     }
//     return (
//       <Row between style={styles.btnWrapper}>
//         <CButton
//           style={screenStyles.flex1}
//           title={t('common.continue', 'Continue')}
//           isDisable={!isActiveAction}
//           onPress={handleDiscovery}
//           btnWidth={'100%'}
//           paddingVertical={14}
//         />
//       </Row>
//     );
//   };

//   const renderRightHead = () => (
//     <View style={styles.rightWrapper}>
//       <TouchableOpacity
//         style={[styles.countryWrap, screenStyles.colCenter]}
//         onPress={handleChangeLanguage}>
//         <View style={styles.countryEnsign}>
//           <ImageHelper source={{uri: language.flag}} resizeMode={'contain'} />
//         </View>
//         <CText h6 style={screenStyles.mH8} w500 color={colors.c1D2939}>
//           {language.lang?.toUpperCase() || ''}
//         </CText>
//         <IconX
//           origin={ICON_TYPE.FONTISTO}
//           name={'angle-down'}
//           size={12}
//           color={colors.c98A2B3}
//         />
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <Wrapper>
//       <CHeader rightComponent={renderRightHead()} leftComponentDisable />
//       <View style={screenStyles.pH20}>
//         <CText h2 w600 color={colors.c101828}>
//           {t(
//             'onboarding.SelectCategoriesOfInterest',
//             'Select categories of interest',
//           )}
//         </CText>
//         <CText h5 w400 color={colors.c667085} style={screenStyles.mT5}>
//           {`${t(
//             'common.selectContent',
//             'Please select content to receive relevant recommendations',
//           )}`}
//         </CText>
//       </View>
//       <View style={styles.wrapSearch}>
//         <CSearchBar
//           value={searchValue}
//           placeholder={t('search.searchPlaceholder', 'Search...')}
//           onChangeText={onChangeTextSearch}
//           onClear={handleClearSearch}
//           returnKeyType="search"
//         />
//       </View>
//       <Divider style={screenStyles.pV8} color={colors.cEAECF0} width={1} />
//       {renderData()}
//       {renderBtnAction()}
//       {showModalLanguage && (
//         <ModalLanguage
//           isVisible={showModalLanguage}
//           hideModal={() => setShowModalLanguage(false)}
//           chooseLanguage={handleChooseLanguage}
//           languageChoose={language}
//         />
//       )}
//     </Wrapper>
//   );
// }
