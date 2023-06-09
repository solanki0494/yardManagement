import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { InventoryFormService, InventoryFormGroup } from './inventory-form.service';
import { IInventory } from '../inventory.model';
import { InventoryService } from '../service/inventory.service';

@Component({
  selector: 'jhi-inventory-update',
  templateUrl: './inventory-update.component.html',
})
export class InventoryUpdateComponent implements OnInit {
  isSaving = false;
  inventory: IInventory | null = null;

  editForm: InventoryFormGroup = this.inventoryFormService.createInventoryFormGroup();

  constructor(
    protected inventoryService: InventoryService,
    protected inventoryFormService: InventoryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inventory }) => {
      this.inventory = inventory;
      if (inventory) {
        this.updateForm(inventory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const inventory = this.inventoryFormService.getInventory(this.editForm);
    if (inventory.id !== null) {
      this.subscribeToSaveResponse(this.inventoryService.update(inventory));
    } else {
      this.subscribeToSaveResponse(this.inventoryService.create(inventory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInventory>>): void {
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

  protected updateForm(inventory: IInventory): void {
    this.inventory = inventory;
    this.inventoryFormService.resetForm(this.editForm, inventory);
  }
}
