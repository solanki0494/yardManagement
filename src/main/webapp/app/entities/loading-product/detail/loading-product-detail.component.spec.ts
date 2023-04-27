import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoadingProductDetailComponent } from './loading-product-detail.component';

describe('LoadingProduct Management Detail Component', () => {
  let comp: LoadingProductDetailComponent;
  let fixture: ComponentFixture<LoadingProductDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingProductDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ loadingProduct: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LoadingProductDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LoadingProductDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load loadingProduct on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.loadingProduct).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
