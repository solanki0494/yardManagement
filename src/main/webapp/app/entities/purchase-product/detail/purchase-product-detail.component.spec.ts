import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PurchaseProductDetailComponent } from './purchase-product-detail.component';

describe('PurchaseProduct Management Detail Component', () => {
  let comp: PurchaseProductDetailComponent;
  let fixture: ComponentFixture<PurchaseProductDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseProductDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ purchaseProduct: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PurchaseProductDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PurchaseProductDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load purchaseProduct on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.purchaseProduct).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
