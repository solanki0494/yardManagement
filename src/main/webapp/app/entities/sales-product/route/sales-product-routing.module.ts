import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SalesProductComponent } from '../list/sales-product.component';
import { SalesProductDetailComponent } from '../detail/sales-product-detail.component';
import { SalesProductUpdateComponent } from '../update/sales-product-update.component';
import { SalesProductRoutingResolveService } from './sales-product-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const salesProductRoute: Routes = [
  {
    path: '',
    component: SalesProductComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SalesProductDetailComponent,
    resolve: {
      salesProduct: SalesProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SalesProductUpdateComponent,
    resolve: {
      salesProduct: SalesProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SalesProductUpdateComponent,
    resolve: {
      salesProduct: SalesProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(salesProductRoute)],
  exports: [RouterModule],
})
export class SalesProductRoutingModule {}
