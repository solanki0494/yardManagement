import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SalesFormService } from './sales-form.service';
import { SalesService } from '../service/sales.service';
import { ISales } from '../sales.model';

import { SalesUpdateComponent } from './sales-update.component';

describe('Sales Management Update Component', () => {
  let comp: SalesUpdateComponent;
  let fixture: ComponentFixture<SalesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let salesFormService: SalesFormService;
  let salesService: SalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SalesUpdateComponent],
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
      .overrideTemplate(SalesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    salesFormService = TestBed.inject(SalesFormService);
    salesService = TestBed.inject(SalesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sales: ISales = { id: 456 };

      activatedRoute.data = of({ sales });
      comp.ngOnInit();

      expect(comp.sales).toEqual(sales);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISales>>();
      const sales = { id: 123 };
      jest.spyOn(salesFormService, 'getSales').mockReturnValue(sales);
      jest.spyOn(salesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sales });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sales }));
      saveSubject.complete();

      // THEN
      expect(salesFormService.getSales).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(salesService.update).toHaveBeenCalledWith(expect.objectContaining(sales));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISales>>();
      const sales = { id: 123 };
      jest.spyOn(salesFormService, 'getSales').mockReturnValue({ id: null });
      jest.spyOn(salesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sales: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sales }));
      saveSubject.complete();

      // THEN
      expect(salesFormService.getSales).toHaveBeenCalled();
      expect(salesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISales>>();
      const sales = { id: 123 };
      jest.spyOn(salesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sales });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(salesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
