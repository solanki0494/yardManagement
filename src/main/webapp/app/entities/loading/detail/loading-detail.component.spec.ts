import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoadingDetailComponent } from './loading-detail.component';

describe('Loading Management Detail Component', () => {
  let comp: LoadingDetailComponent;
  let fixture: ComponentFixture<LoadingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ loading: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LoadingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LoadingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load loading on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.loading).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
