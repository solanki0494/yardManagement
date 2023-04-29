import dayjs from 'dayjs/esm';
import { LoadingStatus } from '../enumerations/loading-status.model';

export interface ILoading {
  id: number;
  yard?: string | null;
  vehicleNumber?: string | null;
  loadingTime?: dayjs.Dayjs | null;
  status?: LoadingStatus | null;
}

export type NewLoading = Omit<ILoading, 'id'> & { id: null };
