import { Auth } from '../models/Auth';

export interface AuthRepository {
  getList(): Promise<Auth[]>;
}
