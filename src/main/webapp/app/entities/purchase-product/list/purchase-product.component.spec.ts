import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PurchaseProductService } from '../service/purchase-product.service';

import { PurchaseProductComponent } from './purchase-product.component';

describe('PurchaseProduct Management Component', () => {
  let comp: PurchaseProductComponent;
  let fixture: ComponentFixture<PurchaseProductComponent>;
  let service: PurchaseProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'purchase-product', component: PurchaseProductComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [PurchaseProductComponent],
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
      .overrideTemplate(PurchaseProductComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseProductComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PurchaseProductService);

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
    expect(comp.purchaseProducts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to purchaseProductService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPurchaseProductIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPurchaseProductIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
