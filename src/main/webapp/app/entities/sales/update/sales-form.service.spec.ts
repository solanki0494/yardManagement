import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sales.test-samples';

import { SalesFormService } from './sales-form.service';

describe('Sales Form Service', () => {
  let service: SalesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesFormService);
  });

  describe('Service methods', () => {
    describe('createSalesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSalesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            saleTime: expect.any(Object),
            buyer: expect.any(Object),
          })
        );
      });

      it('passing ISales should create a new form with FormGroup', () => {
        const formGroup = service.createSalesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            invoiceId: expect.any(Object),
            saleTime: expect.any(Object),
            buyer: expect.any(Object),
          })
        );
      });
    });

    describe('getSales', () => {
      it('should return NewSales for default Sales initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSalesFormGroup(sampleWithNewData);

        const sales = service.getSales(formGroup) as any;

        expect(sales).toMatchObject(sampleWithNewData);
      });

      it('should return NewSales for empty Sales initial value', () => {
        const formGroup = service.createSalesFormGroup();

        const sales = service.getSales(formGroup) as any;

        expect(sales).toMatchObject({});
      });

      it('should return ISales', () => {
        const formGroup = service.createSalesFormGroup(sampleWithRequiredData);

        const sales = service.getSales(formGroup) as any;

        expect(sales).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISales should not enable id FormControl', () => {
        const formGroup = service.createSalesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSales should disable id FormControl', () => {
        const formGroup = service.createSalesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
