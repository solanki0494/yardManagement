import dayjs from 'dayjs/esm';
import { LoadingStatus } from '../enumerations/loading-status.model';
import { ILoadingProduct } from '../loading-product/loading-product.model';

export interface ILoading {
  id: number;
  yard?: string | null;
  vehicleNumber?: string | null;
  loadingTime?: dayjs.Dayjs | null;
  status?: LoadingStatus | null;
  loadingProducts?: ILoadingProduct[];
}

export type NewLoading = Omit<ILoading, 'id'> & { id: null };
