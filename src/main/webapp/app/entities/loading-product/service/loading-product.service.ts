import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILoadingProduct, NewLoadingProduct } from '../loading-product.model';

export type PartialUpdateLoadingProduct = Partial<ILoadingProduct> & Pick<ILoadingProduct, 'id'>;

export type EntityResponseType = HttpResponse<ILoadingProduct>;
export type EntityArrayResponseType = HttpResponse<ILoadingProduct[]>;

@Injectable({ providedIn: 'root' })
export class LoadingProductService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/loading-products');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(loadingProduct: NewLoadingProduct): Observable<EntityResponseType> {
    return this.http.post<ILoadingProduct>(this.resourceUrl, loadingProduct, { observe: 'response' });
  }

  update(loadingProduct: ILoadingProduct): Observable<EntityResponseType> {
    return this.http.put<ILoadingProduct>(`${this.resourceUrl}/${this.getLoadingProductIdentifier(loadingProduct)}`, loadingProduct, {
      observe: 'response',
    });
  }

  partialUpdate(loadingProduct: PartialUpdateLoadingProduct): Observable<EntityResponseType> {
    return this.http.patch<ILoadingProduct>(`${this.resourceUrl}/${this.getLoadingProductIdentifier(loadingProduct)}`, loadingProduct, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILoadingProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILoadingProduct[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLoadingProductIdentifier(loadingProduct: Pick<ILoadingProduct, 'id'>): number {
    return loadingProduct.id;
  }

  compareLoadingProduct(o1: Pick<ILoadingProduct, 'id'> | null, o2: Pick<ILoadingProduct, 'id'> | null): boolean {
    return o1 && o2 ? this.getLoadingProductIdentifier(o1) === this.getLoadingProductIdentifier(o2) : o1 === o2;
  }

  addLoadingProductToCollectionIfMissing<Type extends Pick<ILoadingProduct, 'id'>>(
    loadingProductCollection: Type[],
    ...loadingProductsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const loadingProducts: Type[] = loadingProductsToCheck.filter(isPresent);
    if (loadingProducts.length > 0) {
      const loadingProductCollectionIdentifiers = loadingProductCollection.map(
        loadingProductItem => this.getLoadingProductIdentifier(loadingProductItem)!
      );
      const loadingProductsToAdd = loadingProducts.filter(loadingProductItem => {
        const loadingProductIdentifier = this.getLoadingProductIdentifier(loadingProductItem);
        if (loadingProductCollectionIdentifiers.includes(loadingProductIdentifier)) {
          return false;
        }
        loadingProductCollectionIdentifiers.push(loadingProductIdentifier);
        return true;
      });
      return [...loadingProductsToAdd, ...loadingProductCollection];
    }
    return loadingProductCollection;
  }
}
