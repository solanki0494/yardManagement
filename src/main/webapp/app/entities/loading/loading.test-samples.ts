import dayjs from 'dayjs/esm';

import { ILoading, NewLoading } from './loading.model';

export const sampleWithRequiredData: ILoading = {
  id: 26244,
};

export const sampleWithPartialData: ILoading = {
  id: 32083,
  yard: 'Saudi Avon bleeding-edge',
  vehicleNumber: 'Fresh transmitter SDD',
  loadingTime: dayjs('2023-04-26T21:48'),
};

export const sampleWithFullData: ILoading = {
  id: 91564,
  yard: 'architectures Rubber',
  vehicleNumber: 'Course',
  loadingTime: dayjs('2023-04-26T17:11'),
};

export const sampleWithNewData: NewLoading = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
