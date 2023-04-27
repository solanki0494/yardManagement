import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPurchase, NewPurchase } from '../purchase.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPurchase for edit and NewPurchaseFormGroupInput for create.
 */
type PurchaseFormGroupInput = IPurchase | PartialWithRequiredKeyOf<NewPurchase>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPurchase | NewPurchase> = Omit<T, 'purchaseTime'> & {
  purchaseTime?: string | null;
};

type PurchaseFormRawValue = FormValueOf<IPurchase>;

type NewPurchaseFormRawValue = FormValueOf<NewPurchase>;

type PurchaseFormDefaults = Pick<NewPurchase, 'id' | 'purchaseTime'>;

type PurchaseFormGroupContent = {
  id: FormControl<PurchaseFormRawValue['id'] | NewPurchase['id']>;
  purchaseTime: FormControl<PurchaseFormRawValue['purchaseTime']>;
  invoiceNumber: FormControl<PurchaseFormRawValue['invoiceNumber']>;
  invoice: FormControl<PurchaseFormRawValue['invoice']>;
};

export type PurchaseFormGroup = FormGroup<PurchaseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PurchaseFormService {
  createPurchaseFormGroup(purchase: PurchaseFormGroupInput = { id: null }): PurchaseFormGroup {
    const purchaseRawValue = this.convertPurchaseToPurchaseRawValue({
      ...this.getFormDefaults(),
      ...purchase,
    });
    return new FormGroup<PurchaseFormGroupContent>({
      id: new FormControl(
        { value: purchaseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      purchaseTime: new FormControl(purchaseRawValue.purchaseTime),
      invoiceNumber: new FormControl(purchaseRawValue.invoiceNumber),
      invoice: new FormControl(purchaseRawValue.invoice),
    });
  }

  getPurchase(form: PurchaseFormGroup): IPurchase | NewPurchase {
    return this.convertPurchaseRawValueToPurchase(form.getRawValue() as PurchaseFormRawValue | NewPurchaseFormRawValue);
  }

  resetForm(form: PurchaseFormGroup, purchase: PurchaseFormGroupInput): void {
    const purchaseRawValue = this.convertPurchaseToPurchaseRawValue({ ...this.getFormDefaults(), ...purchase });
    form.reset(
      {
        ...purchaseRawValue,
        id: { value: purchaseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PurchaseFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      purchaseTime: currentTime,
    };
  }

  private convertPurchaseRawValueToPurchase(rawPurchase: PurchaseFormRawValue | NewPurchaseFormRawValue): IPurchase | NewPurchase {
    return {
      ...rawPurchase,
      purchaseTime: dayjs(rawPurchase.purchaseTime, DATE_TIME_FORMAT),
    };
  }

  private convertPurchaseToPurchaseRawValue(
    purchase: IPurchase | (Partial<NewPurchase> & PurchaseFormDefaults)
  ): PurchaseFormRawValue | PartialWithRequiredKeyOf<NewPurchaseFormRawValue> {
    return {
      ...purchase,
      purchaseTime: purchase.purchaseTime ? purchase.purchaseTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
