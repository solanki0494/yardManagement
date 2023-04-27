import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LoadingFormService, LoadingFormGroup } from './loading-form.service';
import { ILoading } from '../loading.model';
import { LoadingService } from '../service/loading.service';
import { IPurchase } from 'app/entities/purchase/purchase.model';
import { PurchaseService } from 'app/entities/purchase/service/purchase.service';

@Component({
  selector: 'jhi-loading-update',
  templateUrl: './loading-update.component.html',
})
export class LoadingUpdateComponent implements OnInit {
  isSaving = false;
  loading: ILoading | null = null;

  purchasesCollection: IPurchase[] = [];

  editForm: LoadingFormGroup = this.loadingFormService.createLoadingFormGroup();

  constructor(
    protected loadingService: LoadingService,
    protected loadingFormService: LoadingFormService,
    protected purchaseService: PurchaseService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePurchase = (o1: IPurchase | null, o2: IPurchase | null): boolean => this.purchaseService.comparePurchase(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loading }) => {
      this.loading = loading;
      if (loading) {
        this.updateForm(loading);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const loading = this.loadingFormService.getLoading(this.editForm);
    if (loading.id !== null) {
      this.subscribeToSaveResponse(this.loadingService.update(loading));
    } else {
      this.subscribeToSaveResponse(this.loadingService.create(loading));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoading>>): void {
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

  protected updateForm(loading: ILoading): void {
    this.loading = loading;
    this.loadingFormService.resetForm(this.editForm, loading);

    this.purchasesCollection = this.purchaseService.addPurchaseToCollectionIfMissing<IPurchase>(this.purchasesCollection, loading.purchase);
  }

  protected loadRelationshipsOptions(): void {
    this.purchaseService
      .query({ filter: 'loading-is-null' })
      .pipe(map((res: HttpResponse<IPurchase[]>) => res.body ?? []))
      .pipe(
        map((purchases: IPurchase[]) => this.purchaseService.addPurchaseToCollectionIfMissing<IPurchase>(purchases, this.loading?.purchase))
      )
      .subscribe((purchases: IPurchase[]) => (this.purchasesCollection = purchases));
  }
}
