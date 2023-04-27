import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SalesProductDetailComponent } from './sales-product-detail.component';

describe('SalesProduct Management Detail Component', () => {
  let comp: SalesProductDetailComponent;
  let fixture: ComponentFixture<SalesProductDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesProductDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ salesProduct: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SalesProductDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SalesProductDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load salesProduct on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.salesProduct).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
