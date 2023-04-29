package com.swisui.yard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swisui.yard.domain.enumeration.LoadingStatus;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "loading_product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class LoadingProduct implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "defaultPrice", "defaultGST", "inventory" }, allowSetters = true)
    private Product product;

    @Column(name = "units")
    private Double units;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "gst")
    private Double gst;

    @Column(name = "total")
    private Double total;

    @ManyToOne
    @JsonIgnoreProperties(value = { "loadingProducts" }, allowSetters = true)
    private Loading loading;

    public Long getId() {
        return this.id;
    }

    public LoadingProduct id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getUnits() {
        return this.units;
    }

    public LoadingProduct units(Double units) {
        this.setUnits(units);
        return this;
    }

    public void setUnits(Double units) {
        this.units = units;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public LoadingProduct product(Product product) {
        this.setProduct(product);
        return this;
    }

    public Loading getLoading() {
        return this.loading;
    }

    public void setLoading(Loading loading) {
        this.loading = loading;
    }

    public LoadingProduct loading(Loading loading) {
        this.setLoading(loading);
        return this;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public LoadingProduct unitPrice(Double unitPrice) {
        this.setUnitPrice(unitPrice);
        return this;
    }

    public Double getGst() {
        return gst;
    }

    public void setGst(Double gst) {
        this.gst = gst;
    }

    public LoadingProduct gst(Double gst) {
        this.setGst(gst);
        return this;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public LoadingProduct total(Double total) {
        this.setTotal(total);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LoadingProduct)) {
            return false;
        }
        return id != null && id.equals(((LoadingProduct) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LoadingProduct{" +
            "id=" + getId() +
            ", units=" + getUnits() +
            "}";
    }
}
