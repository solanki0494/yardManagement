import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInvoice, NewInvoice } from '../invoice.model';

export type PartialUpdateInvoice = Partial<IInvoice> & Pick<IInvoice, 'id'>;

export type EntityResponseType = HttpResponse<IInvoice>;
export type EntityArrayResponseType = HttpResponse<IInvoice[]>;

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/invoices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(invoice: NewInvoice): Observable<EntityResponseType> {
    return this.http.post<IInvoice>(this.resourceUrl, invoice, { observe: 'response' });
  }

  update(invoice: IInvoice): Observable<EntityResponseType> {
    return this.http.put<IInvoice>(`${this.resourceUrl}/${this.getInvoiceIdentifier(invoice)}`, invoice, { observe: 'response' });
  }

  partialUpdate(invoice: PartialUpdateInvoice): Observable<EntityResponseType> {
    return this.http.patch<IInvoice>(`${this.resourceUrl}/${this.getInvoiceIdentifier(invoice)}`, invoice, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInvoice>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInvoice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInvoiceIdentifier(invoice: Pick<IInvoice, 'id'>): number {
    return invoice.id;
  }

  compareInvoice(o1: Pick<IInvoice, 'id'> | null, o2: Pick<IInvoice, 'id'> | null): boolean {
    return o1 && o2 ? this.getInvoiceIdentifier(o1) === this.getInvoiceIdentifier(o2) : o1 === o2;
  }

  addInvoiceToCollectionIfMissing<Type extends Pick<IInvoice, 'id'>>(
    invoiceCollection: Type[],
    ...invoicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const invoices: Type[] = invoicesToCheck.filter(isPresent);
    if (invoices.length > 0) {
      const invoiceCollectionIdentifiers = invoiceCollection.map(invoiceItem => this.getInvoiceIdentifier(invoiceItem)!);
      const invoicesToAdd = invoices.filter(invoiceItem => {
        const invoiceIdentifier = this.getInvoiceIdentifier(invoiceItem);
        if (invoiceCollectionIdentifiers.includes(invoiceIdentifier)) {
          return false;
        }
        invoiceCollectionIdentifiers.push(invoiceIdentifier);
        return true;
      });
      return [...invoicesToAdd, ...invoiceCollection];
    }
    return invoiceCollection;
  }
}
