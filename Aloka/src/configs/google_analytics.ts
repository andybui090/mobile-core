// RF DONE
import analytics from '@react-native-firebase/analytics';
import Config from 'react-native-config';
/**
 * Gửi event tùy chỉnh lên GA4
 * @param eventName - tên sự kiện (ví dụ: 'purchase', 'login', 'view_item')
 * @param params - các tham số kèm theo
 */
export async function GALogEvent(
  eventName: string,
  params: Record<string, any> = {},
) {
  if (__DEV__ || Config.ENV === 'staging') return;

  try {
    console.log(`[GA PROD] ${eventName}`, params);
    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.warn('GA logEvent error:', error);
  }
}

/**
 * Gửi event khi đổi màn hình
 * @param screenName - tên hiển thị (ví dụ: 'HomeScreen')
 * @param screenClass - class màn hình (nếu khác)
 */
export async function logScreenView(screenName: string, screenClass?: string) {
  if (__DEV__ || Config.ENV === 'staging') return;
  try {
    console.log(`[GA PROD] ${screenName}`);
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });
  } catch (error) {
    console.warn('GA logScreenView error:', error);
  }
}

/**
 * Event template cho các hành động thường gặp
 */
export const GAEvents = {
  //other
  REGISTER_BY_QR_CODE: 'register_by_qr_code',
  REGISTER: 'register',
  PRESS_TITLE_SUB: 'press_title_sub',
  PRESS_AUDIO_SUB: 'press_audio_sub',
  //
  APP_OPEN: 'dn_open_app',
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER_COMPLETE: 'registration_completed',
  DELETE_ACCOUNT: 'dn_delete_account',
  ONBOARDING_SKIPPED: 'onboarding_skipped',
  ONBOARDING_STARTED: 'onboarding_started',
  REGISTRATION_STARTED: 'registration_started',
  INTEREST_SELECTION_SKIPPED: 'interest_selection_skipped',
  USER_TYPE_DOCTOR: 'user_type_doctor',
  USER_TYPE_ENDUSER: 'user_type_enduser',
  USER_TYPE_MEDICALSTUDENT: 'user_type_medicalstudent',
  COMMUNITY_BUTTON_CLICKED: 'community_button_clicked',
  COURSE_BUTTON_CLICKED: 'course_button_clicked',
  NEWSFEED_BUTTON_CLICKED: 'newsfeed_button_clicked',
  DA_BUTTON_CLICKED: 'da_button_clicked',
  NEARBY_BUTTON_CLICKED: 'nearby_button_clicked',
  HOME_SEARCH: 'home_search',
  HOME_BANNER_CLICK: 'home_banner_click',
  HOME_BANNER2_CLICK: 'home_banner2_click',
  HOME_BANNER3_CLICK: 'home_banner3_click',
  HOME_BANNER2_IMPRESSION: 'home_banner2_impression',
  HOME_BANNER3_IMPRESSION: 'home_banner3_impression',
  COURSE_BANNER_CLICK: 'course_banner_click',
  COURSE_BANNER2_CLICK: 'course_banner2_click',
  COURSE_BANNER3_CLICK: 'course_banner3_click',
  COURSE_BANNER2_IMPRESSION: 'course_banner2_impression',
  COURSE_BANNER3_IMPRESSION: 'course_banner3_impression',
  NEWSFEED_BANNER_CLICK: 'newsfeed_banner_click',
  NEWSFEED_BANNER2_CLICK: 'newsfeed_banner2_click',
  NEWSFEED_BANNER3_CLICK: 'newsfeed_banner3_click',
  NEWSFEED_BANNER2_IMPRESSION: 'newsfeed_banner2_impression',
  NEWSFEED_BANNER3_IMPRESSION: 'newsfeed_banner3_impression',
  NEARBY_BANNER_CLICK: 'nearby_banner_click',
  NEARBY_BANNER2_CLICK: 'nearby_banner2_click',
  NEARBY_BANNER3_CLICK: 'nearby_banner3_click',
  NEARBY_BANNER2_IMPRESSION: 'nearby_banner2_impression',
  NEARBY_BANNER3_IMPRESSION: 'nearby_banner3_impression',
  COMMUNITY_BANNER_CLICK: 'community_banner_click',
  COMMUNITY_BANNER2_CLICK: 'community_banner2_click',
  COMMUNITY_BANNER3_CLICK: 'community_banner3_click',
  COMMUNITY_BANNER2_IMPRESSION: 'community_banner2_impression',
  COMMUNITY_BANNER3_IMPRESSION: 'community_banner3_impression',
  GROUP_JOINED: 'group_joined',
  GROUP_CONTENT_VIEWED: 'group_content_viewed',
  GROUP_LEFT: 'group_left',
  GROUP_REACTION_ADDED: 'group_reaction_added',
  COURSE_DETAIL_VIEWED: 'course_detail_viewed',
  COURSE_LESSON_OPENED: 'course_lesson_opened',
  COURSE_COMPLETED: 'course_completed',
  COURSE_REVIEW_SUBMITTED: 'course_review_submitted',
  COURSE_PURCHASED: 'course_purchased',
  COURSE_PAYMENT_FAILED: 'course_payment_failed',
  COURSE_PAYMENT_CANCELLED: 'course_payment_cancelled',
  VIDEO_CLICK: 'video_click',
  NOTI_CLICK: 'noti_click',
  COMMENT_ADDED: 'comment_added',
  LIKE_GIVEN: 'like_given',
  FOLLOW_USER: 'follow_user',
  // bo sung them ngay 05/02/2026
  profile_doctor_viewed: 'profile_doctor_viewed',
  package_viewed: 'package_viewed',
  package_purchased: 'package_purchased',
  payment_success: 'payment_success',
  payment_failed: 'payment_failed',
  payment_abandoned: 'payment_abandoned',
  payment_incomplete: 'payment_incomplete',
  calender_viewed: 'calender_viewed',
  user_calender_confirmed: 'user_calender_confirmed',
  user_calender_failed: 'user_calender_failed',
  doctor_calender_confirmed: 'doctor_calender_confirmed',
  doctor_calender_cancelled: 'doctor_calender_cancelled',
  call_confirmed: 'call_confirmed',
  all_cancelled: 'all_cancelled',
  doctor_called_confirmed: 'doctor_called_confirmed',
  doctor_called_cancelled: 'doctor_called_cancelled',
  end_called: 'end_called',
  doctor_end_called: 'doctor_end_called',
  chat_started: 'chat_started',
  text_clicked: 'text_clicked',
  send_clicked: 'send_clicked',
  start_conversation: 'start_conversation',
  chat_ended: 'chat_ended',
  //
  click_deeplink_package: 'click_deeplink_package',
};
