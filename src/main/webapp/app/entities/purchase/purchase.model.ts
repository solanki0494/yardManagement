import dayjs from 'dayjs/esm';
import { IInvoice } from 'app/entities/invoice/invoice.model';

export interface IPurchase {
  id: number;
  purchaseTime?: dayjs.Dayjs | null;
  invoiceNumber?: string | null;
  invoice?: Pick<IInvoice, 'id'> | null;
}

export type NewPurchase = Omit<IPurchase, 'id'> & { id: null };
