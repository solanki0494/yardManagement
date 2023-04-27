import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SalesProductFormService } from './sales-product-form.service';
import { SalesProductService } from '../service/sales-product.service';
import { ISalesProduct } from '../sales-product.model';
import { ISales } from 'app/entities/sales/sales.model';
import { SalesService } from 'app/entities/sales/service/sales.service';

import { SalesProductUpdateComponent } from './sales-product-update.component';

describe('SalesProduct Management Update Component', () => {
  let comp: SalesProductUpdateComponent;
  let fixture: ComponentFixture<SalesProductUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let salesProductFormService: SalesProductFormService;
  let salesProductService: SalesProductService;
  let salesService: SalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SalesProductUpdateComponent],
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
      .overrideTemplate(SalesProductUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalesProductUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    salesProductFormService = TestBed.inject(SalesProductFormService);
    salesProductService = TestBed.inject(SalesProductService);
    salesService = TestBed.inject(SalesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Sales query and add missing value', () => {
      const salesProduct: ISalesProduct = { id: 456 };
      const sales: ISales = { id: 99017 };
      salesProduct.sales = sales;

      const salesCollection: ISales[] = [{ id: 52369 }];
      jest.spyOn(salesService, 'query').mockReturnValue(of(new HttpResponse({ body: salesCollection })));
      const additionalSales = [sales];
      const expectedCollection: ISales[] = [...additionalSales, ...salesCollection];
      jest.spyOn(salesService, 'addSalesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ salesProduct });
      comp.ngOnInit();

      expect(salesService.query).toHaveBeenCalled();
      expect(salesService.addSalesToCollectionIfMissing).toHaveBeenCalledWith(
        salesCollection,
        ...additionalSales.map(expect.objectContaining)
      );
      expect(comp.salesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const salesProduct: ISalesProduct = { id: 456 };
      const sales: ISales = { id: 57901 };
      salesProduct.sales = sales;

      activatedRoute.data = of({ salesProduct });
      comp.ngOnInit();

      expect(comp.salesSharedCollection).toContain(sales);
      expect(comp.salesProduct).toEqual(salesProduct);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISalesProduct>>();
      const salesProduct = { id: 123 };
      jest.spyOn(salesProductFormService, 'getSalesProduct').mockReturnValue(salesProduct);
      jest.spyOn(salesProductService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salesProduct });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: salesProduct }));
      saveSubject.complete();

      // THEN
      expect(salesProductFormService.getSalesProduct).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(salesProductService.update).toHaveBeenCalledWith(expect.objectContaining(salesProduct));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISalesProduct>>();
      const salesProduct = { id: 123 };
      jest.spyOn(salesProductFormService, 'getSalesProduct').mockReturnValue({ id: null });
      jest.spyOn(salesProductService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salesProduct: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: salesProduct }));
      saveSubject.complete();

      // THEN
      expect(salesProductFormService.getSalesProduct).toHaveBeenCalled();
      expect(salesProductService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISalesProduct>>();
      const salesProduct = { id: 123 };
      jest.spyOn(salesProductService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salesProduct });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(salesProductService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSales', () => {
      it('Should forward to salesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(salesService, 'compareSales');
        comp.compareSales(entity, entity2);
        expect(salesService.compareSales).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
