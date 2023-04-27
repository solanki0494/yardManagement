import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PurchaseFormService, PurchaseFormGroup } from './purchase-form.service';
import { IPurchase } from '../purchase.model';
import { PurchaseService } from '../service/purchase.service';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';

@Component({
  selector: 'jhi-purchase-update',
  templateUrl: './purchase-update.component.html',
})
export class PurchaseUpdateComponent implements OnInit {
  isSaving = false;
  purchase: IPurchase | null = null;

  invoicesCollection: IInvoice[] = [];

  editForm: PurchaseFormGroup = this.purchaseFormService.createPurchaseFormGroup();

  constructor(
    protected purchaseService: PurchaseService,
    protected purchaseFormService: PurchaseFormService,
    protected invoiceService: InvoiceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareInvoice = (o1: IInvoice | null, o2: IInvoice | null): boolean => this.invoiceService.compareInvoice(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchase }) => {
      this.purchase = purchase;
      if (purchase) {
        this.updateForm(purchase);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchase = this.purchaseFormService.getPurchase(this.editForm);
    if (purchase.id !== null) {
      this.subscribeToSaveResponse(this.purchaseService.update(purchase));
    } else {
      this.subscribeToSaveResponse(this.purchaseService.create(purchase));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchase>>): void {
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

  protected updateForm(purchase: IPurchase): void {
    this.purchase = purchase;
    this.purchaseFormService.resetForm(this.editForm, purchase);

    this.invoicesCollection = this.invoiceService.addInvoiceToCollectionIfMissing<IInvoice>(this.invoicesCollection, purchase.invoice);
  }

  protected loadRelationshipsOptions(): void {
    this.invoiceService
      .query({ filter: 'purchase-is-null' })
      .pipe(map((res: HttpResponse<IInvoice[]>) => res.body ?? []))
      .pipe(map((invoices: IInvoice[]) => this.invoiceService.addInvoiceToCollectionIfMissing<IInvoice>(invoices, this.purchase?.invoice)))
      .subscribe((invoices: IInvoice[]) => (this.invoicesCollection = invoices));
  }
}
