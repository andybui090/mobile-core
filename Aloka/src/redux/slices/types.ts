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

