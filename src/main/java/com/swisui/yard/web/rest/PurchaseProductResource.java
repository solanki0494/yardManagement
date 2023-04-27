package com.swisui.yard.web.rest;

import com.swisui.yard.domain.PurchaseProduct;
import com.swisui.yard.repository.PurchaseProductRepository;
import com.swisui.yard.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.swisui.yard.domain.PurchaseProduct}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PurchaseProductResource {

    private final Logger log = LoggerFactory.getLogger(PurchaseProductResource.class);

    private static final String ENTITY_NAME = "purchaseProduct";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PurchaseProductRepository purchaseProductRepository;

    public PurchaseProductResource(PurchaseProductRepository purchaseProductRepository) {
        this.purchaseProductRepository = purchaseProductRepository;
    }

    /**
     * {@code POST  /purchase-products} : Create a new purchaseProduct.
     *
     * @param purchaseProduct the purchaseProduct to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new purchaseProduct, or with status {@code 400 (Bad Request)} if the purchaseProduct has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/purchase-products")
    public ResponseEntity<PurchaseProduct> createPurchaseProduct(@RequestBody PurchaseProduct purchaseProduct) throws URISyntaxException {
        log.debug("REST request to save PurchaseProduct : {}", purchaseProduct);
        if (purchaseProduct.getId() != null) {
            throw new BadRequestAlertException("A new purchaseProduct cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PurchaseProduct result = purchaseProductRepository.save(purchaseProduct);
        return ResponseEntity
            .created(new URI("/api/purchase-products/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /purchase-products/:id} : Updates an existing purchaseProduct.
     *
     * @param id the id of the purchaseProduct to save.
     * @param purchaseProduct the purchaseProduct to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseProduct,
     * or with status {@code 400 (Bad Request)} if the purchaseProduct is not valid,
     * or with status {@code 500 (Internal Server Error)} if the purchaseProduct couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/purchase-products/{id}")
    public ResponseEntity<PurchaseProduct> updatePurchaseProduct(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PurchaseProduct purchaseProduct
    ) throws URISyntaxException {
        log.debug("REST request to update PurchaseProduct : {}, {}", id, purchaseProduct);
        if (purchaseProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, purchaseProduct.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!purchaseProductRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PurchaseProduct result = purchaseProductRepository.save(purchaseProduct);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, purchaseProduct.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /purchase-products/:id} : Partial updates given fields of an existing purchaseProduct, field will ignore if it is null
     *
     * @param id the id of the purchaseProduct to save.
     * @param purchaseProduct the purchaseProduct to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseProduct,
     * or with status {@code 400 (Bad Request)} if the purchaseProduct is not valid,
     * or with status {@code 404 (Not Found)} if the purchaseProduct is not found,
     * or with status {@code 500 (Internal Server Error)} if the purchaseProduct couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/purchase-products/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PurchaseProduct> partialUpdatePurchaseProduct(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PurchaseProduct purchaseProduct
    ) throws URISyntaxException {
        log.debug("REST request to partial update PurchaseProduct partially : {}, {}", id, purchaseProduct);
        if (purchaseProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, purchaseProduct.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!purchaseProductRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PurchaseProduct> result = purchaseProductRepository
            .findById(purchaseProduct.getId())
            .map(existingPurchaseProduct -> {
                if (purchaseProduct.getUnits() != null) {
                    existingPurchaseProduct.setUnits(purchaseProduct.getUnits());
                }
                if (purchaseProduct.getUnitPrice() != null) {
                    existingPurchaseProduct.setUnitPrice(purchaseProduct.getUnitPrice());
                }
                if (purchaseProduct.getGst() != null) {
                    existingPurchaseProduct.setGst(purchaseProduct.getGst());
                }
                if (purchaseProduct.getTotal() != null) {
                    existingPurchaseProduct.setTotal(purchaseProduct.getTotal());
                }

                return existingPurchaseProduct;
            })
            .map(purchaseProductRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, purchaseProduct.getId().toString())
        );
    }

    /**
     * {@code GET  /purchase-products} : get all the purchaseProducts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of purchaseProducts in body.
     */
    @GetMapping("/purchase-products")
    public List<PurchaseProduct> getAllPurchaseProducts() {
        log.debug("REST request to get all PurchaseProducts");
        return purchaseProductRepository.findAll();
    }

    /**
     * {@code GET  /purchase-products/:id} : get the "id" purchaseProduct.
     *
     * @param id the id of the purchaseProduct to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the purchaseProduct, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/purchase-products/{id}")
    public ResponseEntity<PurchaseProduct> getPurchaseProduct(@PathVariable Long id) {
        log.debug("REST request to get PurchaseProduct : {}", id);
        Optional<PurchaseProduct> purchaseProduct = purchaseProductRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(purchaseProduct);
    }

    /**
     * {@code DELETE  /purchase-products/:id} : delete the "id" purchaseProduct.
     *
     * @param id the id of the purchaseProduct to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/purchase-products/{id}")
    public ResponseEntity<Void> deletePurchaseProduct(@PathVariable Long id) {
        log.debug("REST request to delete PurchaseProduct : {}", id);
        purchaseProductRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
