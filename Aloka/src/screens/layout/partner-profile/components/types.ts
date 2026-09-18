export type MainTab = 'INFO' | 'CHAT';
export type SubStatus = 'REQUEST' | 'SCHEDULE' | 'COMPLETED' | 'CANCELLED';

export interface ConversationItem {
  id: string;
  roomId: string;
  customerName: string;
  customerAvatar?: any;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
  toUserId?: string;
}

export interface WorkRequestItem {
  id: string;
  rawItem?: any;
  customerId?: string;
  customerName: string;
  customerAvatar?: any;
  customerPhone: string;
  serviceTitle: string;
  autoCancelTime?: string;
  note?: string;
  date: string;
  time: string;
  address: string;
  amount: string;
  status: SubStatus;
  appointmentStatus?: string;
  cancelReason?: string;
  isMoving?: boolean;
  isArrived?: boolean;
}
