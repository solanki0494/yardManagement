import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LoadingProductService } from '../service/loading-product.service';

import { LoadingProductComponent } from './loading-product.component';

describe('LoadingProduct Management Component', () => {
  let comp: LoadingProductComponent;
  let fixture: ComponentFixture<LoadingProductComponent>;
  let service: LoadingProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'loading-product', component: LoadingProductComponent }]), HttpClientTestingModule],
      declarations: [LoadingProductComponent],
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
      .overrideTemplate(LoadingProductComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoadingProductComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LoadingProductService);

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
    expect(comp.loadingProducts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to loadingProductService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLoadingProductIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLoadingProductIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
