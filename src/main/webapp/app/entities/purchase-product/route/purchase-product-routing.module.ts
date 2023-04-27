import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PurchaseProductComponent } from '../list/purchase-product.component';
import { PurchaseProductDetailComponent } from '../detail/purchase-product-detail.component';
import { PurchaseProductUpdateComponent } from '../update/purchase-product-update.component';
import { PurchaseProductRoutingResolveService } from './purchase-product-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const purchaseProductRoute: Routes = [
  {
    path: '',
    component: PurchaseProductComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PurchaseProductDetailComponent,
    resolve: {
      purchaseProduct: PurchaseProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PurchaseProductUpdateComponent,
    resolve: {
      purchaseProduct: PurchaseProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PurchaseProductUpdateComponent,
    resolve: {
      purchaseProduct: PurchaseProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(purchaseProductRoute)],
  exports: [RouterModule],
})
export class PurchaseProductRoutingModule {}
