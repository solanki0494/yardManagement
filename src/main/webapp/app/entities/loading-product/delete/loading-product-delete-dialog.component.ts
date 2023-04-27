import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILoadingProduct } from '../loading-product.model';
import { LoadingProductService } from '../service/loading-product.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './loading-product-delete-dialog.component.html',
})
export class LoadingProductDeleteDialogComponent {
  loadingProduct?: ILoadingProduct;

  constructor(protected loadingProductService: LoadingProductService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.loadingProductService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
