import { IPurchase } from 'app/entities/purchase/purchase.model';

export interface IPurchaseProduct {
  id: number;
  units?: number | null;
  unitPrice?: number | null;
  gst?: number | null;
  total?: number | null;
  purchase?: Pick<IPurchase, 'id'> | null;
}

export type NewPurchaseProduct = Omit<IPurchaseProduct, 'id'> & { id: null };
