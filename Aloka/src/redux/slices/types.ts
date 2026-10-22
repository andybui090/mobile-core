type successPayload = {
  items: any[];
  status: string;
  result: any;
  msg: any;
  users: any;
  disconnects: any;
  total: any;
  room_id: any;
  owner_id:any;
  thumbnail:any;
  title:any;
};

type errorPayload = {
  errors: any[];
};

export type responseProps = {
  loading: boolean;
  data: successPayload | undefined;
  error: errorPayload | undefined;
};
