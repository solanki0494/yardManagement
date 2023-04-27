import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LoadingService } from '../service/loading.service';

import { LoadingComponent } from './loading.component';

describe('Loading Management Component', () => {
  let comp: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'loading', component: LoadingComponent }]), HttpClientTestingModule],
      declarations: [LoadingComponent],
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
      .overrideTemplate(LoadingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LoadingService);

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
    expect(comp.loadings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to loadingService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLoadingIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLoadingIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
