package com.swisui.yard.web.rest;

import com.swisui.yard.domain.Inventory;
import com.swisui.yard.repository.InventoryRepository;
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
 * REST controller for managing {@link com.swisui.yard.domain.Inventory}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InventoryResource {

    private final Logger log = LoggerFactory.getLogger(InventoryResource.class);

    private static final String ENTITY_NAME = "inventory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InventoryRepository inventoryRepository;

    public InventoryResource(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    /**
     * {@code POST  /inventories} : Create a new inventory.
     *
     * @param inventory the inventory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new inventory, or with status {@code 400 (Bad Request)} if the inventory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/inventories")
    public ResponseEntity<Inventory> createInventory(@RequestBody Inventory inventory) throws URISyntaxException {
        log.debug("REST request to save Inventory : {}", inventory);
        if (inventory.getProduct() == null || inventory.getProduct().getId() == null) {
            throw new BadRequestAlertException("A new inventory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Inventory result = inventoryRepository.save(inventory);
        return ResponseEntity
            .created(new URI("/api/inventories/" + result.getProduct().getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getProduct().getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /inventories/:id} : Updates an existing inventory.
     *
     * @param id the id of the inventory to save.
     * @param inventory the inventory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inventory,
     * or with status {@code 400 (Bad Request)} if the inventory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the inventory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/inventories/{id}")
    public ResponseEntity<Inventory> updateInventory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Inventory inventory
    ) throws URISyntaxException {
        log.debug("REST request to update Inventory : {}, {}", id, inventory);
        if (inventory.getProduct().getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inventory.getProduct().getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inventoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Inventory result = inventoryRepository.save(inventory);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inventory.getProduct().getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /inventories/:id} : Partial updates given fields of an existing inventory, field will ignore if it is null
     *
     * @param id the id of the inventory to save.
     * @param inventory the inventory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inventory,
     * or with status {@code 400 (Bad Request)} if the inventory is not valid,
     * or with status {@code 404 (Not Found)} if the inventory is not found,
     * or with status {@code 500 (Internal Server Error)} if the inventory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/inventories/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Inventory> partialUpdateInventory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Inventory inventory
    ) throws URISyntaxException {
        log.debug("REST request to partial update Inventory partially : {}, {}", id, inventory);
        if (inventory.getProduct().getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inventory.getProduct().getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inventoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Inventory> result = inventoryRepository
            .findById(inventory.getProduct().getId())
            .map(existingInventory -> {
                if (inventory.getUnits() != null) {
                    existingInventory.setUnits(inventory.getUnits());
                }

                return existingInventory;
            })
            .map(inventoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inventory.getProduct().getId().toString())
        );
    }

    /**
     * {@code GET  /inventories} : get all the inventories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of inventories in body.
     */
    @GetMapping("/inventories")
    public List<Inventory> getAllInventories() {
        log.debug("REST request to get all Inventories");
        return inventoryRepository.findAll();
    }

    /**
     * {@code GET  /inventories/:id} : get the "id" inventory.
     *
     * @param id the id of the inventory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the inventory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/inventories/{id}")
    public ResponseEntity<Inventory> getInventory(@PathVariable Long id) {
        log.debug("REST request to get Inventory : {}", id);
        Optional<Inventory> inventory = inventoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(inventory);
    }

    /**
     * {@code DELETE  /inventories/:id} : delete the "id" inventory.
     *
     * @param id the id of the inventory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/inventories/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        log.debug("REST request to delete Inventory : {}", id);
        inventoryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
