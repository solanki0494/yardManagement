import { IInventory } from 'app/entities/inventory/inventory.model';

export interface IProduct {
  id: number;
  name?: string | null;
  defaultPrice?: number | null;
  defaultGST?: number | null;
}

export type NewProduct = Omit<IProduct, 'id'> & { id: null };
