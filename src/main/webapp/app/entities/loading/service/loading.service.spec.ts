import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILoading } from '../loading.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../loading.test-samples';

import { LoadingService, RestLoading } from './loading.service';

const requireRestSample: RestLoading = {
  ...sampleWithRequiredData,
  loadingTime: sampleWithRequiredData.loadingTime?.toJSON(),
};

describe('Loading Service', () => {
  let service: LoadingService;
  let httpMock: HttpTestingController;
  let expectedResult: ILoading | ILoading[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LoadingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Loading', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const loading = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(loading).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Loading', () => {
      const loading = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(loading).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Loading', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Loading', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Loading', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLoadingToCollectionIfMissing', () => {
      it('should add a Loading to an empty array', () => {
        const loading: ILoading = sampleWithRequiredData;
        expectedResult = service.addLoadingToCollectionIfMissing([], loading);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loading);
      });

      it('should not add a Loading to an array that contains it', () => {
        const loading: ILoading = sampleWithRequiredData;
        const loadingCollection: ILoading[] = [
          {
            ...loading,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLoadingToCollectionIfMissing(loadingCollection, loading);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Loading to an array that doesn't contain it", () => {
        const loading: ILoading = sampleWithRequiredData;
        const loadingCollection: ILoading[] = [sampleWithPartialData];
        expectedResult = service.addLoadingToCollectionIfMissing(loadingCollection, loading);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loading);
      });

      it('should add only unique Loading to an array', () => {
        const loadingArray: ILoading[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const loadingCollection: ILoading[] = [sampleWithRequiredData];
        expectedResult = service.addLoadingToCollectionIfMissing(loadingCollection, ...loadingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const loading: ILoading = sampleWithRequiredData;
        const loading2: ILoading = sampleWithPartialData;
        expectedResult = service.addLoadingToCollectionIfMissing([], loading, loading2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loading);
        expect(expectedResult).toContain(loading2);
      });

      it('should accept null and undefined values', () => {
        const loading: ILoading = sampleWithRequiredData;
        expectedResult = service.addLoadingToCollectionIfMissing([], null, loading, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loading);
      });

      it('should return initial array if no Loading is added', () => {
        const loadingCollection: ILoading[] = [sampleWithRequiredData];
        expectedResult = service.addLoadingToCollectionIfMissing(loadingCollection, undefined, null);
        expect(expectedResult).toEqual(loadingCollection);
      });
    });

    describe('compareLoading', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLoading(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLoading(entity1, entity2);
        const compareResult2 = service.compareLoading(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLoading(entity1, entity2);
        const compareResult2 = service.compareLoading(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLoading(entity1, entity2);
        const compareResult2 = service.compareLoading(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
