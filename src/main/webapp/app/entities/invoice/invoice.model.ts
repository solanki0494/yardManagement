import { InvoiceStatus } from 'app/entities/enumerations/invoice-status.model';

export interface IInvoice {
  id: number;
  invoiceNumber?: string | null;
  companyInvoiceNumber?: string | null;
  gst?: number | null;
  total?: number | null;
  status?: InvoiceStatus | null;
}

export type NewInvoice = Omit<IInvoice, 'id'> & { id: null };
