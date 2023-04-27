import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISalesProduct, NewSalesProduct } from '../sales-product.model';

export type PartialUpdateSalesProduct = Partial<ISalesProduct> & Pick<ISalesProduct, 'id'>;

export type EntityResponseType = HttpResponse<ISalesProduct>;
export type EntityArrayResponseType = HttpResponse<ISalesProduct[]>;

@Injectable({ providedIn: 'root' })
export class SalesProductService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sales-products');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(salesProduct: NewSalesProduct): Observable<EntityResponseType> {
    return this.http.post<ISalesProduct>(this.resourceUrl, salesProduct, { observe: 'response' });
  }

  update(salesProduct: ISalesProduct): Observable<EntityResponseType> {
    return this.http.put<ISalesProduct>(`${this.resourceUrl}/${this.getSalesProductIdentifier(salesProduct)}`, salesProduct, {
      observe: 'response',
    });
  }

  partialUpdate(salesProduct: PartialUpdateSalesProduct): Observable<EntityResponseType> {
    return this.http.patch<ISalesProduct>(`${this.resourceUrl}/${this.getSalesProductIdentifier(salesProduct)}`, salesProduct, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISalesProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISalesProduct[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSalesProductIdentifier(salesProduct: Pick<ISalesProduct, 'id'>): number {
    return salesProduct.id;
  }

  compareSalesProduct(o1: Pick<ISalesProduct, 'id'> | null, o2: Pick<ISalesProduct, 'id'> | null): boolean {
    return o1 && o2 ? this.getSalesProductIdentifier(o1) === this.getSalesProductIdentifier(o2) : o1 === o2;
  }

  addSalesProductToCollectionIfMissing<Type extends Pick<ISalesProduct, 'id'>>(
    salesProductCollection: Type[],
    ...salesProductsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const salesProducts: Type[] = salesProductsToCheck.filter(isPresent);
    if (salesProducts.length > 0) {
      const salesProductCollectionIdentifiers = salesProductCollection.map(
        salesProductItem => this.getSalesProductIdentifier(salesProductItem)!
      );
      const salesProductsToAdd = salesProducts.filter(salesProductItem => {
        const salesProductIdentifier = this.getSalesProductIdentifier(salesProductItem);
        if (salesProductCollectionIdentifiers.includes(salesProductIdentifier)) {
          return false;
        }
        salesProductCollectionIdentifiers.push(salesProductIdentifier);
        return true;
      });
      return [...salesProductsToAdd, ...salesProductCollection];
    }
    return salesProductCollection;
  }
}
