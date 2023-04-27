import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../loading-product.test-samples';

import { LoadingProductFormService } from './loading-product-form.service';

describe('LoadingProduct Form Service', () => {
  let service: LoadingProductFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingProductFormService);
  });

  describe('Service methods', () => {
    describe('createLoadingProductFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLoadingProductFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            units: expect.any(Object),
            status: expect.any(Object),
            product: expect.any(Object),
            loading: expect.any(Object),
          })
        );
      });

      it('passing ILoadingProduct should create a new form with FormGroup', () => {
        const formGroup = service.createLoadingProductFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            units: expect.any(Object),
            status: expect.any(Object),
            product: expect.any(Object),
            loading: expect.any(Object),
          })
        );
      });
    });

    describe('getLoadingProduct', () => {
      it('should return NewLoadingProduct for default LoadingProduct initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLoadingProductFormGroup(sampleWithNewData);

        const loadingProduct = service.getLoadingProduct(formGroup) as any;

        expect(loadingProduct).toMatchObject(sampleWithNewData);
      });

      it('should return NewLoadingProduct for empty LoadingProduct initial value', () => {
        const formGroup = service.createLoadingProductFormGroup();

        const loadingProduct = service.getLoadingProduct(formGroup) as any;

        expect(loadingProduct).toMatchObject({});
      });

      it('should return ILoadingProduct', () => {
        const formGroup = service.createLoadingProductFormGroup(sampleWithRequiredData);

        const loadingProduct = service.getLoadingProduct(formGroup) as any;

        expect(loadingProduct).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILoadingProduct should not enable id FormControl', () => {
        const formGroup = service.createLoadingProductFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLoadingProduct should disable id FormControl', () => {
        const formGroup = service.createLoadingProductFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
