import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILoadingProduct } from '../loading-product.model';
import { LoadingProductService } from '../service/loading-product.service';

@Injectable({ providedIn: 'root' })
export class LoadingProductRoutingResolveService implements Resolve<ILoadingProduct | null> {
  constructor(protected service: LoadingProductService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILoadingProduct | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((loadingProduct: HttpResponse<ILoadingProduct>) => {
          if (loadingProduct.body) {
            return of(loadingProduct.body);
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
