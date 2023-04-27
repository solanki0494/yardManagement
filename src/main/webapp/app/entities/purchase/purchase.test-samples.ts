import dayjs from 'dayjs/esm';

import { IPurchase, NewPurchase } from './purchase.model';

export const sampleWithRequiredData: IPurchase = {
  id: 12989,
};

export const sampleWithPartialData: IPurchase = {
  id: 49714,
  purchaseTime: dayjs('2023-04-27T08:52'),
};

export const sampleWithFullData: IPurchase = {
  id: 93378,
  purchaseTime: dayjs('2023-04-26T20:09'),
  invoiceNumber: 'Kids',
};

export const sampleWithNewData: NewPurchase = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
