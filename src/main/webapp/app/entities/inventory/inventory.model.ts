export interface IInventory {
  id: number;
  units?: number | null;
}

export type NewInventory = Omit<IInventory, 'id'> & { id: null };
