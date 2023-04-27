import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISalesProduct, NewSalesProduct } from '../sales-product.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISalesProduct for edit and NewSalesProductFormGroupInput for create.
 */
type SalesProductFormGroupInput = ISalesProduct | PartialWithRequiredKeyOf<NewSalesProduct>;

type SalesProductFormDefaults = Pick<NewSalesProduct, 'id'>;

type SalesProductFormGroupContent = {
  id: FormControl<ISalesProduct['id'] | NewSalesProduct['id']>;
  units: FormControl<ISalesProduct['units']>;
  unitPrice: FormControl<ISalesProduct['unitPrice']>;
  gst: FormControl<ISalesProduct['gst']>;
  total: FormControl<ISalesProduct['total']>;
  sales: FormControl<ISalesProduct['sales']>;
};

export type SalesProductFormGroup = FormGroup<SalesProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SalesProductFormService {
  createSalesProductFormGroup(salesProduct: SalesProductFormGroupInput = { id: null }): SalesProductFormGroup {
    const salesProductRawValue = {
      ...this.getFormDefaults(),
      ...salesProduct,
    };
    return new FormGroup<SalesProductFormGroupContent>({
      id: new FormControl(
        { value: salesProductRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      units: new FormControl(salesProductRawValue.units),
      unitPrice: new FormControl(salesProductRawValue.unitPrice),
      gst: new FormControl(salesProductRawValue.gst),
      total: new FormControl(salesProductRawValue.total),
      sales: new FormControl(salesProductRawValue.sales),
    });
  }

  getSalesProduct(form: SalesProductFormGroup): ISalesProduct | NewSalesProduct {
    return form.getRawValue() as ISalesProduct | NewSalesProduct;
  }

  resetForm(form: SalesProductFormGroup, salesProduct: SalesProductFormGroupInput): void {
    const salesProductRawValue = { ...this.getFormDefaults(), ...salesProduct };
    form.reset(
      {
        ...salesProductRawValue,
        id: { value: salesProductRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SalesProductFormDefaults {
    return {
      id: null,
    };
  }
}
