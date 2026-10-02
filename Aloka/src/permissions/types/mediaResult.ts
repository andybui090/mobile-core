export interface MediaResult<T = any> {
  isSuccess: boolean;
  imgRes: T | null;
  msg: string | null;
}