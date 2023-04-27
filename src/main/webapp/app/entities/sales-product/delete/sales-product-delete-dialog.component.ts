import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISalesProduct } from '../sales-product.model';
import { SalesProductService } from '../service/sales-product.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './sales-product-delete-dialog.component.html',
})
export class SalesProductDeleteDialogComponent {
  salesProduct?: ISalesProduct;

  constructor(protected salesProductService: SalesProductService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.salesProductService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
