import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SalesFormService, SalesFormGroup } from './sales-form.service';
import { ISales } from '../sales.model';
import { SalesService } from '../service/sales.service';

@Component({
  selector: 'jhi-sales-update',
  templateUrl: './sales-update.component.html',
})
export class SalesUpdateComponent implements OnInit {
  isSaving = false;
  sales: ISales | null = null;

  editForm: SalesFormGroup = this.salesFormService.createSalesFormGroup();

  constructor(
    protected salesService: SalesService,
    protected salesFormService: SalesFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sales }) => {
      this.sales = sales;
      if (sales) {
        this.updateForm(sales);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sales = this.salesFormService.getSales(this.editForm);
    if (sales.id !== null) {
      this.subscribeToSaveResponse(this.salesService.update(sales));
    } else {
      this.subscribeToSaveResponse(this.salesService.create(sales));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISales>>): void {
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

  protected updateForm(sales: ISales): void {
    this.sales = sales;
    this.salesFormService.resetForm(this.editForm, sales);
  }
}
