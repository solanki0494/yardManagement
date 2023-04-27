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
 * A Purchase.
 */
@Entity
@Table(name = "purchase")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Purchase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "purchase_time")
    private Instant purchaseTime;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @JsonIgnoreProperties(value = { "purchase" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Invoice invoice;

    @OneToMany(mappedBy = "purchase")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "purchase" }, allowSetters = true)
    private Set<PurchaseProduct> purchaseProducts = new HashSet<>();

    @JsonIgnoreProperties(value = { "purchase", "loadingProducts" }, allowSetters = true)
    @OneToOne(mappedBy = "purchase")
    private Loading loading;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Purchase id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getPurchaseTime() {
        return this.purchaseTime;
    }

    public Purchase purchaseTime(Instant purchaseTime) {
        this.setPurchaseTime(purchaseTime);
        return this;
    }

    public void setPurchaseTime(Instant purchaseTime) {
        this.purchaseTime = purchaseTime;
    }

    public String getInvoiceNumber() {
        return this.invoiceNumber;
    }

    public Purchase invoiceNumber(String invoiceNumber) {
        this.setInvoiceNumber(invoiceNumber);
        return this;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public Invoice getInvoice() {
        return this.invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    public Purchase invoice(Invoice invoice) {
        this.setInvoice(invoice);
        return this;
    }

    public Set<PurchaseProduct> getPurchaseProducts() {
        return this.purchaseProducts;
    }

    public void setPurchaseProducts(Set<PurchaseProduct> purchaseProducts) {
        if (this.purchaseProducts != null) {
            this.purchaseProducts.forEach(i -> i.setPurchase(null));
        }
        if (purchaseProducts != null) {
            purchaseProducts.forEach(i -> i.setPurchase(this));
        }
        this.purchaseProducts = purchaseProducts;
    }

    public Purchase purchaseProducts(Set<PurchaseProduct> purchaseProducts) {
        this.setPurchaseProducts(purchaseProducts);
        return this;
    }

    public Purchase addPurchaseProduct(PurchaseProduct purchaseProduct) {
        this.purchaseProducts.add(purchaseProduct);
        purchaseProduct.setPurchase(this);
        return this;
    }

    public Purchase removePurchaseProduct(PurchaseProduct purchaseProduct) {
        this.purchaseProducts.remove(purchaseProduct);
        purchaseProduct.setPurchase(null);
        return this;
    }

    public Loading getLoading() {
        return this.loading;
    }

    public void setLoading(Loading loading) {
        if (this.loading != null) {
            this.loading.setPurchase(null);
        }
        if (loading != null) {
            loading.setPurchase(this);
        }
        this.loading = loading;
    }

    public Purchase loading(Loading loading) {
        this.setLoading(loading);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Purchase)) {
            return false;
        }
        return id != null && id.equals(((Purchase) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Purchase{" +
            "id=" + getId() +
            ", purchaseTime='" + getPurchaseTime() + "'" +
            ", invoiceNumber='" + getInvoiceNumber() + "'" +
            "}";
    }
}
