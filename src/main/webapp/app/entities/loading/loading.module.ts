import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LoadingComponent } from './list/loading.component';
import { LoadingDetailComponent } from './detail/loading-detail.component';
import { LoadingUpdateComponent } from './update/loading-update.component';
import { LoadingDeleteDialogComponent } from './delete/loading-delete-dialog.component';
import { LoadingRoutingModule } from './route/loading-routing.module';

@NgModule({
  imports: [SharedModule, LoadingRoutingModule],
  declarations: [LoadingComponent, LoadingDetailComponent, LoadingUpdateComponent, LoadingDeleteDialogComponent],
})
export class LoadingModule {}
