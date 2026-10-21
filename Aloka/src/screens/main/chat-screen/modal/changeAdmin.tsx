import { APILoading, CSearchBar, ICON_TYPE, IconX, ImageHelper } from '@/components';
import { changeAlias, images, keyExtractor, screenStyles } from '@/configs';
import { PAGINATION } from '@/constants';
import { getListFriends, getListMemberGroup } from '@/redux/slices/communitySlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/customReduxHook';
import { CEmptyData, CLoading, CText, Row } from '@/utils';
import { Divider, ScreenWidth } from '@rneui/base';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, View } from 'react-native';
import Modal from 'react-native-modal';

export const ModalChangeAdmin = ({ isVisible, hideModal, itemRoomId, handleAdminLeave }: any) => {
    //a5e01b34-bf52-498f-8830-5fee6a3d0cff
    const {
        theme: { colors },
    } = useTheme();
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const { listMemberGroup } = useAppSelector(state => state.communityReducer);
    const [listMember, setListMember] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [firstRender, setFirstRender] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState(false);
    const [finalLoad, setFinalLoad] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);

    const [selectedUserId, setSelectedUserId] = useState<any>({});
    const [searchValue, setSearchValue] = useState<string>('');

    const getListMemberApi = () => {
        const data = {};
        dispatch(
            getListMemberGroup({
                id: itemRoomId,
                data: data,
            }),
        );
      };
    
    useEffect(() => {
        getListMemberApi()
    }, []);

    useEffect(() => {
        const processAPIListRoom = () => {
            const { loading, data, error } = listMemberGroup;
            if (!loading) {
                if (data) {
                    if (data && data.items) {
                        let newItems = data.items || [];
                        let sizeResponse = newItems.length;
                        let arr = JSON.parse(JSON.stringify(newItems))
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].role === "Owner") {
                                arr.splice(i, 1);
                            }
                        }
                        setListMember(arr)
                        setFinalLoad(sizeResponse < PAGINATION.ITEMS_20);
                    } else {
                        setFinalLoad(true);
                        setListMember([])
                    }
                    setFirstRender(false);
                    setRefreshing(false);
                } else if (error) {
                    setFirstRender(false);
                    setRefreshing(false);
                }
            }
        };
        processAPIListRoom();
    }, [listMemberGroup]);

    //ACTION

    const handleClearSearch = () => {
        // setFirstRender(true)
        setSearchValue('');
    };

    const handleChangeTextSearch = (value: string) => {
        let arr = JSON.parse(JSON.stringify(listMemberGroup.data?.items))
        if (value !== '') {
            const newData = listMemberGroup.data?.items.filter(function (item: any) {
                const itemData = changeAlias(item.full_name);
                const textData = changeAlias(value);
                return itemData.indexOf(textData) > -1;
            });
            setListMember(newData || []);
            setSearchValue(value);
        } else {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].role === "Owner") {
                    arr.splice(i, 1);
                }
            }
            setListMember(arr)
            setSearchValue(value);
        }
    };

    const getAPISearch = (keyword: string) => {
        dispatch(
            getListFriends({
                offset: 0,
                limit: PAGINATION.ITEMS_20,
                s: keyword,
            }),
        );
    };

    const handleSearch = () => {
        if (searchValue != '') {
            setFirstRender(true)
            setTimeout(() => {
                getAPISearch(searchValue);
            }, 300);
            setOffset(0);
        }
    };

    const renderErrorImage = () => {
        return <Image source={images.global.no_avatar} style={screenStyles.box40} resizeMode="contain" />;
    };

    const handleCheckBox = (item: any, index: any) => {
        setSelectedUserId(item.id);
    }

    //RENDER
    const renderInput = () => {
        return (
            <View style={[screenStyles.pH24, screenStyles.pV12]}>
                <View style={{ paddingTop: 16 }} />
                <CSearchBar
                    value={searchValue}
                    placeholder={t('search.searchPlaceholder', 'Search...')}
                    onChangeText={handleChangeTextSearch}
                    onSubmitEditing={handleSearch}
                    onClear={handleClearSearch}
                    returnKeyType="search"
                />
            </View>
        );
    };


    const renderItemRoomFriend = ({ item, index }: any) => {
        const { full_name, avatar, id } = item;
        return (
            <Row
                start
                style={[screenStyles.pV10, screenStyles.pH10, { borderBottomWidth: 1, borderBottomColor: colors.cF2F4F7 }]}>
                <Pressable style={[screenStyles.rowStart, screenStyles.flex1]} onPress={() => { handleCheckBox(item, index) }}>
                    <View style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: colors.cF2F4F7,
                        backgroundColor: colors.cEAECF0,
                    }}>
                        <ImageHelper source={{ uri: avatar }} renderErrorImage={renderErrorImage} />
                    </View>
                    <View style={[screenStyles.pH10, screenStyles.flex1]}>
                        <CText h5 w600 color={colors.black}>
                            {full_name || ''}
                        </CText>
                    </View>
                    {selectedUserId === id ?
                        <IconX name={'checkbox'} origin={ICON_TYPE.ICONICONS} color={colors.primary} size={26} />
                        : <IconX name={'check-box-outline-blank'} origin={ICON_TYPE.MATERIAL_ICONS} color={colors.black} size={26} />
                    }
                </Pressable>
            </Row>
        );
    };

    const renderBody = () => {
        if (firstRender) {
            return <CLoading />;
        } else {
            return (
                <FlatList
                    contentContainerStyle={screenStyles.flexGrowBottom}
                    keyboardDismissMode="on-drag"
                    data={listMember}
                    extraData={listMember}
                    keyExtractor={keyExtractor}
                    renderItem={renderItemRoomFriend}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => {
                        return <CEmptyData />;
                    }}
                    scrollsToTop={false}
                />
            );
        }
    };

    const renderButton = () => {
        return <View style={[screenStyles.shadow, { paddingHorizontal: 20, paddingVertical: 20 }]}>
            <Row>
            <View style={{width: ScreenWidth / 2, paddingHorizontal: 13}}>
            <Pressable onPress={() => hideModal()} style={{ borderWidth: 1,  borderColor: colors.cD0D5DD, height: 40, justifyContent: 'center', borderRadius: 10}}>
                <CText center h4 w600 color={colors.c667085}>
                    {t('communityChat.changeAdmin.buttonCancel')}
                </CText>
            </Pressable>
            </View>
                <View style={{width: ScreenWidth / 2, paddingHorizontal: 13}}>
            {selectedUserId.length > 0 ?
                <Pressable onPress={() => {hideModal(), handleAdminLeave(selectedUserId)}} style={{ backgroundColor: colors.primary, height: 40, justifyContent: 'center', borderRadius: 10}}>
                    <CText center h4 w600 color={colors.white}>
                        {t('communityChat.changeAdmin.buttonSubmit')}
                    </CText>
                </Pressable>
                : <Pressable onPress={() => { }} style={{ backgroundColor: colors.primary, height: 40, borderRadius: 10, justifyContent: 'center', opacity: 0.5 }}>
                    <CText center h4 w600 color={colors.white}>
                        {t('communityChat.changeAdmin.buttonSubmit')}
                    </CText>
                </Pressable>
            }
            </View>
            </Row>
            <View style={{paddingTop: 10}}/>
        </View>
    }



    const renderContent = () => {
        return (
            <View style={screenStyles.wrapModalTop}>
                <View style={screenStyles.modalTopHeader}>
                    <CText center h4 w600 color={colors.black}>
                        {t('communityChat.changeAdmin.title')}
                    </CText>
                </View>
                <Divider color={colors.cD0D5DD} width={1} />
                {renderInput()}
                {renderBody()}
                {renderButton()}
            </View>
        );
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={hideModal} style={screenStyles.containerModalTop}>
            {renderContent()}
            {apiLoading ? <APILoading showAlert={apiLoading} isLoadingAPI={apiLoading} /> : null}
        </Modal>
    );
};

const useStyles = makeStyles(({ colors }) => ({
    avatarDot: {
        position: 'absolute',
        width: 30, height: 30, borderRadius: 6, top: 2, left: 47
    },
    avatar50: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.cF2F4F7,
        backgroundColor: colors.cEAECF0,
    },
}));
