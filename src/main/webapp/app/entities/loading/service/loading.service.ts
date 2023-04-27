import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILoading, NewLoading } from '../loading.model';

export type PartialUpdateLoading = Partial<ILoading> & Pick<ILoading, 'id'>;

type RestOf<T extends ILoading | NewLoading> = Omit<T, 'loadingTime'> & {
  loadingTime?: string | null;
};

export type RestLoading = RestOf<ILoading>;

export type NewRestLoading = RestOf<NewLoading>;

export type PartialUpdateRestLoading = RestOf<PartialUpdateLoading>;

export type EntityResponseType = HttpResponse<ILoading>;
export type EntityArrayResponseType = HttpResponse<ILoading[]>;

@Injectable({ providedIn: 'root' })
export class LoadingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/loadings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(loading: NewLoading): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loading);
    return this.http
      .post<RestLoading>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(loading: ILoading): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loading);
    return this.http
      .put<RestLoading>(`${this.resourceUrl}/${this.getLoadingIdentifier(loading)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(loading: PartialUpdateLoading): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loading);
    return this.http
      .patch<RestLoading>(`${this.resourceUrl}/${this.getLoadingIdentifier(loading)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLoading>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLoading[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLoadingIdentifier(loading: Pick<ILoading, 'id'>): number {
    return loading.id;
  }

  compareLoading(o1: Pick<ILoading, 'id'> | null, o2: Pick<ILoading, 'id'> | null): boolean {
    return o1 && o2 ? this.getLoadingIdentifier(o1) === this.getLoadingIdentifier(o2) : o1 === o2;
  }

  addLoadingToCollectionIfMissing<Type extends Pick<ILoading, 'id'>>(
    loadingCollection: Type[],
    ...loadingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const loadings: Type[] = loadingsToCheck.filter(isPresent);
    if (loadings.length > 0) {
      const loadingCollectionIdentifiers = loadingCollection.map(loadingItem => this.getLoadingIdentifier(loadingItem)!);
      const loadingsToAdd = loadings.filter(loadingItem => {
        const loadingIdentifier = this.getLoadingIdentifier(loadingItem);
        if (loadingCollectionIdentifiers.includes(loadingIdentifier)) {
          return false;
        }
        loadingCollectionIdentifiers.push(loadingIdentifier);
        return true;
      });
      return [...loadingsToAdd, ...loadingCollection];
    }
    return loadingCollection;
  }

  protected convertDateFromClient<T extends ILoading | NewLoading | PartialUpdateLoading>(loading: T): RestOf<T> {
    return {
      ...loading,
      loadingTime: loading.loadingTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLoading: RestLoading): ILoading {
    return {
      ...restLoading,
      loadingTime: restLoading.loadingTime ? dayjs(restLoading.loadingTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLoading>): HttpResponse<ILoading> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLoading[]>): HttpResponse<ILoading[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
