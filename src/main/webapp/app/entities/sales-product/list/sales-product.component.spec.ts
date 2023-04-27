import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SalesProductService } from '../service/sales-product.service';

import { SalesProductComponent } from './sales-product.component';

describe('SalesProduct Management Component', () => {
  let comp: SalesProductComponent;
  let fixture: ComponentFixture<SalesProductComponent>;
  let service: SalesProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'sales-product', component: SalesProductComponent }]), HttpClientTestingModule],
      declarations: [SalesProductComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(SalesProductComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalesProductComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SalesProductService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.salesProducts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to salesProductService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSalesProductIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSalesProductIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
