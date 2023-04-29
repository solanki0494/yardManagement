package com.swisui.yard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swisui.yard.domain.enumeration.LoadingStatus;
import com.swisui.yard.service.dto.LoadingDTO;
import java.io.Serializable;
import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "loading")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
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

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private LoadingStatus status = LoadingStatus.IN;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @OneToMany(mappedBy = "loading", cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "loading" }, allowSetters = true)
    private Set<LoadingProduct> loadingProducts = new HashSet<>();

    public Loading() {}

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

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public Loading invoiceNumber(String invoiceNumber) {
        this.setInvoiceNumber(invoiceNumber);
        return this;
    }

    public LoadingStatus getStatus() {
        return status;
    }

    public void setStatus(LoadingStatus status) {
        this.status = status;
    }

    public Loading status(LoadingStatus status) {
        this.setStatus(status);
        return this;
    }

    public Set<LoadingProduct> getLoadingProducts() {
        return this.loadingProducts;
    }

    public void setLoadingProducts(Collection<LoadingProduct> loadingProducts) {
        if (this.loadingProducts != null) {
            this.loadingProducts.forEach(i -> i.setLoading(null));
        }
        if (loadingProducts != null) {
            loadingProducts.forEach(i -> i.setLoading(this));
        }
        this.loadingProducts.clear();
        this.loadingProducts.addAll(loadingProducts);
    }

    public Loading loadingProducts(Collection<LoadingProduct> loadingProducts) {
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
