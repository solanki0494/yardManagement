import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISalesProduct } from '../sales-product.model';

@Component({
  selector: 'jhi-sales-product-detail',
  templateUrl: './sales-product-detail.component.html',
})
export class SalesProductDetailComponent implements OnInit {
  salesProduct: ISalesProduct | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salesProduct }) => {
      this.salesProduct = salesProduct;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
