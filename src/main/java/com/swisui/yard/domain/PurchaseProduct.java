package com.swisui.yard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PurchaseProduct.
 */
@Entity
@Table(name = "purchase_product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PurchaseProduct implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "units")
    private Double units;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "gst")
    private Double gst;

    @Column(name = "total")
    private Double total;

    @ManyToOne
    @JsonIgnoreProperties(value = { "invoice", "purchaseProducts", "loading" }, allowSetters = true)
    private Purchase purchase;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PurchaseProduct id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getUnits() {
        return this.units;
    }

    public PurchaseProduct units(Double units) {
        this.setUnits(units);
        return this;
    }

    public void setUnits(Double units) {
        this.units = units;
    }

    public Double getUnitPrice() {
        return this.unitPrice;
    }

    public PurchaseProduct unitPrice(Double unitPrice) {
        this.setUnitPrice(unitPrice);
        return this;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Double getGst() {
        return this.gst;
    }

    public PurchaseProduct gst(Double gst) {
        this.setGst(gst);
        return this;
    }

    public void setGst(Double gst) {
        this.gst = gst;
    }

    public Double getTotal() {
        return this.total;
    }

    public PurchaseProduct total(Double total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Purchase getPurchase() {
        return this.purchase;
    }

    public void setPurchase(Purchase purchase) {
        this.purchase = purchase;
    }

    public PurchaseProduct purchase(Purchase purchase) {
        this.setPurchase(purchase);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PurchaseProduct)) {
            return false;
        }
        return id != null && id.equals(((PurchaseProduct) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PurchaseProduct{" +
            "id=" + getId() +
            ", units=" + getUnits() +
            ", unitPrice=" + getUnitPrice() +
            ", gst=" + getGst() +
            ", total=" + getTotal() +
            "}";
    }
}
