import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LoadingProductComponent } from './list/loading-product.component';
import { LoadingProductDetailComponent } from './detail/loading-product-detail.component';
import { LoadingProductUpdateComponent } from './update/loading-product-update.component';
import { LoadingProductDeleteDialogComponent } from './delete/loading-product-delete-dialog.component';
import { LoadingProductRoutingModule } from './route/loading-product-routing.module';

@NgModule({
  imports: [SharedModule, LoadingProductRoutingModule],
  declarations: [
    LoadingProductComponent,
    LoadingProductDetailComponent,
    LoadingProductUpdateComponent,
    LoadingProductDeleteDialogComponent,
  ],
})
export class LoadingProductModule {}
