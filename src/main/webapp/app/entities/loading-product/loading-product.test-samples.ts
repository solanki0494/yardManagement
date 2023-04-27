import { LoadingStatus } from 'app/entities/enumerations/loading-status.model';

import { ILoadingProduct, NewLoadingProduct } from './loading-product.model';

export const sampleWithRequiredData: ILoadingProduct = {
  id: 21106,
};

export const sampleWithPartialData: ILoadingProduct = {
  id: 54688,
  units: 91153,
  status: LoadingStatus['IN'],
};

export const sampleWithFullData: ILoadingProduct = {
  id: 7183,
  units: 88191,
  status: LoadingStatus['IN'],
};

export const sampleWithNewData: NewLoadingProduct = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
