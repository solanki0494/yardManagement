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
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from '../../product/service/product.service';

@Component({
  selector: 'jhi-loading-update',
  templateUrl: './loading-update.component.html',
})
export class LoadingUpdateComponent implements OnInit {
  isSaving = false;
  loading: ILoading | null = null;
  products: any[] = [];

  editForm: LoadingFormGroup = this.loadingFormService.createLoadingFormGroup();

  constructor(
    protected loadingService: LoadingService,
    protected productService: ProductService,
    protected loadingFormService: LoadingFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loading }) => {
      this.loading = loading;
      if (loading) {
        this.updateForm(loading);
      }
    });
    this.productService.getAll().subscribe(
      value =>
        (this.products =
          value.body?.map(v => ({
            id: 0,
            product: v,
          })) ?? [])
    );
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
  }
}
