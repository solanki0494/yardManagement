import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../purchase-product.test-samples';

import { PurchaseProductFormService } from './purchase-product-form.service';

describe('PurchaseProduct Form Service', () => {
  let service: PurchaseProductFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseProductFormService);
  });

  describe('Service methods', () => {
    describe('createPurchaseProductFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPurchaseProductFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            units: expect.any(Object),
            unitPrice: expect.any(Object),
            gst: expect.any(Object),
            total: expect.any(Object),
            purchase: expect.any(Object),
          })
        );
      });

      it('passing IPurchaseProduct should create a new form with FormGroup', () => {
        const formGroup = service.createPurchaseProductFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            units: expect.any(Object),
            unitPrice: expect.any(Object),
            gst: expect.any(Object),
            total: expect.any(Object),
            purchase: expect.any(Object),
          })
        );
      });
    });

    describe('getPurchaseProduct', () => {
      it('should return NewPurchaseProduct for default PurchaseProduct initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPurchaseProductFormGroup(sampleWithNewData);

        const purchaseProduct = service.getPurchaseProduct(formGroup) as any;

        expect(purchaseProduct).toMatchObject(sampleWithNewData);
      });

      it('should return NewPurchaseProduct for empty PurchaseProduct initial value', () => {
        const formGroup = service.createPurchaseProductFormGroup();

        const purchaseProduct = service.getPurchaseProduct(formGroup) as any;

        expect(purchaseProduct).toMatchObject({});
      });

      it('should return IPurchaseProduct', () => {
        const formGroup = service.createPurchaseProductFormGroup(sampleWithRequiredData);

        const purchaseProduct = service.getPurchaseProduct(formGroup) as any;

        expect(purchaseProduct).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPurchaseProduct should not enable id FormControl', () => {
        const formGroup = service.createPurchaseProductFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPurchaseProduct should disable id FormControl', () => {
        const formGroup = service.createPurchaseProductFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
