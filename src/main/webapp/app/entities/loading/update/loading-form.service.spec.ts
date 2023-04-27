import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../loading.test-samples';

import { LoadingFormService } from './loading-form.service';

describe('Loading Form Service', () => {
  let service: LoadingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingFormService);
  });

  describe('Service methods', () => {
    describe('createLoadingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLoadingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            yard: expect.any(Object),
            vehicleNumber: expect.any(Object),
            loadingTime: expect.any(Object),
            purchase: expect.any(Object),
          })
        );
      });

      it('passing ILoading should create a new form with FormGroup', () => {
        const formGroup = service.createLoadingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            yard: expect.any(Object),
            vehicleNumber: expect.any(Object),
            loadingTime: expect.any(Object),
            purchase: expect.any(Object),
          })
        );
      });
    });

    describe('getLoading', () => {
      it('should return NewLoading for default Loading initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLoadingFormGroup(sampleWithNewData);

        const loading = service.getLoading(formGroup) as any;

        expect(loading).toMatchObject(sampleWithNewData);
      });

      it('should return NewLoading for empty Loading initial value', () => {
        const formGroup = service.createLoadingFormGroup();

        const loading = service.getLoading(formGroup) as any;

        expect(loading).toMatchObject({});
      });

      it('should return ILoading', () => {
        const formGroup = service.createLoadingFormGroup(sampleWithRequiredData);

        const loading = service.getLoading(formGroup) as any;

        expect(loading).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILoading should not enable id FormControl', () => {
        const formGroup = service.createLoadingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLoading should disable id FormControl', () => {
        const formGroup = service.createLoadingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
