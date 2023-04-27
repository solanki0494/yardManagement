package com.swisui.yard.web.rest;

import com.swisui.yard.domain.Loading;
import com.swisui.yard.repository.LoadingRepository;
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

    private final LoadingRepository loadingRepository;

    public LoadingResource(LoadingRepository loadingRepository) {
        this.loadingRepository = loadingRepository;
    }

    /**
     * {@code POST  /loadings} : Create a new loading.
     *
     * @param loading the loading to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new loading, or with status {@code 400 (Bad Request)} if the loading has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/loadings")
    public ResponseEntity<Loading> createLoading(@RequestBody Loading loading) throws URISyntaxException {
        log.debug("REST request to save Loading : {}", loading);
        if (loading.getId() != null) {
            throw new BadRequestAlertException("A new loading cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Loading result = loadingRepository.save(loading);
        return ResponseEntity
            .created(new URI("/api/loadings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /loadings/:id} : Updates an existing loading.
     *
     * @param id the id of the loading to save.
     * @param loading the loading to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loading,
     * or with status {@code 400 (Bad Request)} if the loading is not valid,
     * or with status {@code 500 (Internal Server Error)} if the loading couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/loadings/{id}")
    public ResponseEntity<Loading> updateLoading(@PathVariable(value = "id", required = false) final Long id, @RequestBody Loading loading)
        throws URISyntaxException {
        log.debug("REST request to update Loading : {}, {}", id, loading);
        if (loading.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loading.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loadingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Loading result = loadingRepository.save(loading);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, loading.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /loadings/:id} : Partial updates given fields of an existing loading, field will ignore if it is null
     *
     * @param id the id of the loading to save.
     * @param loading the loading to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loading,
     * or with status {@code 400 (Bad Request)} if the loading is not valid,
     * or with status {@code 404 (Not Found)} if the loading is not found,
     * or with status {@code 500 (Internal Server Error)} if the loading couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/loadings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Loading> partialUpdateLoading(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Loading loading
    ) throws URISyntaxException {
        log.debug("REST request to partial update Loading partially : {}, {}", id, loading);
        if (loading.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loading.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loadingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Loading> result = loadingRepository
            .findById(loading.getId())
            .map(existingLoading -> {
                if (loading.getYard() != null) {
                    existingLoading.setYard(loading.getYard());
                }
                if (loading.getVehicleNumber() != null) {
                    existingLoading.setVehicleNumber(loading.getVehicleNumber());
                }
                if (loading.getLoadingTime() != null) {
                    existingLoading.setLoadingTime(loading.getLoadingTime());
                }

                return existingLoading;
            })
            .map(loadingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, loading.getId().toString())
        );
    }

    /**
     * {@code GET  /loadings} : get all the loadings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of loadings in body.
     */
    @GetMapping("/loadings")
    public List<Loading> getAllLoadings() {
        log.debug("REST request to get all Loadings");
        return loadingRepository.findAll();
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
        Optional<Loading> loading = loadingRepository.findById(id);
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
        loadingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
