import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPurchaseProduct, NewPurchaseProduct } from '../purchase-product.model';

export type PartialUpdatePurchaseProduct = Partial<IPurchaseProduct> & Pick<IPurchaseProduct, 'id'>;

export type EntityResponseType = HttpResponse<IPurchaseProduct>;
export type EntityArrayResponseType = HttpResponse<IPurchaseProduct[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseProductService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/purchase-products');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(purchaseProduct: NewPurchaseProduct): Observable<EntityResponseType> {
    return this.http.post<IPurchaseProduct>(this.resourceUrl, purchaseProduct, { observe: 'response' });
  }

  update(purchaseProduct: IPurchaseProduct): Observable<EntityResponseType> {
    return this.http.put<IPurchaseProduct>(`${this.resourceUrl}/${this.getPurchaseProductIdentifier(purchaseProduct)}`, purchaseProduct, {
      observe: 'response',
    });
  }

  partialUpdate(purchaseProduct: PartialUpdatePurchaseProduct): Observable<EntityResponseType> {
    return this.http.patch<IPurchaseProduct>(`${this.resourceUrl}/${this.getPurchaseProductIdentifier(purchaseProduct)}`, purchaseProduct, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPurchaseProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPurchaseProduct[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPurchaseProductIdentifier(purchaseProduct: Pick<IPurchaseProduct, 'id'>): number {
    return purchaseProduct.id;
  }

  comparePurchaseProduct(o1: Pick<IPurchaseProduct, 'id'> | null, o2: Pick<IPurchaseProduct, 'id'> | null): boolean {
    return o1 && o2 ? this.getPurchaseProductIdentifier(o1) === this.getPurchaseProductIdentifier(o2) : o1 === o2;
  }

  addPurchaseProductToCollectionIfMissing<Type extends Pick<IPurchaseProduct, 'id'>>(
    purchaseProductCollection: Type[],
    ...purchaseProductsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const purchaseProducts: Type[] = purchaseProductsToCheck.filter(isPresent);
    if (purchaseProducts.length > 0) {
      const purchaseProductCollectionIdentifiers = purchaseProductCollection.map(
        purchaseProductItem => this.getPurchaseProductIdentifier(purchaseProductItem)!
      );
      const purchaseProductsToAdd = purchaseProducts.filter(purchaseProductItem => {
        const purchaseProductIdentifier = this.getPurchaseProductIdentifier(purchaseProductItem);
        if (purchaseProductCollectionIdentifiers.includes(purchaseProductIdentifier)) {
          return false;
        }
        purchaseProductCollectionIdentifiers.push(purchaseProductIdentifier);
        return true;
      });
      return [...purchaseProductsToAdd, ...purchaseProductCollection];
    }
    return purchaseProductCollection;
  }
}
