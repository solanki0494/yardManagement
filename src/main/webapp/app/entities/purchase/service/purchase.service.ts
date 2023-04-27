import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPurchase, NewPurchase } from '../purchase.model';

export type PartialUpdatePurchase = Partial<IPurchase> & Pick<IPurchase, 'id'>;

type RestOf<T extends IPurchase | NewPurchase> = Omit<T, 'purchaseTime'> & {
  purchaseTime?: string | null;
};

export type RestPurchase = RestOf<IPurchase>;

export type NewRestPurchase = RestOf<NewPurchase>;

export type PartialUpdateRestPurchase = RestOf<PartialUpdatePurchase>;

export type EntityResponseType = HttpResponse<IPurchase>;
export type EntityArrayResponseType = HttpResponse<IPurchase[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/purchases');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(purchase: NewPurchase): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchase);
    return this.http
      .post<RestPurchase>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(purchase: IPurchase): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchase);
    return this.http
      .put<RestPurchase>(`${this.resourceUrl}/${this.getPurchaseIdentifier(purchase)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(purchase: PartialUpdatePurchase): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchase);
    return this.http
      .patch<RestPurchase>(`${this.resourceUrl}/${this.getPurchaseIdentifier(purchase)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPurchase>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPurchase[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPurchaseIdentifier(purchase: Pick<IPurchase, 'id'>): number {
    return purchase.id;
  }

  comparePurchase(o1: Pick<IPurchase, 'id'> | null, o2: Pick<IPurchase, 'id'> | null): boolean {
    return o1 && o2 ? this.getPurchaseIdentifier(o1) === this.getPurchaseIdentifier(o2) : o1 === o2;
  }

  addPurchaseToCollectionIfMissing<Type extends Pick<IPurchase, 'id'>>(
    purchaseCollection: Type[],
    ...purchasesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const purchases: Type[] = purchasesToCheck.filter(isPresent);
    if (purchases.length > 0) {
      const purchaseCollectionIdentifiers = purchaseCollection.map(purchaseItem => this.getPurchaseIdentifier(purchaseItem)!);
      const purchasesToAdd = purchases.filter(purchaseItem => {
        const purchaseIdentifier = this.getPurchaseIdentifier(purchaseItem);
        if (purchaseCollectionIdentifiers.includes(purchaseIdentifier)) {
          return false;
        }
        purchaseCollectionIdentifiers.push(purchaseIdentifier);
        return true;
      });
      return [...purchasesToAdd, ...purchaseCollection];
    }
    return purchaseCollection;
  }

  protected convertDateFromClient<T extends IPurchase | NewPurchase | PartialUpdatePurchase>(purchase: T): RestOf<T> {
    return {
      ...purchase,
      purchaseTime: purchase.purchaseTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPurchase: RestPurchase): IPurchase {
    return {
      ...restPurchase,
      purchaseTime: restPurchase.purchaseTime ? dayjs(restPurchase.purchaseTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPurchase>): HttpResponse<IPurchase> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPurchase[]>): HttpResponse<IPurchase[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
