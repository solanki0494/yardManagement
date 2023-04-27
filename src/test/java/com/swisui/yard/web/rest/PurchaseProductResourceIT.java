package com.swisui.yard.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.swisui.yard.IntegrationTest;
import com.swisui.yard.domain.PurchaseProduct;
import com.swisui.yard.repository.PurchaseProductRepository;
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
 * Integration tests for the {@link PurchaseProductResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PurchaseProductResourceIT {

    private static final Double DEFAULT_UNITS = 1D;
    private static final Double UPDATED_UNITS = 2D;

    private static final Double DEFAULT_UNIT_PRICE = 1D;
    private static final Double UPDATED_UNIT_PRICE = 2D;

    private static final Double DEFAULT_GST = 1D;
    private static final Double UPDATED_GST = 2D;

    private static final Double DEFAULT_TOTAL = 1D;
    private static final Double UPDATED_TOTAL = 2D;

    private static final String ENTITY_API_URL = "/api/purchase-products";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PurchaseProductRepository purchaseProductRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPurchaseProductMockMvc;

    private PurchaseProduct purchaseProduct;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseProduct createEntity(EntityManager em) {
        PurchaseProduct purchaseProduct = new PurchaseProduct()
            .units(DEFAULT_UNITS)
            .unitPrice(DEFAULT_UNIT_PRICE)
            .gst(DEFAULT_GST)
            .total(DEFAULT_TOTAL);
        return purchaseProduct;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PurchaseProduct createUpdatedEntity(EntityManager em) {
        PurchaseProduct purchaseProduct = new PurchaseProduct()
            .units(UPDATED_UNITS)
            .unitPrice(UPDATED_UNIT_PRICE)
            .gst(UPDATED_GST)
            .total(UPDATED_TOTAL);
        return purchaseProduct;
    }

    @BeforeEach
    public void initTest() {
        purchaseProduct = createEntity(em);
    }

    @Test
    @Transactional
    void createPurchaseProduct() throws Exception {
        int databaseSizeBeforeCreate = purchaseProductRepository.findAll().size();
        // Create the PurchaseProduct
        restPurchaseProductMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isCreated());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeCreate + 1);
        PurchaseProduct testPurchaseProduct = purchaseProductList.get(purchaseProductList.size() - 1);
        assertThat(testPurchaseProduct.getUnits()).isEqualTo(DEFAULT_UNITS);
        assertThat(testPurchaseProduct.getUnitPrice()).isEqualTo(DEFAULT_UNIT_PRICE);
        assertThat(testPurchaseProduct.getGst()).isEqualTo(DEFAULT_GST);
        assertThat(testPurchaseProduct.getTotal()).isEqualTo(DEFAULT_TOTAL);
    }

    @Test
    @Transactional
    void createPurchaseProductWithExistingId() throws Exception {
        // Create the PurchaseProduct with an existing ID
        purchaseProduct.setId(1L);

        int databaseSizeBeforeCreate = purchaseProductRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPurchaseProductMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPurchaseProducts() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        // Get all the purchaseProductList
        restPurchaseProductMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(purchaseProduct.getId().intValue())))
            .andExpect(jsonPath("$.[*].units").value(hasItem(DEFAULT_UNITS.doubleValue())))
            .andExpect(jsonPath("$.[*].unitPrice").value(hasItem(DEFAULT_UNIT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].gst").value(hasItem(DEFAULT_GST.doubleValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())));
    }

    @Test
    @Transactional
    void getPurchaseProduct() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        // Get the purchaseProduct
        restPurchaseProductMockMvc
            .perform(get(ENTITY_API_URL_ID, purchaseProduct.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(purchaseProduct.getId().intValue()))
            .andExpect(jsonPath("$.units").value(DEFAULT_UNITS.doubleValue()))
            .andExpect(jsonPath("$.unitPrice").value(DEFAULT_UNIT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.gst").value(DEFAULT_GST.doubleValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingPurchaseProduct() throws Exception {
        // Get the purchaseProduct
        restPurchaseProductMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPurchaseProduct() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();

        // Update the purchaseProduct
        PurchaseProduct updatedPurchaseProduct = purchaseProductRepository.findById(purchaseProduct.getId()).get();
        // Disconnect from session so that the updates on updatedPurchaseProduct are not directly saved in db
        em.detach(updatedPurchaseProduct);
        updatedPurchaseProduct.units(UPDATED_UNITS).unitPrice(UPDATED_UNIT_PRICE).gst(UPDATED_GST).total(UPDATED_TOTAL);

        restPurchaseProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPurchaseProduct.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPurchaseProduct))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
        PurchaseProduct testPurchaseProduct = purchaseProductList.get(purchaseProductList.size() - 1);
        assertThat(testPurchaseProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testPurchaseProduct.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testPurchaseProduct.getGst()).isEqualTo(UPDATED_GST);
        assertThat(testPurchaseProduct.getTotal()).isEqualTo(UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void putNonExistingPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, purchaseProduct.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePurchaseProductWithPatch() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();

        // Update the purchaseProduct using partial update
        PurchaseProduct partialUpdatedPurchaseProduct = new PurchaseProduct();
        partialUpdatedPurchaseProduct.setId(purchaseProduct.getId());

        partialUpdatedPurchaseProduct.unitPrice(UPDATED_UNIT_PRICE).total(UPDATED_TOTAL);

        restPurchaseProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPurchaseProduct))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
        PurchaseProduct testPurchaseProduct = purchaseProductList.get(purchaseProductList.size() - 1);
        assertThat(testPurchaseProduct.getUnits()).isEqualTo(DEFAULT_UNITS);
        assertThat(testPurchaseProduct.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testPurchaseProduct.getGst()).isEqualTo(DEFAULT_GST);
        assertThat(testPurchaseProduct.getTotal()).isEqualTo(UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void fullUpdatePurchaseProductWithPatch() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();

        // Update the purchaseProduct using partial update
        PurchaseProduct partialUpdatedPurchaseProduct = new PurchaseProduct();
        partialUpdatedPurchaseProduct.setId(purchaseProduct.getId());

        partialUpdatedPurchaseProduct.units(UPDATED_UNITS).unitPrice(UPDATED_UNIT_PRICE).gst(UPDATED_GST).total(UPDATED_TOTAL);

        restPurchaseProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPurchaseProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPurchaseProduct))
            )
            .andExpect(status().isOk());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
        PurchaseProduct testPurchaseProduct = purchaseProductList.get(purchaseProductList.size() - 1);
        assertThat(testPurchaseProduct.getUnits()).isEqualTo(UPDATED_UNITS);
        assertThat(testPurchaseProduct.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testPurchaseProduct.getGst()).isEqualTo(UPDATED_GST);
        assertThat(testPurchaseProduct.getTotal()).isEqualTo(UPDATED_TOTAL);
    }

    @Test
    @Transactional
    void patchNonExistingPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, purchaseProduct.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isBadRequest());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPurchaseProduct() throws Exception {
        int databaseSizeBeforeUpdate = purchaseProductRepository.findAll().size();
        purchaseProduct.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPurchaseProductMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(purchaseProduct))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PurchaseProduct in the database
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePurchaseProduct() throws Exception {
        // Initialize the database
        purchaseProductRepository.saveAndFlush(purchaseProduct);

        int databaseSizeBeforeDelete = purchaseProductRepository.findAll().size();

        // Delete the purchaseProduct
        restPurchaseProductMockMvc
            .perform(delete(ENTITY_API_URL_ID, purchaseProduct.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PurchaseProduct> purchaseProductList = purchaseProductRepository.findAll();
        assertThat(purchaseProductList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
