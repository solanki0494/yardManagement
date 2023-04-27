package com.swisui.yard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swisui.yard.domain.enumeration.LoadingStatus;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LoadingProduct.
 */
@Entity
@Table(name = "loading_product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LoadingProduct implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "units")
    private Double units;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private LoadingStatus status;

    @ManyToOne
    @JsonIgnoreProperties(value = { "inventory", "loadingProducts" }, allowSetters = true)
    private Product product;

    @ManyToOne
    @JsonIgnoreProperties(value = { "purchase", "loadingProducts" }, allowSetters = true)
    private Loading loading;

    // jhipster-needle-entity-add-field - JHipster will add fields here

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

    public LoadingStatus getStatus() {
        return this.status;
    }

    public LoadingProduct status(LoadingStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(LoadingStatus status) {
        this.status = status;
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
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LoadingProduct{" +
            "id=" + getId() +
            ", units=" + getUnits() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
