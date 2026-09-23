type successPayload = {
  items: any[];
};

type errorPayload = {
  errors: any[];
};

export type responseProps = {
  loading: boolean;
  data: successPayload | undefined;
  error: errorPayload | undefined;
};

export type listSuccessPayload = {
  is_success?: any;
  total?: number;
  items?: any[];
  result?: any;
  status?: string;
  msg?: any;
};

export type createSuccessPayload = {
  [x: string]: any;
  total?: number;
  msg?: any;
  items?: any;
  result?: any;
  status?: string;
  content?: string;
};

export type responseListProps = {
  loading: boolean;
  data: listSuccessPayload | undefined;
  error: any | undefined;
};

export type responseCreateProps = {
  loading: boolean;
  data: createSuccessPayload | undefined;
  error: any | undefined;
};

