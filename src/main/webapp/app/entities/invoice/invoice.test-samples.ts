import { InvoiceStatus } from 'app/entities/enumerations/invoice-status.model';

import { IInvoice, NewInvoice } from './invoice.model';

export const sampleWithRequiredData: IInvoice = {
  id: 91509,
};

export const sampleWithPartialData: IInvoice = {
  id: 43164,
  invoiceNumber: 'tan Crescent',
  companyInvoiceNumber: 'International',
};

export const sampleWithFullData: IInvoice = {
  id: 96503,
  invoiceNumber: 'Arkansas auxiliary Togo',
  companyInvoiceNumber: 'Optimization',
  gst: 30708,
  total: 55945,
  status: InvoiceStatus['PENDING'],
};

export const sampleWithNewData: NewInvoice = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
