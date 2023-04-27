import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISales } from '../sales.model';
import { SalesService } from '../service/sales.service';

@Injectable({ providedIn: 'root' })
export class SalesRoutingResolveService implements Resolve<ISales | null> {
  constructor(protected service: SalesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISales | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sales: HttpResponse<ISales>) => {
          if (sales.body) {
            return of(sales.body);
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
