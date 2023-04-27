import { ISalesProduct, NewSalesProduct } from './sales-product.model';

export const sampleWithRequiredData: ISalesProduct = {
  id: 20920,
};

export const sampleWithPartialData: ISalesProduct = {
  id: 35382,
  units: 38025,
  unitPrice: 13129,
};

export const sampleWithFullData: ISalesProduct = {
  id: 26748,
  units: 73697,
  unitPrice: 94844,
  gst: 57657,
  total: 26473,
};

export const sampleWithNewData: NewSalesProduct = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
