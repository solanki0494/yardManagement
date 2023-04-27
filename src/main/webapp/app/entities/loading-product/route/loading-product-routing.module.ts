import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LoadingProductComponent } from '../list/loading-product.component';
import { LoadingProductDetailComponent } from '../detail/loading-product-detail.component';
import { LoadingProductUpdateComponent } from '../update/loading-product-update.component';
import { LoadingProductRoutingResolveService } from './loading-product-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const loadingProductRoute: Routes = [
  {
    path: '',
    component: LoadingProductComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LoadingProductDetailComponent,
    resolve: {
      loadingProduct: LoadingProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LoadingProductUpdateComponent,
    resolve: {
      loadingProduct: LoadingProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LoadingProductUpdateComponent,
    resolve: {
      loadingProduct: LoadingProductRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(loadingProductRoute)],
  exports: [RouterModule],
})
export class LoadingProductRoutingModule {}
