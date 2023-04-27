package com.swisui.yard.web.rest;

import com.swisui.yard.domain.Sales;
import com.swisui.yard.repository.SalesRepository;
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
 * REST controller for managing {@link com.swisui.yard.domain.Sales}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SalesResource {

    private final Logger log = LoggerFactory.getLogger(SalesResource.class);

    private static final String ENTITY_NAME = "sales";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SalesRepository salesRepository;

    public SalesResource(SalesRepository salesRepository) {
        this.salesRepository = salesRepository;
    }

    /**
     * {@code POST  /sales} : Create a new sales.
     *
     * @param sales the sales to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sales, or with status {@code 400 (Bad Request)} if the sales has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sales")
    public ResponseEntity<Sales> createSales(@RequestBody Sales sales) throws URISyntaxException {
        log.debug("REST request to save Sales : {}", sales);
        if (sales.getId() != null) {
            throw new BadRequestAlertException("A new sales cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sales result = salesRepository.save(sales);
        return ResponseEntity
            .created(new URI("/api/sales/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sales/:id} : Updates an existing sales.
     *
     * @param id the id of the sales to save.
     * @param sales the sales to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sales,
     * or with status {@code 400 (Bad Request)} if the sales is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sales couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sales/{id}")
    public ResponseEntity<Sales> updateSales(@PathVariable(value = "id", required = false) final Long id, @RequestBody Sales sales)
        throws URISyntaxException {
        log.debug("REST request to update Sales : {}, {}", id, sales);
        if (sales.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sales.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Sales result = salesRepository.save(sales);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sales.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sales/:id} : Partial updates given fields of an existing sales, field will ignore if it is null
     *
     * @param id the id of the sales to save.
     * @param sales the sales to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sales,
     * or with status {@code 400 (Bad Request)} if the sales is not valid,
     * or with status {@code 404 (Not Found)} if the sales is not found,
     * or with status {@code 500 (Internal Server Error)} if the sales couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sales/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Sales> partialUpdateSales(@PathVariable(value = "id", required = false) final Long id, @RequestBody Sales sales)
        throws URISyntaxException {
        log.debug("REST request to partial update Sales partially : {}, {}", id, sales);
        if (sales.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sales.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!salesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Sales> result = salesRepository
            .findById(sales.getId())
            .map(existingSales -> {
                if (sales.getInvoiceId() != null) {
                    existingSales.setInvoiceId(sales.getInvoiceId());
                }
                if (sales.getSaleTime() != null) {
                    existingSales.setSaleTime(sales.getSaleTime());
                }
                if (sales.getBuyer() != null) {
                    existingSales.setBuyer(sales.getBuyer());
                }

                return existingSales;
            })
            .map(salesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sales.getId().toString())
        );
    }

    /**
     * {@code GET  /sales} : get all the sales.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sales in body.
     */
    @GetMapping("/sales")
    public List<Sales> getAllSales() {
        log.debug("REST request to get all Sales");
        return salesRepository.findAll();
    }

    /**
     * {@code GET  /sales/:id} : get the "id" sales.
     *
     * @param id the id of the sales to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sales, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sales/{id}")
    public ResponseEntity<Sales> getSales(@PathVariable Long id) {
        log.debug("REST request to get Sales : {}", id);
        Optional<Sales> sales = salesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sales);
    }

    /**
     * {@code DELETE  /sales/:id} : delete the "id" sales.
     *
     * @param id the id of the sales to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sales/{id}")
    public ResponseEntity<Void> deleteSales(@PathVariable Long id) {
        log.debug("REST request to delete Sales : {}", id);
        salesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
