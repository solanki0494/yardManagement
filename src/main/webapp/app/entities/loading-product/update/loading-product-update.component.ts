import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LoadingProductFormService, LoadingProductFormGroup } from './loading-product-form.service';
import { ILoadingProduct } from '../loading-product.model';
import { LoadingProductService } from '../service/loading-product.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ILoading } from 'app/entities/loading/loading.model';
import { LoadingService } from 'app/entities/loading/service/loading.service';
import { LoadingStatus } from 'app/entities/enumerations/loading-status.model';

@Component({
  selector: 'jhi-loading-product-update',
  templateUrl: './loading-product-update.component.html',
})
export class LoadingProductUpdateComponent implements OnInit {
  isSaving = false;
  loadingProduct: ILoadingProduct | null = null;
  loadingStatusValues = Object.keys(LoadingStatus);

  productsSharedCollection: IProduct[] = [];
  loadingsSharedCollection: ILoading[] = [];

  editForm: LoadingProductFormGroup = this.loadingProductFormService.createLoadingProductFormGroup();

  constructor(
    protected loadingProductService: LoadingProductService,
    protected loadingProductFormService: LoadingProductFormService,
    protected productService: ProductService,
    protected loadingService: LoadingService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProduct = (o1: IProduct | null, o2: IProduct | null): boolean => this.productService.compareProduct(o1, o2);

  compareLoading = (o1: ILoading | null, o2: ILoading | null): boolean => this.loadingService.compareLoading(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loadingProduct }) => {
      this.loadingProduct = loadingProduct;
      if (loadingProduct) {
        this.updateForm(loadingProduct);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const loadingProduct = this.loadingProductFormService.getLoadingProduct(this.editForm);
    if (loadingProduct.id !== null) {
      this.subscribeToSaveResponse(this.loadingProductService.update(loadingProduct));
    } else {
      this.subscribeToSaveResponse(this.loadingProductService.create(loadingProduct));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoadingProduct>>): void {
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

  protected updateForm(loadingProduct: ILoadingProduct): void {
    this.loadingProduct = loadingProduct;
    this.loadingProductFormService.resetForm(this.editForm, loadingProduct);

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing<IProduct>(
      this.productsSharedCollection,
      loadingProduct.product
    );
    this.loadingsSharedCollection = this.loadingService.addLoadingToCollectionIfMissing<ILoading>(
      this.loadingsSharedCollection,
      loadingProduct.loading
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing<IProduct>(products, this.loadingProduct?.product))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.loadingService
      .query()
      .pipe(map((res: HttpResponse<ILoading[]>) => res.body ?? []))
      .pipe(
        map((loadings: ILoading[]) => this.loadingService.addLoadingToCollectionIfMissing<ILoading>(loadings, this.loadingProduct?.loading))
      )
      .subscribe((loadings: ILoading[]) => (this.loadingsSharedCollection = loadings));
  }
}
