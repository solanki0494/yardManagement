package com.swisui.yard.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.swisui.yard.IntegrationTest;
import com.swisui.yard.domain.SalesProduct;
import com.swisui.yard.repository.SalesProductRepository;
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
 * Integration tests for the {@link SalesProductResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SalesProductResourceIT {

    private static final Double DEFAULT_UNITS = 1D;
    private static final Double UPDATED_UNITS = 2D;

    private static final Double DEFAULT_UNIT_PRICE = 1D;
    private static final Double UPDATED_UNIT_PRICE = 2D;

    private static final Double DEFAULT_GST = 1D;
    private static final Double UPDATED_GST = 2D;

    private static final Double DEFAULT_TOTAL = 1D;
    private static final Double UPDATED_TOTAL = 2D;

    private static final String ENTITY_API_URL = "/api/sales-products";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SalesProductRepository salesProductRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSalesProductMockMvc;

    private SalesProduct salesProduct;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SalesProduct createEntity(EntityManager em) {
        SalesProduct salesProduct = new SalesProduct()
            .units(DEFAULT_UNITS)
            .unitPrice(DEFAULT_UNIT_PRICE)
            .gst(DEFAULT_GST)
            .total(DEFAULT_TOTAL);
        return salesProduct;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SalesProduct createUpdatedEntity(EntityManager em) {
        SalesProduct salesProduct = new SalesProduct()
            .units(UPDATED_UNITS)
            .unitPrice(UPDATED_UNIT_PRICE)
            .gst(UPDATED_GST)
            .total(UPDATED_TOTAL);
        return salesProduct;
    }

    @BeforeEach
    public void initTest() {
        salesProduct = createEntity(em);
    }

    @Test
    @Transactional
    void createSalesProduct() throws Exception {
        int databaseSizeBeforeCreate = salesProductRepository.findAll().size();
        // Create the SalesProduct
        restSalesProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salesProduct)))
            .andExpect(status().isCreated());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeCreate + 1);
        SalesProduct testSalesProduct = salesProductList.get(salesProductList.size() - 1);
        assertThat(testSalesProduct.getUnits()).isEqualTo(DEFAULT_UNITS);
        assertThat(testSalesProduct.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testSalesProduct.getGst()).isEqualTo(DEFAULT_GST);
        assertThat(testSalesProduct.getTotal()).isEqualTo(DEFAULT_TOTAL);
    }

    @Test
    @Transactional
    void createSalesProductWithExistingId() throws Exception {
        // Create the SalesProduct with an existing ID
        salesProduct.setId(1L);

        int databaseSizeBeforeCreate = salesProductRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSalesProductMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salesProduct)))
            .andExpect(status().isBadRequest());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSalesProducts() throws Exception {
        // Initialize the database
        salesProductRepository.saveAndFlush(salesProduct);

        // Get all the salesProductList
        restSalesProductMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(salesProduct.getId().intValue())))
            .andExpect(jsonPath("$.[*].units").value(hasItem(DEFAULT_UNITS.doubleValue())))
            .andExpect(jsonPath("$.[*].unitPrice").value(hasItem(DEFAULT_UNIT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].gst").value(hasItem(DEFAULT_GST.doubleValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())));
    }

    @Test
    @Transactional
    void getSalesProduct() throws Exception {
        // Initialize the database
        salesProductRepository.saveAndFlush(salesProduct);

        // Get the salesProduct
        restSalesProductMockMvc
            .perform(get(ENTITY_API_URL_ID, salesProduct.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(salesProduct.getId().intValue()))
            .andExpect(jsonPath("$.units").value(DEFAULT_UNITS.doubleValue()))
            .andExpect(jsonPath("$.unitPrice").value(DEFAULT_UNIT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.gst").value(DEFAULT_GST.doubleValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingSalesProduct() throws Exception {
        // Get the salesProduct
        restSalesProductMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSalesProduct() throws Exception {
        // Initialize the database
        salesProductRepository.saveAndFlush(salesProduct);

        int databaseSizeBeforeUpdate = salesProductRepository.findAll().size();

        // Update the salesProduct
        SalesProduct updatedSalesProduct = salesProductRepository.findById(salesProduct.getId()).get();
        // Disconnect from session so that the updates on updatedSalesProduct are not directly saved in db
        em.detach(updatedSalesProduct);
        updatedSalesProduct.units(UPDATED_UNITS).unitPrice(UPDATED_UNIT_PRICE).gst(UPDATED_GST).total(UPDATED_TOTAL);

        restSalesProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSalesProduct.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSalesProduct))
            )
            .andExpect(status().isOk());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeUpdate);
        SalesProduct testSalesProduct = salesProductList.get(salesProductList.size() - 1);
        assertThat(testSalesProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testSalesProduct.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testSalesProduct.getGst()).isEqualTo(UPDATED_GST);
        assertThat(testSalesProduct.getTotal()).isEqualTo(UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void putNonExistingSalesProduct() throws Exception {
        int databaseSizeBeforeUpdate = salesProductRepository.findAll().size();
        salesProduct.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, salesProduct.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSalesProduct() throws Exception {
        int databaseSizeBeforeUpdate = salesProductRepository.findAll().size();
        salesProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salesProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSalesProduct() throws Exception {
        int databaseSizeBeforeUpdate = salesProductRepository.findAll().size();
        salesProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesProductMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salesProduct)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSalesProductWithPatch() throws Exception {
        // Initialize the database
        salesProductRepository.saveAndFlush(salesProduct);

        int databaseSizeBeforeUpdate = salesProductRepository.findAll().size();

        // Update the salesProduct using partial update
        SalesProduct partialUpdatedSalesProduct = new SalesProduct();
        partialUpdatedSalesProduct.setId(salesProduct.getId());

        partialUpdatedSalesProduct.units(UPDATED_UNITS);

        restSalesProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalesProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalesProduct))
            )
            .andExpect(status().isOk());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeUpdate);
        SalesProduct testSalesProduct = salesProductList.get(salesProductList.size() - 1);
        assertThat(testSalesProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testSalesProduct.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testSalesProduct.getGst()).isEqualTo(DEFAULT_GST);
        assertThat(testSalesProduct.getTotal()).isEqualTo(DEFAULT_TOTAL);
    }

    @Test
    @Transactional
    void fullUpdateSalesProductWithPatch() throws Exception {
        // Initialize the database
        salesProductRepository.saveAndFlush(salesProduct);

        int databaseSizeBeforeUpdate = salesProductRepository.findAll().size();

        // Update the salesProduct using partial update
        SalesProduct partialUpdatedSalesProduct = new SalesProduct();
        partialUpdatedSalesProduct.setId(salesProduct.getId());

        partialUpdatedSalesProduct.units(UPDATED_UNITS).unitPrice(UPDATED_UNIT_PRICE).gst(UPDATED_GST).total(UPDATED_TOTAL);

        restSalesProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalesProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalesProduct))
            )
            .andExpect(status().isOk());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeUpdate);
        SalesProduct testSalesProduct = salesProductList.get(salesProductList.size() - 1);
        assertThat(testSalesProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testSalesProduct.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testSalesProduct.getGst()).isEqualTo(UPDATED_GST);
        assertThat(testSalesProduct.getTotal()).isEqualTo(UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void patchNonExistingSalesProduct() throws Exception {
        int databaseSizeBeforeUpdate = salesProductRepository.findAll().size();
        salesProduct.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, salesProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salesProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSalesProduct() throws Exception {
        int databaseSizeBeforeUpdate = salesProductRepository.findAll().size();
        salesProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salesProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSalesProduct() throws Exception {
        int databaseSizeBeforeUpdate = salesProductRepository.findAll().size();
        salesProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesProductMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(salesProduct))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SalesProduct in the database
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSalesProduct() throws Exception {
        // Initialize the database
        salesProductRepository.saveAndFlush(salesProduct);

        int databaseSizeBeforeDelete = salesProductRepository.findAll().size();

        // Delete the salesProduct
        restSalesProductMockMvc
            .perform(delete(ENTITY_API_URL_ID, salesProduct.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SalesProduct> salesProductList = salesProductRepository.findAll();
        assertThat(salesProductList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
