import dayjs from 'dayjs/esm';

export interface ISales {
  id: number;
  invoiceId?: number | null;
  saleTime?: dayjs.Dayjs | null;
  buyer?: string | null;
}

export type NewSales = Omit<ISales, 'id'> & { id: null };
