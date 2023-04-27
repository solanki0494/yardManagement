package com.swisui.yard.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.swisui.yard.IntegrationTest;
import com.swisui.yard.domain.LoadingProduct;
import com.swisui.yard.domain.enumeration.LoadingStatus;
import com.swisui.yard.repository.LoadingProductRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LoadingProductResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LoadingProductResourceIT {

    private static final Double DEFAULT_UNITS = 1D;
    private static final Double UPDATED_UNITS = 2D;

    private static final LoadingStatus DEFAULT_STATUS = LoadingStatus.IN;
    private static final LoadingStatus UPDATED_STATUS = LoadingStatus.OUT;

    private static final String ENTITY_API_URL = "/api/loading-products";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LoadingProductRepository loadingProductRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLoadingProductMockMvc;

    private LoadingProduct loadingProduct;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LoadingProduct createEntity(EntityManager em) {
        LoadingProduct loadingProduct = new LoadingProduct().units(DEFAULT_UNITS).status(DEFAULT_STATUS);
        return loadingProduct;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LoadingProduct createUpdatedEntity(EntityManager em) {
        LoadingProduct loadingProduct = new LoadingProduct().units(UPDATED_UNITS).status(UPDATED_STATUS);
        return loadingProduct;
    }

    @BeforeEach
    public void initTest() {
        loadingProduct = createEntity(em);
    }

    @Test
    @Transactional
    void createLoadingProduct() throws Exception {
        int databaseSizeBeforeCreate = loadingProductRepository.findAll().size();
        // Create the LoadingProduct
        restLoadingProductMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loadingProduct))
            )
            .andExpect(status().isCreated());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeCreate + 1);
        LoadingProduct testLoadingProduct = loadingProductList.get(loadingProductList.size() - 1);
        assertThat(testLoadingProduct.getUnits()).isEqualTo(DEFAULT_UNITS);
        assertThat(testLoadingProduct.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createLoadingProductWithExistingId() throws Exception {
        // Create the LoadingProduct with an existing ID
        loadingProduct.setId(1L);

        int databaseSizeBeforeCreate = loadingProductRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLoadingProductMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loadingProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLoadingProducts() throws Exception {
        // Initialize the database
        loadingProductRepository.saveAndFlush(loadingProduct);

        // Get all the loadingProductList
        restLoadingProductMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(loadingProduct.getId().intValue())))
            .andExpect(jsonPath("$.[*].units").value(hasItem(DEFAULT_UNITS.doubleValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getLoadingProduct() throws Exception {
        // Initialize the database
        loadingProductRepository.saveAndFlush(loadingProduct);

        // Get the loadingProduct
        restLoadingProductMockMvc
            .perform(get(ENTITY_API_URL_ID, loadingProduct.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(loadingProduct.getId().intValue()))
            .andExpect(jsonPath("$.units").value(DEFAULT_UNITS.doubleValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLoadingProduct() throws Exception {
        // Get the loadingProduct
        restLoadingProductMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLoadingProduct() throws Exception {
        // Initialize the database
        loadingProductRepository.saveAndFlush(loadingProduct);

        int databaseSizeBeforeUpdate = loadingProductRepository.findAll().size();

        // Update the loadingProduct
        LoadingProduct updatedLoadingProduct = loadingProductRepository.findById(loadingProduct.getId()).get();
        // Disconnect from session so that the updates on updatedLoadingProduct are not directly saved in db
        em.detach(updatedLoadingProduct);
        updatedLoadingProduct.units(UPDATED_UNITS).status(UPDATED_STATUS);

        restLoadingProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLoadingProduct.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLoadingProduct))
            )
            .andExpect(status().isOk());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeUpdate);
        LoadingProduct testLoadingProduct = loadingProductList.get(loadingProductList.size() - 1);
        assertThat(testLoadingProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testLoadingProduct.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingLoadingProduct() throws Exception {
        int databaseSizeBeforeUpdate = loadingProductRepository.findAll().size();
        loadingProduct.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoadingProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, loadingProduct.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loadingProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLoadingProduct() throws Exception {
        int databaseSizeBeforeUpdate = loadingProductRepository.findAll().size();
        loadingProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoadingProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loadingProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLoadingProduct() throws Exception {
        int databaseSizeBeforeUpdate = loadingProductRepository.findAll().size();
        loadingProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoadingProductMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loadingProduct)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLoadingProductWithPatch() throws Exception {
        // Initialize the database
        loadingProductRepository.saveAndFlush(loadingProduct);

        int databaseSizeBeforeUpdate = loadingProductRepository.findAll().size();

        // Update the loadingProduct using partial update
        LoadingProduct partialUpdatedLoadingProduct = new LoadingProduct();
        partialUpdatedLoadingProduct.setId(loadingProduct.getId());

        restLoadingProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoadingProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoadingProduct))
            )
            .andExpect(status().isOk());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeUpdate);
        LoadingProduct testLoadingProduct = loadingProductList.get(loadingProductList.size() - 1);
        assertThat(testLoadingProduct.getUnits()).isEqualTo(DEFAULT_UNITS);
        assertThat(testLoadingProduct.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateLoadingProductWithPatch() throws Exception {
        // Initialize the database
        loadingProductRepository.saveAndFlush(loadingProduct);

        int databaseSizeBeforeUpdate = loadingProductRepository.findAll().size();

        // Update the loadingProduct using partial update
        LoadingProduct partialUpdatedLoadingProduct = new LoadingProduct();
        partialUpdatedLoadingProduct.setId(loadingProduct.getId());

        partialUpdatedLoadingProduct.units(UPDATED_UNITS).status(UPDATED_STATUS);

        restLoadingProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoadingProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoadingProduct))
            )
            .andExpect(status().isOk());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeUpdate);
        LoadingProduct testLoadingProduct = loadingProductList.get(loadingProductList.size() - 1);
        assertThat(testLoadingProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testLoadingProduct.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingLoadingProduct() throws Exception {
        int databaseSizeBeforeUpdate = loadingProductRepository.findAll().size();
        loadingProduct.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoadingProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, loadingProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loadingProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLoadingProduct() throws Exception {
        int databaseSizeBeforeUpdate = loadingProductRepository.findAll().size();
        loadingProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoadingProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loadingProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLoadingProduct() throws Exception {
        int databaseSizeBeforeUpdate = loadingProductRepository.findAll().size();
        loadingProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoadingProductMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(loadingProduct))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LoadingProduct in the database
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLoadingProduct() throws Exception {
        // Initialize the database
        loadingProductRepository.saveAndFlush(loadingProduct);

        int databaseSizeBeforeDelete = loadingProductRepository.findAll().size();

        // Delete the loadingProduct
        restLoadingProductMockMvc
            .perform(delete(ENTITY_API_URL_ID, loadingProduct.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LoadingProduct> loadingProductList = loadingProductRepository.findAll();
        assertThat(loadingProductList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
