import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProductFormService, ProductFormGroup } from './product-form.service';
import { IProduct } from '../product.model';
import { ProductService } from '../service/product.service';
import { IInventory } from 'app/entities/inventory/inventory.model';
import { InventoryService } from 'app/entities/inventory/service/inventory.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  product: IProduct | null = null;

  inventoriesSharedCollection: IInventory[] = [];

  editForm: ProductFormGroup = this.productFormService.createProductFormGroup();

  constructor(
    protected productService: ProductService,
    protected productFormService: ProductFormService,
    protected inventoryService: InventoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareInventory = (o1: IInventory | null, o2: IInventory | null): boolean => this.inventoryService.compareInventory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
      if (product) {
        this.updateForm(product);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.productFormService.getProduct(this.editForm);
    if (product.id !== null) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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

  protected updateForm(product: IProduct): void {
    this.product = product;
    this.productFormService.resetForm(this.editForm, product);

    this.inventoriesSharedCollection = this.inventoryService.addInventoryToCollectionIfMissing<IInventory>(
      this.inventoriesSharedCollection,
      product.inventory
    );
  }

  protected loadRelationshipsOptions(): void {
    this.inventoryService
      .query()
      .pipe(map((res: HttpResponse<IInventory[]>) => res.body ?? []))
      .pipe(
        map((inventories: IInventory[]) =>
          this.inventoryService.addInventoryToCollectionIfMissing<IInventory>(inventories, this.product?.inventory)
        )
      )
      .subscribe((inventories: IInventory[]) => (this.inventoriesSharedCollection = inventories));
  }
}
