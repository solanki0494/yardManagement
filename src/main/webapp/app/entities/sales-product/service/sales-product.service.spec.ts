import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISalesProduct } from '../sales-product.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sales-product.test-samples';

import { SalesProductService } from './sales-product.service';

const requireRestSample: ISalesProduct = {
  ...sampleWithRequiredData,
};

describe('SalesProduct Service', () => {
  let service: SalesProductService;
  let httpMock: HttpTestingController;
  let expectedResult: ISalesProduct | ISalesProduct[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SalesProductService);
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

    it('should create a SalesProduct', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const salesProduct = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(salesProduct).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SalesProduct', () => {
      const salesProduct = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(salesProduct).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SalesProduct', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SalesProduct', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SalesProduct', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSalesProductToCollectionIfMissing', () => {
      it('should add a SalesProduct to an empty array', () => {
        const salesProduct: ISalesProduct = sampleWithRequiredData;
        expectedResult = service.addSalesProductToCollectionIfMissing([], salesProduct);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(salesProduct);
      });

      it('should not add a SalesProduct to an array that contains it', () => {
        const salesProduct: ISalesProduct = sampleWithRequiredData;
        const salesProductCollection: ISalesProduct[] = [
          {
            ...salesProduct,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSalesProductToCollectionIfMissing(salesProductCollection, salesProduct);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SalesProduct to an array that doesn't contain it", () => {
        const salesProduct: ISalesProduct = sampleWithRequiredData;
        const salesProductCollection: ISalesProduct[] = [sampleWithPartialData];
        expectedResult = service.addSalesProductToCollectionIfMissing(salesProductCollection, salesProduct);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(salesProduct);
      });

      it('should add only unique SalesProduct to an array', () => {
        const salesProductArray: ISalesProduct[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const salesProductCollection: ISalesProduct[] = [sampleWithRequiredData];
        expectedResult = service.addSalesProductToCollectionIfMissing(salesProductCollection, ...salesProductArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const salesProduct: ISalesProduct = sampleWithRequiredData;
        const salesProduct2: ISalesProduct = sampleWithPartialData;
        expectedResult = service.addSalesProductToCollectionIfMissing([], salesProduct, salesProduct2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(salesProduct);
        expect(expectedResult).toContain(salesProduct2);
      });

      it('should accept null and undefined values', () => {
        const salesProduct: ISalesProduct = sampleWithRequiredData;
        expectedResult = service.addSalesProductToCollectionIfMissing([], null, salesProduct, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(salesProduct);
      });

      it('should return initial array if no SalesProduct is added', () => {
        const salesProductCollection: ISalesProduct[] = [sampleWithRequiredData];
        expectedResult = service.addSalesProductToCollectionIfMissing(salesProductCollection, undefined, null);
        expect(expectedResult).toEqual(salesProductCollection);
      });
    });

    describe('compareSalesProduct', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSalesProduct(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSalesProduct(entity1, entity2);
        const compareResult2 = service.compareSalesProduct(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSalesProduct(entity1, entity2);
        const compareResult2 = service.compareSalesProduct(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSalesProduct(entity1, entity2);
        const compareResult2 = service.compareSalesProduct(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
