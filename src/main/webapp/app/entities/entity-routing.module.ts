import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        data: { pageTitle: 'yardManagementApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'loading',
        data: { pageTitle: 'yardManagementApp.loading.home.title' },
        loadChildren: () => import('./loading/loading.module').then(m => m.LoadingModule),
      },
      {
        path: 'loading-product',
        data: { pageTitle: 'yardManagementApp.loadingProduct.home.title' },
        loadChildren: () => import('./loading-product/loading-product.module').then(m => m.LoadingProductModule),
      },
      {
        path: 'purchase',
        data: { pageTitle: 'yardManagementApp.purchase.home.title' },
        loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule),
      },
      {
        path: 'purchase-product',
        data: { pageTitle: 'yardManagementApp.purchaseProduct.home.title' },
        loadChildren: () => import('./purchase-product/purchase-product.module').then(m => m.PurchaseProductModule),
      },
      {
        path: 'invoice',
        data: { pageTitle: 'yardManagementApp.invoice.home.title' },
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule),
      },
      {
        path: 'inventory',
        data: { pageTitle: 'yardManagementApp.inventory.home.title' },
        loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
      },
      {
        path: 'sales',
        data: { pageTitle: 'yardManagementApp.sales.home.title' },
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
      },
      {
        path: 'sales-product',
        data: { pageTitle: 'yardManagementApp.salesProduct.home.title' },
        loadChildren: () => import('./sales-product/sales-product.module').then(m => m.SalesProductModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
