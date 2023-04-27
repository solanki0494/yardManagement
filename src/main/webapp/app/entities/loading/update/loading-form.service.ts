import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILoading, NewLoading } from '../loading.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILoading for edit and NewLoadingFormGroupInput for create.
 */
type LoadingFormGroupInput = ILoading | PartialWithRequiredKeyOf<NewLoading>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILoading | NewLoading> = Omit<T, 'loadingTime'> & {
  loadingTime?: string | null;
};

type LoadingFormRawValue = FormValueOf<ILoading>;

type NewLoadingFormRawValue = FormValueOf<NewLoading>;

type LoadingFormDefaults = Pick<NewLoading, 'id' | 'loadingTime'>;

type LoadingFormGroupContent = {
  id: FormControl<LoadingFormRawValue['id'] | NewLoading['id']>;
  yard: FormControl<LoadingFormRawValue['yard']>;
  vehicleNumber: FormControl<LoadingFormRawValue['vehicleNumber']>;
  loadingTime: FormControl<LoadingFormRawValue['loadingTime']>;
  purchase: FormControl<LoadingFormRawValue['purchase']>;
};

export type LoadingFormGroup = FormGroup<LoadingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LoadingFormService {
  createLoadingFormGroup(loading: LoadingFormGroupInput = { id: null }): LoadingFormGroup {
    const loadingRawValue = this.convertLoadingToLoadingRawValue({
      ...this.getFormDefaults(),
      ...loading,
    });
    return new FormGroup<LoadingFormGroupContent>({
      id: new FormControl(
        { value: loadingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      yard: new FormControl(loadingRawValue.yard),
      vehicleNumber: new FormControl(loadingRawValue.vehicleNumber),
      loadingTime: new FormControl(loadingRawValue.loadingTime),
      purchase: new FormControl(loadingRawValue.purchase),
    });
  }

  getLoading(form: LoadingFormGroup): ILoading | NewLoading {
    return this.convertLoadingRawValueToLoading(form.getRawValue() as LoadingFormRawValue | NewLoadingFormRawValue);
  }

  resetForm(form: LoadingFormGroup, loading: LoadingFormGroupInput): void {
    const loadingRawValue = this.convertLoadingToLoadingRawValue({ ...this.getFormDefaults(), ...loading });
    form.reset(
      {
        ...loadingRawValue,
        id: { value: loadingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LoadingFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      loadingTime: currentTime,
    };
  }

  private convertLoadingRawValueToLoading(rawLoading: LoadingFormRawValue | NewLoadingFormRawValue): ILoading | NewLoading {
    return {
      ...rawLoading,
      loadingTime: dayjs(rawLoading.loadingTime, DATE_TIME_FORMAT),
    };
  }

  private convertLoadingToLoadingRawValue(
    loading: ILoading | (Partial<NewLoading> & LoadingFormDefaults)
  ): LoadingFormRawValue | PartialWithRequiredKeyOf<NewLoadingFormRawValue> {
    return {
      ...loading,
      loadingTime: loading.loadingTime ? loading.loadingTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
