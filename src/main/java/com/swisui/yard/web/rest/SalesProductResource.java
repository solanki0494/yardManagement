package com.swisui.yard.web.rest;

import com.swisui.yard.domain.SalesProduct;
import com.swisui.yard.repository.SalesProductRepository;
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
 * REST controller for managing {@link com.swisui.yard.domain.SalesProduct}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SalesProductResource {

    private final Logger log = LoggerFactory.getLogger(SalesProductResource.class);

    private static final String ENTITY_NAME = "salesProduct";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SalesProductRepository salesProductRepository;

    public SalesProductResource(SalesProductRepository salesProductRepository) {
        this.salesProductRepository = salesProductRepository;
    }

    /**
     * {@code POST  /sales-products} : Create a new salesProduct.
     *
     * @param salesProduct the salesProduct to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new salesProduct, or with status {@code 400 (Bad Request)} if the salesProduct has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sales-products")
    public ResponseEntity<SalesProduct> createSalesProduct(@RequestBody SalesProduct salesProduct) throws URISyntaxException {
        log.debug("REST request to save SalesProduct : {}", salesProduct);
        if (salesProduct.getId() != null) {
            throw new BadRequestAlertException("A new salesProduct cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SalesProduct result = salesProductRepository.save(salesProduct);
        return ResponseEntity
            .created(new URI("/api/sales-products/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sales-products/:id} : Updates an existing salesProduct.
     *
     * @param id the id of the salesProduct to save.
     * @param salesProduct the salesProduct to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated salesProduct,
     * or with status {@code 400 (Bad Request)} if the salesProduct is not valid,
     * or with status {@code 500 (Internal Server Error)} if the salesProduct couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sales-products/{id}")
    public ResponseEntity<SalesProduct> updateSalesProduct(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SalesProduct salesProduct
    ) throws URISyntaxException {
        log.debug("REST request to update SalesProduct : {}, {}", id, salesProduct);
        if (salesProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salesProduct.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salesProductRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SalesProduct result = salesProductRepository.save(salesProduct);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salesProduct.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sales-products/:id} : Partial updates given fields of an existing salesProduct, field will ignore if it is null
     *
     * @param id the id of the salesProduct to save.
     * @param salesProduct the salesProduct to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated salesProduct,
     * or with status {@code 400 (Bad Request)} if the salesProduct is not valid,
     * or with status {@code 404 (Not Found)} if the salesProduct is not found,
     * or with status {@code 500 (Internal Server Error)} if the salesProduct couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sales-products/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SalesProduct> partialUpdateSalesProduct(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SalesProduct salesProduct
    ) throws URISyntaxException {
        log.debug("REST request to partial update SalesProduct partially : {}, {}", id, salesProduct);
        if (salesProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, salesProduct.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salesProductRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SalesProduct> result = salesProductRepository
            .findById(salesProduct.getId())
            .map(existingSalesProduct -> {
                if (salesProduct.getUnits() != null) {
                    existingSalesProduct.setUnits(salesProduct.getUnits());
                }
                if (salesProduct.getUnitPrice() != null) {
                    existingSalesProduct.setUnitPrice(salesProduct.getUnitPrice());
                }
                if (salesProduct.getGst() != null) {
                    existingSalesProduct.setGst(salesProduct.getGst());
                }
                if (salesProduct.getTotal() != null) {
                    existingSalesProduct.setTotal(salesProduct.getTotal());
                }

                return existingSalesProduct;
            })
            .map(salesProductRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, salesProduct.getId().toString())
        );
    }

    /**
     * {@code GET  /sales-products} : get all the salesProducts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of salesProducts in body.
     */
    @GetMapping("/sales-products")
    public List<SalesProduct> getAllSalesProducts() {
        log.debug("REST request to get all SalesProducts");
        return salesProductRepository.findAll();
    }

    /**
     * {@code GET  /sales-products/:id} : get the "id" salesProduct.
     *
     * @param id the id of the salesProduct to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the salesProduct, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sales-products/{id}")
    public ResponseEntity<SalesProduct> getSalesProduct(@PathVariable Long id) {
        log.debug("REST request to get SalesProduct : {}", id);
        Optional<SalesProduct> salesProduct = salesProductRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(salesProduct);
    }

    /**
     * {@code DELETE  /sales-products/:id} : delete the "id" salesProduct.
     *
     * @param id the id of the salesProduct to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sales-products/{id}")
    public ResponseEntity<Void> deleteSalesProduct(@PathVariable Long id) {
        log.debug("REST request to delete SalesProduct : {}", id);
        salesProductRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
