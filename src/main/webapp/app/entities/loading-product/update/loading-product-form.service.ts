import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILoadingProduct, NewLoadingProduct } from '../loading-product.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILoadingProduct for edit and NewLoadingProductFormGroupInput for create.
 */
type LoadingProductFormGroupInput = ILoadingProduct | PartialWithRequiredKeyOf<NewLoadingProduct>;

type LoadingProductFormDefaults = Pick<NewLoadingProduct, 'id'>;

type LoadingProductFormGroupContent = {
  id: FormControl<ILoadingProduct['id'] | NewLoadingProduct['id']>;
  units: FormControl<ILoadingProduct['units']>;
  status: FormControl<ILoadingProduct['status']>;
  product: FormControl<ILoadingProduct['product']>;
  loading: FormControl<ILoadingProduct['loading']>;
};

export type LoadingProductFormGroup = FormGroup<LoadingProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LoadingProductFormService {
  createLoadingProductFormGroup(loadingProduct: LoadingProductFormGroupInput = { id: null }): LoadingProductFormGroup {
    const loadingProductRawValue = {
      ...this.getFormDefaults(),
      ...loadingProduct,
    };
    return new FormGroup<LoadingProductFormGroupContent>({
      id: new FormControl(
        { value: loadingProductRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      units: new FormControl(loadingProductRawValue.units),
      status: new FormControl(loadingProductRawValue.status),
      product: new FormControl(loadingProductRawValue.product),
      loading: new FormControl(loadingProductRawValue.loading),
    });
  }

  getLoadingProduct(form: LoadingProductFormGroup): ILoadingProduct | NewLoadingProduct {
    return form.getRawValue() as ILoadingProduct | NewLoadingProduct;
  }

  resetForm(form: LoadingProductFormGroup, loadingProduct: LoadingProductFormGroupInput): void {
    const loadingProductRawValue = { ...this.getFormDefaults(), ...loadingProduct };
    form.reset(
      {
        ...loadingProductRawValue,
        id: { value: loadingProductRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LoadingProductFormDefaults {
    return {
      id: null,
    };
  }
}
