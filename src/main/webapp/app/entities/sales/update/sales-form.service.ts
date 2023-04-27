import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISales, NewSales } from '../sales.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISales for edit and NewSalesFormGroupInput for create.
 */
type SalesFormGroupInput = ISales | PartialWithRequiredKeyOf<NewSales>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISales | NewSales> = Omit<T, 'saleTime'> & {
  saleTime?: string | null;
};

type SalesFormRawValue = FormValueOf<ISales>;

type NewSalesFormRawValue = FormValueOf<NewSales>;

type SalesFormDefaults = Pick<NewSales, 'id' | 'saleTime'>;

type SalesFormGroupContent = {
  id: FormControl<SalesFormRawValue['id'] | NewSales['id']>;
  invoiceId: FormControl<SalesFormRawValue['invoiceId']>;
  saleTime: FormControl<SalesFormRawValue['saleTime']>;
  buyer: FormControl<SalesFormRawValue['buyer']>;
};

export type SalesFormGroup = FormGroup<SalesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SalesFormService {
  createSalesFormGroup(sales: SalesFormGroupInput = { id: null }): SalesFormGroup {
    const salesRawValue = this.convertSalesToSalesRawValue({
      ...this.getFormDefaults(),
      ...sales,
    });
    return new FormGroup<SalesFormGroupContent>({
      id: new FormControl(
        { value: salesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      invoiceId: new FormControl(salesRawValue.invoiceId),
      saleTime: new FormControl(salesRawValue.saleTime),
      buyer: new FormControl(salesRawValue.buyer),
    });
  }

  getSales(form: SalesFormGroup): ISales | NewSales {
    return this.convertSalesRawValueToSales(form.getRawValue() as SalesFormRawValue | NewSalesFormRawValue);
  }

  resetForm(form: SalesFormGroup, sales: SalesFormGroupInput): void {
    const salesRawValue = this.convertSalesToSalesRawValue({ ...this.getFormDefaults(), ...sales });
    form.reset(
      {
        ...salesRawValue,
        id: { value: salesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SalesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      saleTime: currentTime,
    };
  }

  private convertSalesRawValueToSales(rawSales: SalesFormRawValue | NewSalesFormRawValue): ISales | NewSales {
    return {
      ...rawSales,
      saleTime: dayjs(rawSales.saleTime, DATE_TIME_FORMAT),
    };
  }

  private convertSalesToSalesRawValue(
    sales: ISales | (Partial<NewSales> & SalesFormDefaults)
  ): SalesFormRawValue | PartialWithRequiredKeyOf<NewSalesFormRawValue> {
    return {
      ...sales,
      saleTime: sales.saleTime ? sales.saleTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
