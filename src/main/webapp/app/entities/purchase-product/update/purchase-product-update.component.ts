import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PurchaseProductFormService, PurchaseProductFormGroup } from './purchase-product-form.service';
import { IPurchaseProduct } from '../purchase-product.model';
import { PurchaseProductService } from '../service/purchase-product.service';
import { IPurchase } from 'app/entities/purchase/purchase.model';
import { PurchaseService } from 'app/entities/purchase/service/purchase.service';

@Component({
  selector: 'jhi-purchase-product-update',
  templateUrl: './purchase-product-update.component.html',
})
export class PurchaseProductUpdateComponent implements OnInit {
  isSaving = false;
  purchaseProduct: IPurchaseProduct | null = null;

  purchasesSharedCollection: IPurchase[] = [];

  editForm: PurchaseProductFormGroup = this.purchaseProductFormService.createPurchaseProductFormGroup();

  constructor(
    protected purchaseProductService: PurchaseProductService,
    protected purchaseProductFormService: PurchaseProductFormService,
    protected purchaseService: PurchaseService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePurchase = (o1: IPurchase | null, o2: IPurchase | null): boolean => this.purchaseService.comparePurchase(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseProduct }) => {
      this.purchaseProduct = purchaseProduct;
      if (purchaseProduct) {
        this.updateForm(purchaseProduct);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchaseProduct = this.purchaseProductFormService.getPurchaseProduct(this.editForm);
    if (purchaseProduct.id !== null) {
      this.subscribeToSaveResponse(this.purchaseProductService.update(purchaseProduct));
    } else {
      this.subscribeToSaveResponse(this.purchaseProductService.create(purchaseProduct));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchaseProduct>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(purchaseProduct: IPurchaseProduct): void {
    this.purchaseProduct = purchaseProduct;
    this.purchaseProductFormService.resetForm(this.editForm, purchaseProduct);

    this.purchasesSharedCollection = this.purchaseService.addPurchaseToCollectionIfMissing<IPurchase>(
      this.purchasesSharedCollection,
      purchaseProduct.purchase
    );
  }

  protected loadRelationshipsOptions(): void {
    this.purchaseService
      .query()
      .pipe(map((res: HttpResponse<IPurchase[]>) => res.body ?? []))
      .pipe(
        map((purchases: IPurchase[]) =>
          this.purchaseService.addPurchaseToCollectionIfMissing<IPurchase>(purchases, this.purchaseProduct?.purchase)
        )
      )
      .subscribe((purchases: IPurchase[]) => (this.purchasesSharedCollection = purchases));
  }
}
