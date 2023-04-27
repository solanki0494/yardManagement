import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LoadingProductFormService } from './loading-product-form.service';
import { LoadingProductService } from '../service/loading-product.service';
import { ILoadingProduct } from '../loading-product.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ILoading } from 'app/entities/loading/loading.model';
import { LoadingService } from 'app/entities/loading/service/loading.service';

import { LoadingProductUpdateComponent } from './loading-product-update.component';

describe('LoadingProduct Management Update Component', () => {
  let comp: LoadingProductUpdateComponent;
  let fixture: ComponentFixture<LoadingProductUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let loadingProductFormService: LoadingProductFormService;
  let loadingProductService: LoadingProductService;
  let productService: ProductService;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LoadingProductUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LoadingProductUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoadingProductUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    loadingProductFormService = TestBed.inject(LoadingProductFormService);
    loadingProductService = TestBed.inject(LoadingProductService);
    productService = TestBed.inject(ProductService);
    loadingService = TestBed.inject(LoadingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const loadingProduct: ILoadingProduct = { id: 456 };
      const product: IProduct = { id: 77600 };
      loadingProduct.product = product;

      const productCollection: IProduct[] = [{ id: 85143 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ loadingProduct });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(
        productCollection,
        ...additionalProducts.map(expect.objectContaining)
      );
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Loading query and add missing value', () => {
      const loadingProduct: ILoadingProduct = { id: 456 };
      const loading: ILoading = { id: 40212 };
      loadingProduct.loading = loading;

      const loadingCollection: ILoading[] = [{ id: 23732 }];
      jest.spyOn(loadingService, 'query').mockReturnValue(of(new HttpResponse({ body: loadingCollection })));
      const additionalLoadings = [loading];
      const expectedCollection: ILoading[] = [...additionalLoadings, ...loadingCollection];
      jest.spyOn(loadingService, 'addLoadingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ loadingProduct });
      comp.ngOnInit();

      expect(loadingService.query).toHaveBeenCalled();
      expect(loadingService.addLoadingToCollectionIfMissing).toHaveBeenCalledWith(
        loadingCollection,
        ...additionalLoadings.map(expect.objectContaining)
      );
      expect(comp.loadingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const loadingProduct: ILoadingProduct = { id: 456 };
      const product: IProduct = { id: 21199 };
      loadingProduct.product = product;
      const loading: ILoading = { id: 65814 };
      loadingProduct.loading = loading;

      activatedRoute.data = of({ loadingProduct });
      comp.ngOnInit();

      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.loadingsSharedCollection).toContain(loading);
      expect(comp.loadingProduct).toEqual(loadingProduct);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoadingProduct>>();
      const loadingProduct = { id: 123 };
      jest.spyOn(loadingProductFormService, 'getLoadingProduct').mockReturnValue(loadingProduct);
      jest.spyOn(loadingProductService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loadingProduct });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loadingProduct }));
      saveSubject.complete();

      // THEN
      expect(loadingProductFormService.getLoadingProduct).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(loadingProductService.update).toHaveBeenCalledWith(expect.objectContaining(loadingProduct));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoadingProduct>>();
      const loadingProduct = { id: 123 };
      jest.spyOn(loadingProductFormService, 'getLoadingProduct').mockReturnValue({ id: null });
      jest.spyOn(loadingProductService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loadingProduct: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loadingProduct }));
      saveSubject.complete();

      // THEN
      expect(loadingProductFormService.getLoadingProduct).toHaveBeenCalled();
      expect(loadingProductService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoadingProduct>>();
      const loadingProduct = { id: 123 };
      jest.spyOn(loadingProductService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loadingProduct });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(loadingProductService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProduct', () => {
      it('Should forward to productService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productService, 'compareProduct');
        comp.compareProduct(entity, entity2);
        expect(productService.compareProduct).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLoading', () => {
      it('Should forward to loadingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(loadingService, 'compareLoading');
        comp.compareLoading(entity, entity2);
        expect(loadingService.compareLoading).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
