import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILoadingProduct } from '../loading-product.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../loading-product.test-samples';

import { LoadingProductService } from './loading-product.service';

const requireRestSample: ILoadingProduct = {
  ...sampleWithRequiredData,
};

describe('LoadingProduct Service', () => {
  let service: LoadingProductService;
  let httpMock: HttpTestingController;
  let expectedResult: ILoadingProduct | ILoadingProduct[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LoadingProductService);
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

    it('should create a LoadingProduct', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const loadingProduct = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(loadingProduct).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LoadingProduct', () => {
      const loadingProduct = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(loadingProduct).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LoadingProduct', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LoadingProduct', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LoadingProduct', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLoadingProductToCollectionIfMissing', () => {
      it('should add a LoadingProduct to an empty array', () => {
        const loadingProduct: ILoadingProduct = sampleWithRequiredData;
        expectedResult = service.addLoadingProductToCollectionIfMissing([], loadingProduct);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loadingProduct);
      });

      it('should not add a LoadingProduct to an array that contains it', () => {
        const loadingProduct: ILoadingProduct = sampleWithRequiredData;
        const loadingProductCollection: ILoadingProduct[] = [
          {
            ...loadingProduct,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLoadingProductToCollectionIfMissing(loadingProductCollection, loadingProduct);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LoadingProduct to an array that doesn't contain it", () => {
        const loadingProduct: ILoadingProduct = sampleWithRequiredData;
        const loadingProductCollection: ILoadingProduct[] = [sampleWithPartialData];
        expectedResult = service.addLoadingProductToCollectionIfMissing(loadingProductCollection, loadingProduct);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loadingProduct);
      });

      it('should add only unique LoadingProduct to an array', () => {
        const loadingProductArray: ILoadingProduct[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const loadingProductCollection: ILoadingProduct[] = [sampleWithRequiredData];
        expectedResult = service.addLoadingProductToCollectionIfMissing(loadingProductCollection, ...loadingProductArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const loadingProduct: ILoadingProduct = sampleWithRequiredData;
        const loadingProduct2: ILoadingProduct = sampleWithPartialData;
        expectedResult = service.addLoadingProductToCollectionIfMissing([], loadingProduct, loadingProduct2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loadingProduct);
        expect(expectedResult).toContain(loadingProduct2);
      });

      it('should accept null and undefined values', () => {
        const loadingProduct: ILoadingProduct = sampleWithRequiredData;
        expectedResult = service.addLoadingProductToCollectionIfMissing([], null, loadingProduct, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loadingProduct);
      });

      it('should return initial array if no LoadingProduct is added', () => {
        const loadingProductCollection: ILoadingProduct[] = [sampleWithRequiredData];
        expectedResult = service.addLoadingProductToCollectionIfMissing(loadingProductCollection, undefined, null);
        expect(expectedResult).toEqual(loadingProductCollection);
      });
    });

    describe('compareLoadingProduct', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLoadingProduct(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLoadingProduct(entity1, entity2);
        const compareResult2 = service.compareLoadingProduct(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLoadingProduct(entity1, entity2);
        const compareResult2 = service.compareLoadingProduct(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLoadingProduct(entity1, entity2);
        const compareResult2 = service.compareLoadingProduct(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
