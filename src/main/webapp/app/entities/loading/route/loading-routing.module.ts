import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LoadingComponent } from '../list/loading.component';
import { LoadingDetailComponent } from '../detail/loading-detail.component';
import { LoadingUpdateComponent } from '../update/loading-update.component';
import { LoadingRoutingResolveService } from './loading-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const loadingRoute: Routes = [
  {
    path: '',
    component: LoadingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LoadingDetailComponent,
    resolve: {
      loading: LoadingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LoadingUpdateComponent,
    resolve: {
      loading: LoadingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LoadingUpdateComponent,
    resolve: {
      loading: LoadingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(loadingRoute)],
  exports: [RouterModule],
})
export class LoadingRoutingModule {}
