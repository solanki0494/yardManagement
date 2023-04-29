package com.swisui.yard.web.rest;

import com.swisui.yard.domain.Loading;
import com.swisui.yard.domain.LoadingProduct;
import com.swisui.yard.service.LoadingService;
import com.swisui.yard.service.dto.LoadingDTO;
import com.swisui.yard.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
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
 * REST controller for managing {@link com.swisui.yard.domain.Loading}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LoadingResource {

    private final Logger log = LoggerFactory.getLogger(LoadingResource.class);

    private static final String ENTITY_NAME = "loading";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LoadingService loadingService;

    public LoadingResource(LoadingService loadingService) {
        this.loadingService = loadingService;
    }

    /**
     * {@code POST  /loadings} : Create a new loading.
     *
     * @param loadingDTO the loading to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new loading, or with status {@code 400 (Bad Request)} if the loading has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/loadings")
    public ResponseEntity<Loading> createLoading(@RequestBody LoadingDTO loadingDTO) throws URISyntaxException {
        log.debug("REST request to save Loading : {}", loadingDTO);

        if (loadingDTO.getId() != null && loadingDTO.getId() != 0) {
            throw new BadRequestAlertException("A new loading cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (loadingDTO.getLoadingTime() == null) {
            loadingDTO.setLoadingTime(Instant.now());
        }
        Loading result = loadingService.save(loadingDTO);
        return ResponseEntity
            .created(new URI("/api/loadings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/loadings/{loadingId}/products")
    public ResponseEntity<Loading> addProducts(@PathVariable Long loadingId, @RequestBody List<LoadingProduct> loadingProducts) {
        log.debug("REST request to add Loading Products : {}, {}", loadingId);
        if (!loadingService.existsById(loadingId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Loading result = loadingService.save(loadingId, loadingProducts);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, loadingId.toString()))
            .body(result);
    }

    /**
     * {@code PUT  /loadings/:id} : Updates an existing loading.
     *
     * @param id the id of the loading to save.
     * @param loadingDTO the loading to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loading,
     * or with status {@code 400 (Bad Request)} if the loading is not valid,
     * or with status {@code 500 (Internal Server Error)} if the loading couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/loadings/{id}")
    public ResponseEntity<Loading> updateLoading(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LoadingDTO loadingDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Loading : {}, {}", id, loadingDTO);
        if (loadingDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loadingDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loadingService.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Loading result = loadingService.update(loadingDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, loadingDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /loadings} : get all the loadings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of loadings in body.
     */
    @GetMapping("/loadings")
    public List<Loading> getAllLoadings() {
        log.debug("REST request to get all Loadings");
        return loadingService.getAllLoadings();
    }

    /**
     * {@code GET  /loadings/:id} : get the "id" loading.
     *
     * @param id the id of the loading to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the loading, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/loadings/{id}")
    public ResponseEntity<Loading> getLoading(@PathVariable Long id) {
        log.debug("REST request to get Loading : {}", id);
        Optional<Loading> loading = loadingService.getLoading(id);
        return ResponseUtil.wrapOrNotFound(loading);
    }

    /**
     * {@code DELETE  /loadings/:id} : delete the "id" loading.
     *
     * @param id the id of the loading to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/loadings/{id}")
    public ResponseEntity<Void> deleteLoading(@PathVariable Long id) {
        log.debug("REST request to delete Loading : {}", id);
        loadingService.deleteLoading(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
