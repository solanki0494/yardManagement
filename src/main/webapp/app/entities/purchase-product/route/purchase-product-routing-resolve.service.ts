import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPurchaseProduct } from '../purchase-product.model';
import { PurchaseProductService } from '../service/purchase-product.service';

@Injectable({ providedIn: 'root' })
export class PurchaseProductRoutingResolveService implements Resolve<IPurchaseProduct | null> {
  constructor(protected service: PurchaseProductService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPurchaseProduct | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((purchaseProduct: HttpResponse<IPurchaseProduct>) => {
          if (purchaseProduct.body) {
            return of(purchaseProduct.body);
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
