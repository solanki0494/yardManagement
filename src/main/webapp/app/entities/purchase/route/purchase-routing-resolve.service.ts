import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPurchase } from '../purchase.model';
import { PurchaseService } from '../service/purchase.service';

@Injectable({ providedIn: 'root' })
export class PurchaseRoutingResolveService implements Resolve<IPurchase | null> {
  constructor(protected service: PurchaseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPurchase | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((purchase: HttpResponse<IPurchase>) => {
          if (purchase.body) {
            return of(purchase.body);
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
