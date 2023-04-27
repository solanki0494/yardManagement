import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PurchaseService } from '../service/purchase.service';

import { PurchaseComponent } from './purchase.component';

describe('Purchase Management Component', () => {
  let comp: PurchaseComponent;
  let fixture: ComponentFixture<PurchaseComponent>;
  let service: PurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'purchase', component: PurchaseComponent }]), HttpClientTestingModule],
      declarations: [PurchaseComponent],
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
      .overrideTemplate(PurchaseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PurchaseService);

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
    expect(comp.purchases?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to purchaseService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPurchaseIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPurchaseIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
