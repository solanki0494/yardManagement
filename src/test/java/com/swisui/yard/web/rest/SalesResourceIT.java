package com.swisui.yard.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.swisui.yard.IntegrationTest;
import com.swisui.yard.domain.Sales;
import com.swisui.yard.repository.SalesRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link SalesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SalesResourceIT {

    private static final Integer DEFAULT_INVOICE_ID = 1;
    private static final Integer UPDATED_INVOICE_ID = 2;

    private static final Instant DEFAULT_SALE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_SALE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_BUYER = "AAAAAAAAAA";
    private static final String UPDATED_BUYER = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sales";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSalesMockMvc;

    private Sales sales;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sales createEntity(EntityManager em) {
        Sales sales = new Sales().invoiceId(DEFAULT_INVOICE_ID).saleTime(DEFAULT_SALE_TIME).buyer(DEFAULT_BUYER);
        return sales;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sales createUpdatedEntity(EntityManager em) {
        Sales sales = new Sales().invoiceId(UPDATED_INVOICE_ID).saleTime(UPDATED_SALE_TIME).buyer(UPDATED_BUYER);
        return sales;
    }

    @BeforeEach
    public void initTest() {
        sales = createEntity(em);
    }

    @Test
    @Transactional
    void createSales() throws Exception {
        int databaseSizeBeforeCreate = salesRepository.findAll().size();
        // Create the Sales
        restSalesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sales)))
            .andExpect(status().isCreated());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeCreate + 1);
        Sales testSales = salesList.get(salesList.size() - 1);
        assertThat(testSales.getInvoiceId()).isEqualTo(DEFAULT_INVOICE_ID);
        assertThat(testSales.getSaleTime()).isEqualTo(DEFAULT_SALE_TIME);
        assertThat(testSales.getBuyer()).isEqualTo(DEFAULT_BUYER);
    }

    @Test
    @Transactional
    void createSalesWithExistingId() throws Exception {
        // Create the Sales with an existing ID
        sales.setId(1L);

        int databaseSizeBeforeCreate = salesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSalesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sales)))
            .andExpect(status().isBadRequest());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSales() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get all the salesList
        restSalesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sales.getId().intValue())))
            .andExpect(jsonPath("$.[*].invoiceId").value(hasItem(DEFAULT_INVOICE_ID)))
            .andExpect(jsonPath("$.[*].saleTime").value(hasItem(DEFAULT_SALE_TIME.toString())))
            .andExpect(jsonPath("$.[*].buyer").value(hasItem(DEFAULT_BUYER)));
    }

    @Test
    @Transactional
    void getSales() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        // Get the sales
        restSalesMockMvc
            .perform(get(ENTITY_API_URL_ID, sales.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sales.getId().intValue()))
            .andExpect(jsonPath("$.invoiceId").value(DEFAULT_INVOICE_ID))
            .andExpect(jsonPath("$.saleTime").value(DEFAULT_SALE_TIME.toString()))
            .andExpect(jsonPath("$.buyer").value(DEFAULT_BUYER));
    }

    @Test
    @Transactional
    void getNonExistingSales() throws Exception {
        // Get the sales
        restSalesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSales() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        int databaseSizeBeforeUpdate = salesRepository.findAll().size();

        // Update the sales
        Sales updatedSales = salesRepository.findById(sales.getId()).get();
        // Disconnect from session so that the updates on updatedSales are not directly saved in db
        em.detach(updatedSales);
        updatedSales.invoiceId(UPDATED_INVOICE_ID).saleTime(UPDATED_SALE_TIME).buyer(UPDATED_BUYER);

        restSalesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSales.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSales))
            )
            .andExpect(status().isOk());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
        Sales testSales = salesList.get(salesList.size() - 1);
        assertThat(testSales.getInvoiceId()).isEqualTo(UPDATED_INVOICE_ID);
        assertThat(testSales.getSaleTime()).isEqualTo(UPDATED_SALE_TIME);
        assertThat(testSales.getBuyer()).isEqualTo(UPDATED_BUYER);
    }

    @Test
    @Transactional
    void putNonExistingSales() throws Exception {
        int databaseSizeBeforeUpdate = salesRepository.findAll().size();
        sales.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sales.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sales))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSales() throws Exception {
        int databaseSizeBeforeUpdate = salesRepository.findAll().size();
        sales.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sales))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSales() throws Exception {
        int databaseSizeBeforeUpdate = salesRepository.findAll().size();
        sales.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sales)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSalesWithPatch() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        int databaseSizeBeforeUpdate = salesRepository.findAll().size();

        // Update the sales using partial update
        Sales partialUpdatedSales = new Sales();
        partialUpdatedSales.setId(sales.getId());

        restSalesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSales.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSales))
            )
            .andExpect(status().isOk());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
        Sales testSales = salesList.get(salesList.size() - 1);
        assertThat(testSales.getInvoiceId()).isEqualTo(DEFAULT_INVOICE_ID);
        assertThat(testSales.getSaleTime()).isEqualTo(DEFAULT_SALE_TIME);
        assertThat(testSales.getBuyer()).isEqualTo(DEFAULT_BUYER);
    }

    @Test
    @Transactional
    void fullUpdateSalesWithPatch() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        int databaseSizeBeforeUpdate = salesRepository.findAll().size();

        // Update the sales using partial update
        Sales partialUpdatedSales = new Sales();
        partialUpdatedSales.setId(sales.getId());

        partialUpdatedSales.invoiceId(UPDATED_INVOICE_ID).saleTime(UPDATED_SALE_TIME).buyer(UPDATED_BUYER);

        restSalesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSales.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSales))
            )
            .andExpect(status().isOk());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
        Sales testSales = salesList.get(salesList.size() - 1);
        assertThat(testSales.getInvoiceId()).isEqualTo(UPDATED_INVOICE_ID);
        assertThat(testSales.getSaleTime()).isEqualTo(UPDATED_SALE_TIME);
        assertThat(testSales.getBuyer()).isEqualTo(UPDATED_BUYER);
    }

    @Test
    @Transactional
    void patchNonExistingSales() throws Exception {
        int databaseSizeBeforeUpdate = salesRepository.findAll().size();
        sales.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sales.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sales))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSales() throws Exception {
        int databaseSizeBeforeUpdate = salesRepository.findAll().size();
        sales.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sales))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSales() throws Exception {
        int databaseSizeBeforeUpdate = salesRepository.findAll().size();
        sales.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sales)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sales in the database
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSales() throws Exception {
        // Initialize the database
        salesRepository.saveAndFlush(sales);

        int databaseSizeBeforeDelete = salesRepository.findAll().size();

        // Delete the sales
        restSalesMockMvc
            .perform(delete(ENTITY_API_URL_ID, sales.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sales> salesList = salesRepository.findAll();
        assertThat(salesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
