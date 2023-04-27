package com.swisui.yard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SalesProduct.
 */
@Entity
@Table(name = "sales_product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SalesProduct implements Serializable {

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
    @JsonIgnoreProperties(value = { "salesProducts" }, allowSetters = true)
    private Sales sales;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SalesProduct id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getUnits() {
        return this.units;
    }

    public SalesProduct units(Double units) {
        this.setUnits(units);
        return this;
    }

    public void setUnits(Double units) {
        this.units = units;
    }

    public Double getUnitPrice() {
        return this.unitPrice;
    }

    public SalesProduct unitPrice(Double unitPrice) {
        this.setUnitPrice(unitPrice);
        return this;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Double getGst() {
        return this.gst;
    }

    public SalesProduct gst(Double gst) {
        this.setGst(gst);
        return this;
    }

    public void setGst(Double gst) {
        this.gst = gst;
    }

    public Double getTotal() {
        return this.total;
    }

    public SalesProduct total(Double total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Sales getSales() {
        return this.sales;
    }

    public void setSales(Sales sales) {
        this.sales = sales;
    }

    public SalesProduct sales(Sales sales) {
        this.setSales(sales);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SalesProduct)) {
            return false;
        }
        return id != null && id.equals(((SalesProduct) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SalesProduct{" +
            "id=" + getId() +
            ", units=" + getUnits() +
            ", unitPrice=" + getUnitPrice() +
            ", gst=" + getGst() +
            ", total=" + getTotal() +
            "}";
    }
}
