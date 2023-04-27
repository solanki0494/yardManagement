package com.swisui.yard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Sales.
 */
@Entity
@Table(name = "sales")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Sales implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "invoice_id")
    private Integer invoiceId;

    @Column(name = "sale_time")
    private Instant saleTime;

    @Column(name = "buyer")
    private String buyer;

    @OneToMany(mappedBy = "sales")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sales" }, allowSetters = true)
    private Set<SalesProduct> salesProducts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sales id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getInvoiceId() {
        return this.invoiceId;
    }

    public Sales invoiceId(Integer invoiceId) {
        this.setInvoiceId(invoiceId);
        return this;
    }

    public void setInvoiceId(Integer invoiceId) {
        this.invoiceId = invoiceId;
    }

    public Instant getSaleTime() {
        return this.saleTime;
    }

    public Sales saleTime(Instant saleTime) {
        this.setSaleTime(saleTime);
        return this;
    }

    public void setSaleTime(Instant saleTime) {
        this.saleTime = saleTime;
    }

    public String getBuyer() {
        return this.buyer;
    }

    public Sales buyer(String buyer) {
        this.setBuyer(buyer);
        return this;
    }

    public void setBuyer(String buyer) {
        this.buyer = buyer;
    }

    public Set<SalesProduct> getSalesProducts() {
        return this.salesProducts;
    }

    public void setSalesProducts(Set<SalesProduct> salesProducts) {
        if (this.salesProducts != null) {
            this.salesProducts.forEach(i -> i.setSales(null));
        }
        if (salesProducts != null) {
            salesProducts.forEach(i -> i.setSales(this));
        }
        this.salesProducts = salesProducts;
    }

    public Sales salesProducts(Set<SalesProduct> salesProducts) {
        this.setSalesProducts(salesProducts);
        return this;
    }

    public Sales addSalesProduct(SalesProduct salesProduct) {
        this.salesProducts.add(salesProduct);
        salesProduct.setSales(this);
        return this;
    }

    public Sales removeSalesProduct(SalesProduct salesProduct) {
        this.salesProducts.remove(salesProduct);
        salesProduct.setSales(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sales)) {
            return false;
        }
        return id != null && id.equals(((Sales) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sales{" +
            "id=" + getId() +
            ", invoiceId=" + getInvoiceId() +
            ", saleTime='" + getSaleTime() + "'" +
            ", buyer='" + getBuyer() + "'" +
            "}";
    }
}
