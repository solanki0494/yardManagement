import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISales, NewSales } from '../sales.model';

export type PartialUpdateSales = Partial<ISales> & Pick<ISales, 'id'>;

type RestOf<T extends ISales | NewSales> = Omit<T, 'saleTime'> & {
  saleTime?: string | null;
};

export type RestSales = RestOf<ISales>;

export type NewRestSales = RestOf<NewSales>;

export type PartialUpdateRestSales = RestOf<PartialUpdateSales>;

export type EntityResponseType = HttpResponse<ISales>;
export type EntityArrayResponseType = HttpResponse<ISales[]>;

@Injectable({ providedIn: 'root' })
export class SalesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sales');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sales: NewSales): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sales);
    return this.http.post<RestSales>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(sales: ISales): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sales);
    return this.http
      .put<RestSales>(`${this.resourceUrl}/${this.getSalesIdentifier(sales)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(sales: PartialUpdateSales): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sales);
    return this.http
      .patch<RestSales>(`${this.resourceUrl}/${this.getSalesIdentifier(sales)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSales>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSales[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSalesIdentifier(sales: Pick<ISales, 'id'>): number {
    return sales.id;
  }

  compareSales(o1: Pick<ISales, 'id'> | null, o2: Pick<ISales, 'id'> | null): boolean {
    return o1 && o2 ? this.getSalesIdentifier(o1) === this.getSalesIdentifier(o2) : o1 === o2;
  }

  addSalesToCollectionIfMissing<Type extends Pick<ISales, 'id'>>(
    salesCollection: Type[],
    ...salesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sales: Type[] = salesToCheck.filter(isPresent);
    if (sales.length > 0) {
      const salesCollectionIdentifiers = salesCollection.map(salesItem => this.getSalesIdentifier(salesItem)!);
      const salesToAdd = sales.filter(salesItem => {
        const salesIdentifier = this.getSalesIdentifier(salesItem);
        if (salesCollectionIdentifiers.includes(salesIdentifier)) {
          return false;
        }
        salesCollectionIdentifiers.push(salesIdentifier);
        return true;
      });
      return [...salesToAdd, ...salesCollection];
    }
    return salesCollection;
  }

  protected convertDateFromClient<T extends ISales | NewSales | PartialUpdateSales>(sales: T): RestOf<T> {
    return {
      ...sales,
      saleTime: sales.saleTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSales: RestSales): ISales {
    return {
      ...restSales,
      saleTime: restSales.saleTime ? dayjs(restSales.saleTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSales>): HttpResponse<ISales> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSales[]>): HttpResponse<ISales[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
