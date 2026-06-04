export type listSuccessPayload = {
  is_success: any;
  total: number;
  items: any[];
  result: any[];
  status: string;
  msg: any;
};

export type errorPayload = {
  errors: any[];
};

export type responseListProps = {
  loading: boolean;
  data: listSuccessPayload | undefined;
  error: errorPayload | undefined;
};
