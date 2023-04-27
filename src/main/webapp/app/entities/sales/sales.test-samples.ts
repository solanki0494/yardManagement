import dayjs from 'dayjs/esm';

import { ISales, NewSales } from './sales.model';

export const sampleWithRequiredData: ISales = {
  id: 95041,
};

export const sampleWithPartialData: ISales = {
  id: 1901,
};

export const sampleWithFullData: ISales = {
  id: 29288,
  invoiceId: 60043,
  saleTime: dayjs('2023-04-26T17:54'),
  buyer: 'port hub Architect',
};

export const sampleWithNewData: NewSales = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
