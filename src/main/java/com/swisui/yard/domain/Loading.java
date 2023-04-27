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
 * A Loading.
 */
@Entity
@Table(name = "loading")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Loading implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "yard")
    private String yard;

    @Column(name = "vehicle_number")
    private String vehicleNumber;

    @Column(name = "loading_time")
    private Instant loadingTime;

    @JsonIgnoreProperties(value = { "invoice", "purchaseProducts", "loading" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Purchase purchase;

    @OneToMany(mappedBy = "loading")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "product", "loading" }, allowSetters = true)
    private Set<LoadingProduct> loadingProducts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Loading id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getYard() {
        return this.yard;
    }

    public Loading yard(String yard) {
        this.setYard(yard);
        return this;
    }

    public void setYard(String yard) {
        this.yard = yard;
    }

    public String getVehicleNumber() {
        return this.vehicleNumber;
    }

    public Loading vehicleNumber(String vehicleNumber) {
        this.setVehicleNumber(vehicleNumber);
        return this;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public Instant getLoadingTime() {
        return this.loadingTime;
    }

    public Loading loadingTime(Instant loadingTime) {
        this.setLoadingTime(loadingTime);
        return this;
    }

    public void setLoadingTime(Instant loadingTime) {
        this.loadingTime = loadingTime;
    }

    public Purchase getPurchase() {
        return this.purchase;
    }

    public void setPurchase(Purchase purchase) {
        this.purchase = purchase;
    }

    public Loading purchase(Purchase purchase) {
        this.setPurchase(purchase);
        return this;
    }

    public Set<LoadingProduct> getLoadingProducts() {
        return this.loadingProducts;
    }

    public void setLoadingProducts(Set<LoadingProduct> loadingProducts) {
        if (this.loadingProducts != null) {
            this.loadingProducts.forEach(i -> i.setLoading(null));
        }
        if (loadingProducts != null) {
            loadingProducts.forEach(i -> i.setLoading(this));
        }
        this.loadingProducts = loadingProducts;
    }

    public Loading loadingProducts(Set<LoadingProduct> loadingProducts) {
        this.setLoadingProducts(loadingProducts);
        return this;
    }

    public Loading addLoadingProduct(LoadingProduct loadingProduct) {
        this.loadingProducts.add(loadingProduct);
        loadingProduct.setLoading(this);
        return this;
    }

    public Loading removeLoadingProduct(LoadingProduct loadingProduct) {
        this.loadingProducts.remove(loadingProduct);
        loadingProduct.setLoading(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Loading)) {
            return false;
        }
        return id != null && id.equals(((Loading) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Loading{" +
            "id=" + getId() +
            ", yard='" + getYard() + "'" +
            ", vehicleNumber='" + getVehicleNumber() + "'" +
            ", loadingTime='" + getLoadingTime() + "'" +
            "}";
    }
}