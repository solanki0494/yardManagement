import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISalesProduct } from '../sales-product.model';
import { SalesProductService } from '../service/sales-product.service';

@Injectable({ providedIn: 'root' })
export class SalesProductRoutingResolveService implements Resolve<ISalesProduct | null> {
  constructor(protected service: SalesProductService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISalesProduct | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((salesProduct: HttpResponse<ISalesProduct>) => {
          if (salesProduct.body) {
            return of(salesProduct.body);
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
