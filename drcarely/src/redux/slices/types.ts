type listSuccessPayload = {
  is_success: any;
  total: number;
  items: any[];
  result: any[];
  status: string;
  msg:any;
};

type createSuccessPayload = {
  [x: string]: any;
  total: number;
  msg: any;
  items: any;
  result: object;
  status: string;
  content: string;
  room_id: any;
  from: any;
  thumbnail: any;
  title: any;
  type: any;
  to: any;
  full_name: any;
  images: any;
  resources: any;
  avatar: any;
  id: any;
  clientMsgId: any;
  users: any;
  disconnects: any;
  owner_id: any;
  reply_id: any;
  pin_status: any;
  room_title: any;
  messageId: any;
  emojiId: any;
  channel_id: any;
};

type errorPayload = {
  errors: any[];
};

type errorPayloadCommunity = {
  errors: any;
};

export type responseListPropsCommunity = {
  loading: boolean;
  data: listSuccessPayload | undefined;
  error: errorPayloadCommunity | undefined;
};


export type responseListProps = {
  loading: boolean;
  data: listSuccessPayload | undefined;
  error: errorPayload | undefined;
};

export type responseObjectProps = {
  loading: boolean;
  data: listSuccessPayload | undefined;
  error: errorPayload | undefined;
};

export type responseCreateProps = {
  loading: boolean;
  data: createSuccessPayload | undefined;
  error: errorPayload | undefined;
};


export type responsebotResponseProps = {
  avatar: any,
  clientMsgId: any,
  content: any,
  from: any,
  full_name: any,
  id: any,
  reply_id: any,
  resources: any,
  room_id: any
};

export type localUpdate = {
  data: any;
};

export type dataListLocal = {
  items:Array<object>,
  totalItems:number,
  offset:number,
  limit:number,
};

export type AdjustParams = {
  url:string,
  utm_medium:string,
  utm_campaign:string,
  utm_source:string,
  utm_content:string,
  utm_term:string,
}

export type DeeplinkParams = {
  url:string,
  utm_medium:string,
  utm_campaign:string,
  utm_source:string,
  utm_source_1?:string,
  utm_content:string,
  utm_term:string,
}