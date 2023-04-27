import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PurchaseProductFormService } from './purchase-product-form.service';
import { PurchaseProductService } from '../service/purchase-product.service';
import { IPurchaseProduct } from '../purchase-product.model';
import { IPurchase } from 'app/entities/purchase/purchase.model';
import { PurchaseService } from 'app/entities/purchase/service/purchase.service';

import { PurchaseProductUpdateComponent } from './purchase-product-update.component';

describe('PurchaseProduct Management Update Component', () => {
  let comp: PurchaseProductUpdateComponent;
  let fixture: ComponentFixture<PurchaseProductUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let purchaseProductFormService: PurchaseProductFormService;
  let purchaseProductService: PurchaseProductService;
  let purchaseService: PurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PurchaseProductUpdateComponent],
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
      .overrideTemplate(PurchaseProductUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseProductUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    purchaseProductFormService = TestBed.inject(PurchaseProductFormService);
    purchaseProductService = TestBed.inject(PurchaseProductService);
    purchaseService = TestBed.inject(PurchaseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Purchase query and add missing value', () => {
      const purchaseProduct: IPurchaseProduct = { id: 456 };
      const purchase: IPurchase = { id: 20127 };
      purchaseProduct.purchase = purchase;

      const purchaseCollection: IPurchase[] = [{ id: 62977 }];
      jest.spyOn(purchaseService, 'query').mockReturnValue(of(new HttpResponse({ body: purchaseCollection })));
      const additionalPurchases = [purchase];
      const expectedCollection: IPurchase[] = [...additionalPurchases, ...purchaseCollection];
      jest.spyOn(purchaseService, 'addPurchaseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ purchaseProduct });
      comp.ngOnInit();

      expect(purchaseService.query).toHaveBeenCalled();
      expect(purchaseService.addPurchaseToCollectionIfMissing).toHaveBeenCalledWith(
        purchaseCollection,
        ...additionalPurchases.map(expect.objectContaining)
      );
      expect(comp.purchasesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const purchaseProduct: IPurchaseProduct = { id: 456 };
      const purchase: IPurchase = { id: 83407 };
      purchaseProduct.purchase = purchase;

      activatedRoute.data = of({ purchaseProduct });
      comp.ngOnInit();

      expect(comp.purchasesSharedCollection).toContain(purchase);
      expect(comp.purchaseProduct).toEqual(purchaseProduct);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseProduct>>();
      const purchaseProduct = { id: 123 };
      jest.spyOn(purchaseProductFormService, 'getPurchaseProduct').mockReturnValue(purchaseProduct);
      jest.spyOn(purchaseProductService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseProduct });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseProduct }));
      saveSubject.complete();

      // THEN
      expect(purchaseProductFormService.getPurchaseProduct).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(purchaseProductService.update).toHaveBeenCalledWith(expect.objectContaining(purchaseProduct));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseProduct>>();
      const purchaseProduct = { id: 123 };
      jest.spyOn(purchaseProductFormService, 'getPurchaseProduct').mockReturnValue({ id: null });
      jest.spyOn(purchaseProductService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseProduct: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseProduct }));
      saveSubject.complete();

      // THEN
      expect(purchaseProductFormService.getPurchaseProduct).toHaveBeenCalled();
      expect(purchaseProductService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseProduct>>();
      const purchaseProduct = { id: 123 };
      jest.spyOn(purchaseProductService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseProduct });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(purchaseProductService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePurchase', () => {
      it('Should forward to purchaseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(purchaseService, 'comparePurchase');
        comp.comparePurchase(entity, entity2);
        expect(purchaseService.comparePurchase).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
