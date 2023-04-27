import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sales-product.test-samples';

import { SalesProductFormService } from './sales-product-form.service';

describe('SalesProduct Form Service', () => {
  let service: SalesProductFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesProductFormService);
  });

  describe('Service methods', () => {
    describe('createSalesProductFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSalesProductFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            units: expect.any(Object),
            unitPrice: expect.any(Object),
            gst: expect.any(Object),
            total: expect.any(Object),
            sales: expect.any(Object),
          })
        );
      });

      it('passing ISalesProduct should create a new form with FormGroup', () => {
        const formGroup = service.createSalesProductFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            units: expect.any(Object),
            unitPrice: expect.any(Object),
            gst: expect.any(Object),
            total: expect.any(Object),
            sales: expect.any(Object),
          })
        );
      });
    });

    describe('getSalesProduct', () => {
      it('should return NewSalesProduct for default SalesProduct initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSalesProductFormGroup(sampleWithNewData);

        const salesProduct = service.getSalesProduct(formGroup) as any;

        expect(salesProduct).toMatchObject(sampleWithNewData);
      });

      it('should return NewSalesProduct for empty SalesProduct initial value', () => {
        const formGroup = service.createSalesProductFormGroup();

        const salesProduct = service.getSalesProduct(formGroup) as any;

        expect(salesProduct).toMatchObject({});
      });

      it('should return ISalesProduct', () => {
        const formGroup = service.createSalesProductFormGroup(sampleWithRequiredData);

        const salesProduct = service.getSalesProduct(formGroup) as any;

        expect(salesProduct).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISalesProduct should not enable id FormControl', () => {
        const formGroup = service.createSalesProductFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSalesProduct should disable id FormControl', () => {
        const formGroup = service.createSalesProductFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
