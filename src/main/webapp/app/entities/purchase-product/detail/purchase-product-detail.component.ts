import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPurchaseProduct } from '../purchase-product.model';

@Component({
  selector: 'jhi-purchase-product-detail',
  templateUrl: './purchase-product-detail.component.html',
})
export class PurchaseProductDetailComponent implements OnInit {
  purchaseProduct: IPurchaseProduct | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseProduct }) => {
      this.purchaseProduct = purchaseProduct;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
