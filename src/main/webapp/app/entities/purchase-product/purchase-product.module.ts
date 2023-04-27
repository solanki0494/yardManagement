import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PurchaseProductComponent } from './list/purchase-product.component';
import { PurchaseProductDetailComponent } from './detail/purchase-product-detail.component';
import { PurchaseProductUpdateComponent } from './update/purchase-product-update.component';
import { PurchaseProductDeleteDialogComponent } from './delete/purchase-product-delete-dialog.component';
import { PurchaseProductRoutingModule } from './route/purchase-product-routing.module';

@NgModule({
  imports: [SharedModule, PurchaseProductRoutingModule],
  declarations: [
    PurchaseProductComponent,
    PurchaseProductDetailComponent,
    PurchaseProductUpdateComponent,
    PurchaseProductDeleteDialogComponent,
  ],
})
export class PurchaseProductModule {}
