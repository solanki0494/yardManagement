import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SalesProductFormService, SalesProductFormGroup } from './sales-product-form.service';
import { ISalesProduct } from '../sales-product.model';
import { SalesProductService } from '../service/sales-product.service';
import { ISales } from 'app/entities/sales/sales.model';
import { SalesService } from 'app/entities/sales/service/sales.service';

@Component({
  selector: 'jhi-sales-product-update',
  templateUrl: './sales-product-update.component.html',
})
export class SalesProductUpdateComponent implements OnInit {
  isSaving = false;
  salesProduct: ISalesProduct | null = null;

  salesSharedCollection: ISales[] = [];

  editForm: SalesProductFormGroup = this.salesProductFormService.createSalesProductFormGroup();

  constructor(
    protected salesProductService: SalesProductService,
    protected salesProductFormService: SalesProductFormService,
    protected salesService: SalesService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSales = (o1: ISales | null, o2: ISales | null): boolean => this.salesService.compareSales(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salesProduct }) => {
      this.salesProduct = salesProduct;
      if (salesProduct) {
        this.updateForm(salesProduct);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const salesProduct = this.salesProductFormService.getSalesProduct(this.editForm);
    if (salesProduct.id !== null) {
      this.subscribeToSaveResponse(this.salesProductService.update(salesProduct));
    } else {
      this.subscribeToSaveResponse(this.salesProductService.create(salesProduct));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISalesProduct>>): void {
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

  protected updateForm(salesProduct: ISalesProduct): void {
    this.salesProduct = salesProduct;
    this.salesProductFormService.resetForm(this.editForm, salesProduct);

    this.salesSharedCollection = this.salesService.addSalesToCollectionIfMissing<ISales>(this.salesSharedCollection, salesProduct.sales);
  }

  protected loadRelationshipsOptions(): void {
    this.salesService
      .query()
      .pipe(map((res: HttpResponse<ISales[]>) => res.body ?? []))
      .pipe(map((sales: ISales[]) => this.salesService.addSalesToCollectionIfMissing<ISales>(sales, this.salesProduct?.sales)))
      .subscribe((sales: ISales[]) => (this.salesSharedCollection = sales));
  }
}
