import { Home } from '../models/Home';

export interface HomeRepository {
  getList(): Promise<Home[]>;
}
