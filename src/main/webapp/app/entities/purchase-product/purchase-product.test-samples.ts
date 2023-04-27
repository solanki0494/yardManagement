import { IPurchaseProduct, NewPurchaseProduct } from './purchase-product.model';

export const sampleWithRequiredData: IPurchaseProduct = {
  id: 94090,
};

export const sampleWithPartialData: IPurchaseProduct = {
  id: 42765,
  gst: 33280,
};

export const sampleWithFullData: IPurchaseProduct = {
  id: 9062,
  units: 90956,
  unitPrice: 76538,
  gst: 36873,
  total: 76244,
};

export const sampleWithNewData: NewPurchaseProduct = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
