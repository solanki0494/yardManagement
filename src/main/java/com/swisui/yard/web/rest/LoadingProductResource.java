package com.swisui.yard.web.rest;

import com.swisui.yard.domain.LoadingProduct;
import com.swisui.yard.repository.LoadingProductRepository;
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
 * REST controller for managing {@link com.swisui.yard.domain.LoadingProduct}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LoadingProductResource {

    private final Logger log = LoggerFactory.getLogger(LoadingProductResource.class);

    private static final String ENTITY_NAME = "loadingProduct";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LoadingProductRepository loadingProductRepository;

    public LoadingProductResource(LoadingProductRepository loadingProductRepository) {
        this.loadingProductRepository = loadingProductRepository;
    }

    /**
     * {@code POST  /loading-products} : Create a new loadingProduct.
     *
     * @param loadingProduct the loadingProduct to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new loadingProduct, or with status {@code 400 (Bad Request)} if the loadingProduct has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/loading-products")
    public ResponseEntity<LoadingProduct> createLoadingProduct(@RequestBody LoadingProduct loadingProduct) throws URISyntaxException {
        log.debug("REST request to save LoadingProduct : {}", loadingProduct);
        if (loadingProduct.getId() != null) {
            throw new BadRequestAlertException("A new loadingProduct cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LoadingProduct result = loadingProductRepository.save(loadingProduct);
        return ResponseEntity
            .created(new URI("/api/loading-products/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /loading-products/:id} : Updates an existing loadingProduct.
     *
     * @param id the id of the loadingProduct to save.
     * @param loadingProduct the loadingProduct to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loadingProduct,
     * or with status {@code 400 (Bad Request)} if the loadingProduct is not valid,
     * or with status {@code 500 (Internal Server Error)} if the loadingProduct couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/loading-products/{id}")
    public ResponseEntity<LoadingProduct> updateLoadingProduct(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LoadingProduct loadingProduct
    ) throws URISyntaxException {
        log.debug("REST request to update LoadingProduct : {}, {}", id, loadingProduct);
        if (loadingProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loadingProduct.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loadingProductRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LoadingProduct result = loadingProductRepository.save(loadingProduct);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, loadingProduct.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /loading-products/:id} : Partial updates given fields of an existing loadingProduct, field will ignore if it is null
     *
     * @param id the id of the loadingProduct to save.
     * @param loadingProduct the loadingProduct to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loadingProduct,
     * or with status {@code 400 (Bad Request)} if the loadingProduct is not valid,
     * or with status {@code 404 (Not Found)} if the loadingProduct is not found,
     * or with status {@code 500 (Internal Server Error)} if the loadingProduct couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/loading-products/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LoadingProduct> partialUpdateLoadingProduct(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LoadingProduct loadingProduct
    ) throws URISyntaxException {
        log.debug("REST request to partial update LoadingProduct partially : {}, {}", id, loadingProduct);
        if (loadingProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loadingProduct.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loadingProductRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LoadingProduct> result = loadingProductRepository
            .findById(loadingProduct.getId())
            .map(existingLoadingProduct -> {
                if (loadingProduct.getUnits() != null) {
                    existingLoadingProduct.setUnits(loadingProduct.getUnits());
                }
                if (loadingProduct.getStatus() != null) {
                    existingLoadingProduct.setStatus(loadingProduct.getStatus());
                }

                return existingLoadingProduct;
            })
            .map(loadingProductRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, loadingProduct.getId().toString())
        );
    }

    /**
     * {@code GET  /loading-products} : get all the loadingProducts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of loadingProducts in body.
     */
    @GetMapping("/loading-products")
    public List<LoadingProduct> getAllLoadingProducts() {
        log.debug("REST request to get all LoadingProducts");
        return loadingProductRepository.findAll();
    }

    /**
     * {@code GET  /loading-products/:id} : get the "id" loadingProduct.
     *
     * @param id the id of the loadingProduct to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the loadingProduct, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/loading-products/{id}")
    public ResponseEntity<LoadingProduct> getLoadingProduct(@PathVariable Long id) {
        log.debug("REST request to get LoadingProduct : {}", id);
        Optional<LoadingProduct> loadingProduct = loadingProductRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(loadingProduct);
    }

    /**
     * {@code DELETE  /loading-products/:id} : delete the "id" loadingProduct.
     *
     * @param id the id of the loadingProduct to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/loading-products/{id}")
    public ResponseEntity<Void> deleteLoadingProduct(@PathVariable Long id) {
        log.debug("REST request to delete LoadingProduct : {}", id);
        loadingProductRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
