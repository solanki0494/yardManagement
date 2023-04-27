import { IProduct } from 'app/entities/product/product.model';
import { ILoading } from 'app/entities/loading/loading.model';
import { LoadingStatus } from 'app/entities/enumerations/loading-status.model';

export interface ILoadingProduct {
  id: number;
  units?: number | null;
  status?: LoadingStatus | null;
  product?: Pick<IProduct, 'id'> | null;
  loading?: Pick<ILoading, 'id'> | null;
}

export type NewLoadingProduct = Omit<ILoadingProduct, 'id'> & { id: null };
