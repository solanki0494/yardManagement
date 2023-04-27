import { IInventory, NewInventory } from './inventory.model';

export const sampleWithRequiredData: IInventory = {
  id: 70625,
};

export const sampleWithPartialData: IInventory = {
  id: 53106,
};

export const sampleWithFullData: IInventory = {
  id: 18166,
  units: 65353,
};

export const sampleWithNewData: NewInventory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
