import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PurchaseFormService } from './purchase-form.service';
import { PurchaseService } from '../service/purchase.service';
import { IPurchase } from '../purchase.model';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';

import { PurchaseUpdateComponent } from './purchase-update.component';

describe('Purchase Management Update Component', () => {
  let comp: PurchaseUpdateComponent;
  let fixture: ComponentFixture<PurchaseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let purchaseFormService: PurchaseFormService;
  let purchaseService: PurchaseService;
  let invoiceService: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PurchaseUpdateComponent],
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
      .overrideTemplate(PurchaseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    purchaseFormService = TestBed.inject(PurchaseFormService);
    purchaseService = TestBed.inject(PurchaseService);
    invoiceService = TestBed.inject(InvoiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call invoice query and add missing value', () => {
      const purchase: IPurchase = { id: 456 };
      const invoice: IInvoice = { id: 9505 };
      purchase.invoice = invoice;

      const invoiceCollection: IInvoice[] = [{ id: 60227 }];
      jest.spyOn(invoiceService, 'query').mockReturnValue(of(new HttpResponse({ body: invoiceCollection })));
      const expectedCollection: IInvoice[] = [invoice, ...invoiceCollection];
      jest.spyOn(invoiceService, 'addInvoiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ purchase });
      comp.ngOnInit();

      expect(invoiceService.query).toHaveBeenCalled();
      expect(invoiceService.addInvoiceToCollectionIfMissing).toHaveBeenCalledWith(invoiceCollection, invoice);
      expect(comp.invoicesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const purchase: IPurchase = { id: 456 };
      const invoice: IInvoice = { id: 35755 };
      purchase.invoice = invoice;

      activatedRoute.data = of({ purchase });
      comp.ngOnInit();

      expect(comp.invoicesCollection).toContain(invoice);
      expect(comp.purchase).toEqual(purchase);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchase>>();
      const purchase = { id: 123 };
      jest.spyOn(purchaseFormService, 'getPurchase').mockReturnValue(purchase);
      jest.spyOn(purchaseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchase }));
      saveSubject.complete();

      // THEN
      expect(purchaseFormService.getPurchase).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(purchaseService.update).toHaveBeenCalledWith(expect.objectContaining(purchase));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchase>>();
      const purchase = { id: 123 };
      jest.spyOn(purchaseFormService, 'getPurchase').mockReturnValue({ id: null });
      jest.spyOn(purchaseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchase: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchase }));
      saveSubject.complete();

      // THEN
      expect(purchaseFormService.getPurchase).toHaveBeenCalled();
      expect(purchaseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchase>>();
      const purchase = { id: 123 };
      jest.spyOn(purchaseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(purchaseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareInvoice', () => {
      it('Should forward to invoiceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(invoiceService, 'compareInvoice');
        comp.compareInvoice(entity, entity2);
        expect(invoiceService.compareInvoice).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
