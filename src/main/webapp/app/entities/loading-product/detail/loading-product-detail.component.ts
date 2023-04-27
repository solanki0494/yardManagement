import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILoadingProduct } from '../loading-product.model';

@Component({
  selector: 'jhi-loading-product-detail',
  templateUrl: './loading-product-detail.component.html',
})
export class LoadingProductDetailComponent implements OnInit {
  loadingProduct: ILoadingProduct | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loadingProduct }) => {
      this.loadingProduct = loadingProduct;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
