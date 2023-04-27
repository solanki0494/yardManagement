import { ISales } from 'app/entities/sales/sales.model';

export interface ISalesProduct {
  id: number;
  units?: number | null;
  unitPrice?: number | null;
  gst?: number | null;
  total?: number | null;
  sales?: Pick<ISales, 'id'> | null;
}

export type NewSalesProduct = Omit<ISalesProduct, 'id'> & { id: null };
