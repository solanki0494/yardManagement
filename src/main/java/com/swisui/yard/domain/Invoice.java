package com.swisui.yard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swisui.yard.domain.enumeration.InvoiceStatus;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Invoice.
 */
@Entity
@Table(name = "invoice")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Invoice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "company_invoice_number")
    private String companyInvoiceNumber;

    @Column(name = "gst")
    private Double gst;

    @Column(name = "total")
    private Double total;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InvoiceStatus status;

    @JsonIgnoreProperties(value = { "invoice", "purchaseProducts", "loading" }, allowSetters = true)
    @OneToOne(mappedBy = "invoice")
    private Purchase purchase;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Invoice id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvoiceNumber() {
        return this.invoiceNumber;
    }

    public Invoice invoiceNumber(String invoiceNumber) {
        this.setInvoiceNumber(invoiceNumber);
        return this;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public String getCompanyInvoiceNumber() {
        return this.companyInvoiceNumber;
    }

    public Invoice companyInvoiceNumber(String companyInvoiceNumber) {
        this.setCompanyInvoiceNumber(companyInvoiceNumber);
        return this;
    }

    public void setCompanyInvoiceNumber(String companyInvoiceNumber) {
        this.companyInvoiceNumber = companyInvoiceNumber;
    }

    public Double getGst() {
        return this.gst;
    }

    public Invoice gst(Double gst) {
        this.setGst(gst);
        return this;
    }

    public void setGst(Double gst) {
        this.gst = gst;
    }

    public Double getTotal() {
        return this.total;
    }

    public Invoice total(Double total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public InvoiceStatus getStatus() {
        return this.status;
    }

    public Invoice status(InvoiceStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(InvoiceStatus status) {
        this.status = status;
    }

    public Purchase getPurchase() {
        return this.purchase;
    }

    public void setPurchase(Purchase purchase) {
        if (this.purchase != null) {
            this.purchase.setInvoice(null);
        }
        if (purchase != null) {
            purchase.setInvoice(this);
        }
        this.purchase = purchase;
    }

    public Invoice purchase(Purchase purchase) {
        this.setPurchase(purchase);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Invoice)) {
            return false;
        }
        return id != null && id.equals(((Invoice) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Invoice{" +
            "id=" + getId() +
            ", invoiceNumber='" + getInvoiceNumber() + "'" +
            ", companyInvoiceNumber='" + getCompanyInvoiceNumber() + "'" +
            ", gst=" + getGst() +
            ", total=" + getTotal() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
