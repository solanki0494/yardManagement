import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILoading } from '../loading.model';
import { LoadingService } from '../service/loading.service';

@Injectable({ providedIn: 'root' })
export class LoadingRoutingResolveService implements Resolve<ILoading | null> {
  constructor(protected service: LoadingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILoading | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((loading: HttpResponse<ILoading>) => {
          if (loading.body) {
            return of(loading.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
