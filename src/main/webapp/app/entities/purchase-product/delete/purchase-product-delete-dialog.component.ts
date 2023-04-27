import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPurchaseProduct } from '../purchase-product.model';
import { PurchaseProductService } from '../service/purchase-product.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './purchase-product-delete-dialog.component.html',
})
export class PurchaseProductDeleteDialogComponent {
  purchaseProduct?: IPurchaseProduct;

  constructor(protected purchaseProductService: PurchaseProductService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.purchaseProductService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
