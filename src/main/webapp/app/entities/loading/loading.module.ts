import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LoadingComponent } from './list/loading.component';
import { LoadingDetailComponent } from './detail/loading-detail.component';
import { LoadingUpdateComponent } from './update/loading-update.component';
import { LoadingDeleteDialogComponent } from './delete/loading-delete-dialog.component';
import { LoadingRoutingModule } from './route/loading-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  imports: [SharedModule, LoadingRoutingModule, CalendarModule, CheckboxModule],
  declarations: [LoadingComponent, LoadingDetailComponent, LoadingUpdateComponent, LoadingDeleteDialogComponent],
})
export class LoadingModule {}
