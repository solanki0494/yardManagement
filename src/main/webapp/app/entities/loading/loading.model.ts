import dayjs from 'dayjs/esm';
import { IPurchase } from 'app/entities/purchase/purchase.model';

export interface ILoading {
  id: number;
  yard?: string | null;
  vehicleNumber?: string | null;
  loadingTime?: dayjs.Dayjs | null;
  purchase?: Pick<IPurchase, 'id'> | null;
}

export type NewLoading = Omit<ILoading, 'id'> & { id: null };
