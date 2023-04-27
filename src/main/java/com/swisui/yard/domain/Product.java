package com.swisui.yard.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "default_price")
    private Double defaultPrice;

    @Column(name = "default_gst")
    private Double defaultGST;

    @ManyToOne
    @JsonIgnoreProperties(value = { "products" }, allowSetters = true)
    private Inventory inventory;

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "product", "loading" }, allowSetters = true)
    private Set<LoadingProduct> loadingProducts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Product id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Product name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getDefaultPrice() {
        return this.defaultPrice;
    }

    public Product defaultPrice(Double defaultPrice) {
        this.setDefaultPrice(defaultPrice);
        return this;
    }

    public void setDefaultPrice(Double defaultPrice) {
        this.defaultPrice = defaultPrice;
    }

    public Double getDefaultGST() {
        return this.defaultGST;
    }

    public Product defaultGST(Double defaultGST) {
        this.setDefaultGST(defaultGST);
        return this;
    }

    public void setDefaultGST(Double defaultGST) {
        this.defaultGST = defaultGST;
    }

    public Inventory getInventory() {
        return this.inventory;
    }

    public void setInventory(Inventory inventory) {
        this.inventory = inventory;
    }

    public Product inventory(Inventory inventory) {
        this.setInventory(inventory);
        return this;
    }

    public Set<LoadingProduct> getLoadingProducts() {
        return this.loadingProducts;
    }

    public void setLoadingProducts(Set<LoadingProduct> loadingProducts) {
        if (this.loadingProducts != null) {
            this.loadingProducts.forEach(i -> i.setProduct(null));
        }
        if (loadingProducts != null) {
            loadingProducts.forEach(i -> i.setProduct(this));
        }
        this.loadingProducts = loadingProducts;
    }

    public Product loadingProducts(Set<LoadingProduct> loadingProducts) {
        this.setLoadingProducts(loadingProducts);
        return this;
    }

    public Product addLoadingProduct(LoadingProduct loadingProduct) {
        this.loadingProducts.add(loadingProduct);
        loadingProduct.setProduct(this);
        return this;
    }

    public Product removeLoadingProduct(LoadingProduct loadingProduct) {
        this.loadingProducts.remove(loadingProduct);
        loadingProduct.setProduct(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", defaultPrice=" + getDefaultPrice() +
            ", defaultGST=" + getDefaultGST() +
            "}";
    }
}
