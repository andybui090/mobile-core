import React from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { IconX } from '@/components';
import { images } from '@/configs/image';
import { CText } from '@/utils';
import { SubStatus, WorkRequestItem } from './types';

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    subPillsRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 8,
      backgroundColor: colors.white,
    },
    pillItem: {
      paddingVertical: 7,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: colors.cF2F4F7 || '#F2F4F7',
    },
    pillItemActive: {
      backgroundColor: colors.primary || '#19A2A7',
    },
    pillText: {
      fontSize: 13.5,
      fontWeight: '500',
      color: colors.c667085 || '#667085',
    },
    pillTextActive: {
      color: colors.white,
      fontWeight: '600',
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    emptyContainer: {
      paddingVertical: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: colors.c667085 || '#667085',
      marginTop: 10,
    },
    mapContainer: {
      height: 120,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 12,
      position: 'relative',
    },
    mapImage: {
      width: '100%',
      height: '100%',
    },
    openMapBtn: {
      position: 'absolute',
      bottom: 10,
      right: 12,
      backgroundColor: colors.white,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2,
    },
    openMapText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary || '#19A2A7',
    },
    jobCard: {
      backgroundColor: colors.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.cEAECF0 || '#EAECF0',
      padding: 16,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    },
    customerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.cF2F4F7 || '#F2F4F7',
      marginBottom: 12,
    },
    customerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatarImg: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: '#E6FAFA',
      marginRight: 10,
    },
    customerName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.c1D2939 || '#1D2939',
    },
    customerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    circleIconBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.primary || '#19A2A7',
      justifyContent: 'center',
      alignItems: 'center',
    },
    jobTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    serviceTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.c101828 || '#101828',
    },
    autoCancelTag: {
      backgroundColor: '#FEF3F2',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    },
    autoCancelText: {
      fontSize: 11.5,
      color: '#F04438',
      fontWeight: '500',
    },
    customerNoteBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#FEF3F2',
      padding: 10,
      borderRadius: 8,
      marginBottom: 12,
      gap: 6,
    },
    customerNoteText: {
      fontSize: 12.5,
      color: '#D92D20',
      flex: 1,
      lineHeight: 18,
    },
    customerNoteBoxNormal: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.cF2F4F7 || '#F2F4F7',
      padding: 10,
      borderRadius: 8,
      marginBottom: 12,
      gap: 6,
    },
    customerNoteTextNormal: {
      fontSize: 12.5,
      color: colors.c667085 || '#667085',
      flex: 1,
      lineHeight: 18,
    },
    jobInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    jobInfoText: {
      fontSize: 13.5,
      color: colors.c344054 || '#344054',
      flex: 1,
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      marginTop: 4,
      borderTopWidth: 1,
      borderTopColor: colors.cF2F4F7 || '#F2F4F7',
    },
    amountLabel: {
      fontSize: 13.5,
      color: colors.c667085 || '#667085',
    },
    amountValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary || '#19A2A7',
    },
    cardActionRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 6,
    },
    rejectBtn: {
      flex: 1,
      paddingVertical: 11,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.cD0D5DD || '#D0D5DD',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rejectBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.c344054 || '#344054',
    },
    acceptBtn: {
      flex: 1,
      paddingVertical: 11,
      borderRadius: 8,
      backgroundColor: colors.primary || '#19A2A7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    acceptBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
    arriveBtn: {
      width: '100%',
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.primary || '#19A2A7',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 6,
    },
    arriveBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
    completeBtn: {
      width: '100%',
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: '#039855',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 6,
    },
    completeBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
  })
);

interface WorkInfoTabProps {
  subStatus: SubStatus;
  onSelectSubStatus: (status: SubStatus) => void;
  requestsList: WorkRequestItem[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onCall: (phone: string) => void;
  onChat: (name: string, avatar?: any, jobId?: string, toUserId?: string, rawItem?: any) => void;
  onOpenRejectModal: (jobId: string) => void;
  onAcceptJob: (jobId: string) => void;
  onStartMoving: (jobId: string) => void;
  onConfirmArrived: (jobId: string) => void;
  onCompleteJob?: (jobId: string) => void;
  onOpenMap: (address: string) => void;
}

export const WorkInfoTab: React.FC<WorkInfoTabProps> = ({
  subStatus,
  onSelectSubStatus,
  requestsList,
  isLoading,
  isRefreshing,
  onRefresh,
  onCall,
  onChat,
  onOpenRejectModal,
  onAcceptJob,
  onStartMoving,
  onConfirmArrived,
  onCompleteJob,
  onOpenMap,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const {
    theme: { colors },
  } = useTheme();

  const currentList = requestsList.filter(item => item.status === subStatus);

  return (
    <>
      {/* Sub Status Pills: Yêu cầu | Lịch hẹn | Hoàn thành | Huỷ */}
      <View style={styles.subPillsRow}>
        <TouchableOpacity
          style={[styles.pillItem, subStatus === 'REQUEST' && styles.pillItemActive]}
          activeOpacity={0.7}
          onPress={() => onSelectSubStatus('REQUEST')}
        >
          <CText style={[styles.pillText, subStatus === 'REQUEST' && styles.pillTextActive]}>
            {t('partnerWork.subStatus.request', 'Yêu cầu')}
          </CText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pillItem, subStatus === 'SCHEDULE' && styles.pillItemActive]}
          activeOpacity={0.7}
          onPress={() => onSelectSubStatus('SCHEDULE')}
        >
          <CText style={[styles.pillText, subStatus === 'SCHEDULE' && styles.pillTextActive]}>
            {t('partnerWork.subStatus.schedule', 'Lịch hẹn')}
          </CText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pillItem, subStatus === 'COMPLETED' && styles.pillItemActive]}
          activeOpacity={0.7}
          onPress={() => onSelectSubStatus('COMPLETED')}
        >
          <CText style={[styles.pillText, subStatus === 'COMPLETED' && styles.pillTextActive]}>
            {t('partnerWork.subStatus.completed', 'Hoàn thành')}
          </CText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pillItem, subStatus === 'CANCELLED' && styles.pillItemActive]}
          activeOpacity={0.7}
          onPress={() => onSelectSubStatus('CANCELLED')}
        >
          <CText style={[styles.pillText, subStatus === 'CANCELLED' && styles.pillTextActive]}>
            {t('partnerWork.subStatus.cancelled', 'Huỷ')}
          </CText>
        </TouchableOpacity>
      </View>

      {/* Content List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={!!isRefreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {isLoading && !isRefreshing ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : currentList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconX
              type="ionicons"
              name="calendar-outline"
              size={48}
              color={colors.cD0D5DD || '#D0D5DD'}
            />
            <CText style={styles.emptyText}>
              {subStatus === 'REQUEST'
                ? t('partnerWork.emptyRequest', 'Chưa có yêu cầu nào đang chờ')
                : subStatus === 'SCHEDULE'
                  ? t('partnerWork.emptySchedule', 'Chưa có lịch hẹn nào')
                  : subStatus === 'COMPLETED'
                    ? t('partnerWork.emptyCompleted', 'Chưa có lịch hoàn thành nào')
                    : t('partnerWork.emptyCancelled', 'Chưa có lịch bị huỷ nào')}
            </CText>
          </View>
        ) : (
          currentList.map(job => (
            <React.Fragment key={job.id}>
              {/* Mini Map Preview khi ca đang di chuyển (isMoving) */}
              {subStatus === 'SCHEDULE' && (job.isMoving || job.appointmentStatus === 'ON_THE_WAY') && (
                <View style={styles.mapContainer}>
                  <Image
                    source={images.common.img_default}
                    style={styles.mapImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.openMapBtn}
                    activeOpacity={0.8}
                    onPress={() => onOpenMap(job.address)}
                  >
                    <CText style={styles.openMapText}>{t('partnerWork.openMap', 'Xem bản đồ')}</CText>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.jobCard}>
                {/* Customer Header */}
                <View style={styles.customerRow}>
                  <View style={styles.customerInfo}>
                    <Image
                      source={
                        typeof job.customerAvatar === 'string' && job.customerAvatar
                          ? { uri: job.customerAvatar }
                          : job.customerAvatar || images.common.img_default
                      }
                      style={styles.avatarImg}
                    />
                    <CText style={styles.customerName}>{job.customerName}</CText>
                  </View>

                  <View style={styles.customerActions}>
                    {!!job.customerPhone && (
                      <TouchableOpacity
                        style={styles.circleIconBtn}
                        activeOpacity={0.7}
                        onPress={() => onCall(job.customerPhone)}
                      >
                        <IconX
                          type="ionicons"
                          name="call"
                          size={17}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.circleIconBtn}
                      activeOpacity={0.7}
                      onPress={() =>
                        onChat(
                          job.customerName,
                          job.customerAvatar,
                          job.id,
                          job.customerId,
                          job.rawItem,
                        )
                      }
                    >
                      <IconX
                        type="ionicons"
                        name="chatbubble-ellipses"
                        size={17}
                        color={colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Service Title & Auto Cancel Tag */}
                <View style={styles.jobTitleRow}>
                  <CText style={styles.serviceTitle}>{job.serviceTitle}</CText>
                  {!!job.autoCancelTime && subStatus === 'REQUEST' && (
                    <View style={styles.autoCancelTag}>
                      <CText style={styles.autoCancelText}>
                        {t('partnerWork.autoCancel', 'Tự động huỷ')}: {job.autoCancelTime}
                      </CText>
                    </View>
                  )}
                </View>

                {/* Note Box */}
                {!!job.note &&
                  (job.note.includes('dị ứng') ? (
                    <View style={styles.customerNoteBox}>
                      <IconX
                        type="ionicons"
                        name="document-text-outline"
                        size={15}
                        color="#F04438"
                      />
                      <CText style={styles.customerNoteText}>{job.note}</CText>
                    </View>
                  ) : (
                    <View style={styles.customerNoteBoxNormal}>
                      <IconX
                        type="ionicons"
                        name="document-text-outline"
                        size={15}
                        color={colors.c98A2B3 || '#98A2B3'}
                      />
                      <CText style={styles.customerNoteTextNormal}>{job.note}</CText>
                    </View>
                  ))}

                {/* Cancel Reason Box if cancelled */}
                {subStatus === 'CANCELLED' && !!job.cancelReason && (
                  <View style={styles.customerNoteBox}>
                    <IconX
                      type="ionicons"
                      name="alert-circle-outline"
                      size={15}
                      color="#F04438"
                    />
                    <CText style={styles.customerNoteText}>
                      Lý do huỷ: {job.cancelReason}
                    </CText>
                  </View>
                )}

                {/* Job Details */}
                <View style={styles.jobInfoRow}>
                  <IconX
                    type="ionicons"
                    name="calendar-outline"
                    size={15}
                    color={colors.c344054 || '#344054'}
                  />
                  <CText style={styles.jobInfoText}>{job.date}</CText>
                </View>

                <View style={styles.jobInfoRow}>
                  <IconX
                    type="ionicons"
                    name="time-outline"
                    size={15}
                    color={subStatus === 'SCHEDULE' ? '#F79009' : colors.c344054 || '#344054'}
                  />
                  <CText
                    style={[
                      styles.jobInfoText,
                      subStatus === 'SCHEDULE' && {
                        color: '#F79009',
                        fontWeight: '500',
                      },
                    ]}
                  >
                    {job.time}
                  </CText>
                </View>

                {Boolean(job.address) && (
                  <View style={styles.jobInfoRow}>
                    <IconX
                      type="ionicons"
                      name="location-outline"
                      size={15}
                      color={colors.c344054 || '#344054'}
                    />
                    <CText style={styles.jobInfoText}>{job.address}</CText>
                  </View>
                )}

                {/* Amount Row */}
                <View style={styles.amountRow}>
                  <CText style={styles.amountLabel}>{t('partnerWork.totalAmountReceived', 'Tổng tiền nhận được')}</CText>
                  <CText style={styles.amountValue}>{job.amount}</CText>
                </View>

                {/* Action Buttons: Từ chối | Chấp nhận (ở tab Yêu cầu) */}
                {subStatus === 'REQUEST' && (
                  <View style={styles.cardActionRow}>
                    <TouchableOpacity
                      style={styles.rejectBtn}
                      activeOpacity={0.7}
                      onPress={() => onOpenRejectModal(job.id)}
                    >
                      <CText style={styles.rejectBtnText}>{t('partnerWork.btnReject', 'Từ chối')}</CText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.acceptBtn}
                      activeOpacity={0.7}
                      onPress={() => onAcceptJob(job.id)}
                    >
                      <CText style={styles.acceptBtnText}>{t('partnerWork.btnAccept', 'Chấp nhận')}</CText>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Action Buttons cho tab Lịch hẹn */}
                {subStatus === 'SCHEDULE' &&
                  (job.isArrived || job.appointmentStatus === 'ARRIVED' ? (
                    <TouchableOpacity
                      style={styles.completeBtn}
                      activeOpacity={0.8}
                      onPress={() => onCompleteJob ? onCompleteJob(job.id) : onConfirmArrived(job.id)}
                    >
                      <CText style={styles.completeBtnText}>
                        {t('partnerWork.btnComplete', 'Hoàn thành dịch vụ')}
                      </CText>
                    </TouchableOpacity>
                  ) : job.isMoving || job.appointmentStatus === 'ON_THE_WAY' ? (
                    <TouchableOpacity
                      style={styles.arriveBtn}
                      activeOpacity={0.8}
                      onPress={() => onConfirmArrived(job.id)}
                    >
                      <CText style={styles.arriveBtnText}>
                        {t('partnerWork.btnArrivedDestination', 'Xác nhận đã đến điểm hẹn')}
                      </CText>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.cardActionRow}>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        activeOpacity={0.7}
                        onPress={() => onStartMoving(job.id)}
                      >
                        <CText style={styles.rejectBtnText}>{t('partnerWork.btnStartMoving', 'Bắt đầu di chuyển')}</CText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.acceptBtn}
                        activeOpacity={0.7}
                        onPress={() => onConfirmArrived(job.id)}
                      >
                        <CText style={styles.acceptBtnText}>{t('partnerWork.btnArrived', 'Xác nhận đã đến')}</CText>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            </React.Fragment>
          ))
        )}
      </ScrollView>
    </>
  );
};
