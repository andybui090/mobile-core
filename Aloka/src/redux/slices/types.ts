type successPayload = {
  items: any[];
  status: string;
  result: any;
  msg: any;
  users: any;
  disconnects: any;
};

type errorPayload = {
  errors: any[];
};

export type responseProps = {
  loading: boolean;
  data: successPayload | undefined;
  error: errorPayload | undefined;
};
