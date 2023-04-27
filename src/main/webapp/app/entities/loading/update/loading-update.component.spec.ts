import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LoadingFormService } from './loading-form.service';
import { LoadingService } from '../service/loading.service';
import { ILoading } from '../loading.model';
import { IPurchase } from 'app/entities/purchase/purchase.model';
import { PurchaseService } from 'app/entities/purchase/service/purchase.service';

import { LoadingUpdateComponent } from './loading-update.component';

describe('Loading Management Update Component', () => {
  let comp: LoadingUpdateComponent;
  let fixture: ComponentFixture<LoadingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let loadingFormService: LoadingFormService;
  let loadingService: LoadingService;
  let purchaseService: PurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LoadingUpdateComponent],
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
      .overrideTemplate(LoadingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoadingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    loadingFormService = TestBed.inject(LoadingFormService);
    loadingService = TestBed.inject(LoadingService);
    purchaseService = TestBed.inject(PurchaseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call purchase query and add missing value', () => {
      const loading: ILoading = { id: 456 };
      const purchase: IPurchase = { id: 78246 };
      loading.purchase = purchase;

      const purchaseCollection: IPurchase[] = [{ id: 39246 }];
      jest.spyOn(purchaseService, 'query').mockReturnValue(of(new HttpResponse({ body: purchaseCollection })));
      const expectedCollection: IPurchase[] = [purchase, ...purchaseCollection];
      jest.spyOn(purchaseService, 'addPurchaseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ loading });
      comp.ngOnInit();

      expect(purchaseService.query).toHaveBeenCalled();
      expect(purchaseService.addPurchaseToCollectionIfMissing).toHaveBeenCalledWith(purchaseCollection, purchase);
      expect(comp.purchasesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const loading: ILoading = { id: 456 };
      const purchase: IPurchase = { id: 89861 };
      loading.purchase = purchase;

      activatedRoute.data = of({ loading });
      comp.ngOnInit();

      expect(comp.purchasesCollection).toContain(purchase);
      expect(comp.loading).toEqual(loading);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoading>>();
      const loading = { id: 123 };
      jest.spyOn(loadingFormService, 'getLoading').mockReturnValue(loading);
      jest.spyOn(loadingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loading });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loading }));
      saveSubject.complete();

      // THEN
      expect(loadingFormService.getLoading).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(loadingService.update).toHaveBeenCalledWith(expect.objectContaining(loading));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoading>>();
      const loading = { id: 123 };
      jest.spyOn(loadingFormService, 'getLoading').mockReturnValue({ id: null });
      jest.spyOn(loadingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loading: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loading }));
      saveSubject.complete();

      // THEN
      expect(loadingFormService.getLoading).toHaveBeenCalled();
      expect(loadingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoading>>();
      const loading = { id: 123 };
      jest.spyOn(loadingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loading });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(loadingService.update).toHaveBeenCalled();
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
