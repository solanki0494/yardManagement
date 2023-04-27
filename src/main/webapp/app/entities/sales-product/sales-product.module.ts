import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SalesProductComponent } from './list/sales-product.component';
import { SalesProductDetailComponent } from './detail/sales-product-detail.component';
import { SalesProductUpdateComponent } from './update/sales-product-update.component';
import { SalesProductDeleteDialogComponent } from './delete/sales-product-delete-dialog.component';
import { SalesProductRoutingModule } from './route/sales-product-routing.module';

@NgModule({
  imports: [SharedModule, SalesProductRoutingModule],
  declarations: [SalesProductComponent, SalesProductDetailComponent, SalesProductUpdateComponent, SalesProductDeleteDialogComponent],
})
export class SalesProductModule {}
