import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';

import { ILoading } from '../loading.model';
import { ILoadingProduct } from 'app/entities/loading-product/loading-product.model';
import { LoadingProductService } from 'app/entities/loading-product/service/loading-product.service';
import { SortService } from 'app/shared/sort/sort.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EntityArrayResponseType } from '../service/loading.service';
import { Observable, combineLatest, switchMap, tap } from 'rxjs';
import { ASC } from 'app/config/navigation.constants';
import { DESC } from 'app/config/navigation.constants';
import { DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { SORT } from 'app/config/navigation.constants';

@Component({
  selector: 'jhi-loading-detail',
  templateUrl: './loading-detail.component.html',
})
export class LoadingDetailComponent implements OnInit {
  loadingProducts?: ILoadingProduct[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  loading: ILoading | null = null;

  constructor(
    protected loadingProductService: LoadingProductService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loading }) => {
      this.loading = loading;
      this.load();
    });
  }

  trackId = (_index: number, item: ILoadingProduct): number => this.loadingProductService.getLoadingProductIdentifier(item);

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.loadingProducts = this.refineData(dataFromBody);
  }

  protected refineData(data: ILoadingProduct[]): ILoadingProduct[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ILoadingProduct[] | null): ILoadingProduct[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.loadingProductService.query(this.loading?.id || 0, queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  previousState(): void {
    window.history.back();
  }
}
