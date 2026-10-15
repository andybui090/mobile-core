import { accountTabRoute, mainRoute } from "@/constants";

export const ListMenu = [
  {
    id: 0,
    label: 'profile.appoints',
    alias:'Appointment',
    iconName: 'perm-contact-calendar',
    iconType: 'materialicons',
    iconBg: '#34C7D0',
    iconColor: '#fff',
    screenName: '',
  },
  {
    id: 1,
    label: 'profile.serviceBookingHistory',
    alias:'Service booking history',
    iconName: 'history',
    iconType: 'materialicons',
    iconBg: '#F63D68',
    iconColor: '#fff',
    screenName: accountTabRoute.historyBookingScreen,
  },
  {
    id: 2,
    label: 'profile.qrCode',
    alias:'Qr Code',
    iconName: 'qr-code',
    iconType: 'materialicons',
    iconBg: '#4AB95C',
    iconColor: '#fff',
    screenName: mainRoute.qrCodeScreen,
  },
  {
    id: 3,
    label: 'profile.inviteFriends',
    alias:'Invite friends',
    iconName: 'share',
    iconType: 'entypo',
    iconBg: '#A356D7',
    iconColor: '#fff',
    screenName: '',
  },
];
