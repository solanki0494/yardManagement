package com.swisui.yard.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.swisui.yard.IntegrationTest;
import com.swisui.yard.domain.Loading;
import com.swisui.yard.repository.LoadingRepository;
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
 * Integration tests for the {@link LoadingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LoadingResourceIT {

    private static final String DEFAULT_YARD = "AAAAAAAAAA";
    private static final String UPDATED_YARD = "BBBBBBBBBB";

    private static final String DEFAULT_VEHICLE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_VEHICLE_NUMBER = "BBBBBBBBBB";

    private static final Instant DEFAULT_LOADING_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LOADING_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/loadings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LoadingRepository loadingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLoadingMockMvc;

    private Loading loading;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Loading createEntity(EntityManager em) {
        Loading loading = new Loading().yard(DEFAULT_YARD).vehicleNumber(DEFAULT_VEHICLE_NUMBER).loadingTime(DEFAULT_LOADING_TIME);
        return loading;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Loading createUpdatedEntity(EntityManager em) {
        Loading loading = new Loading().yard(UPDATED_YARD).vehicleNumber(UPDATED_VEHICLE_NUMBER).loadingTime(UPDATED_LOADING_TIME);
        return loading;
    }

    @BeforeEach
    public void initTest() {
        loading = createEntity(em);
    }

    @Test
    @Transactional
    void createLoading() throws Exception {
        int databaseSizeBeforeCreate = loadingRepository.findAll().size();
        // Create the Loading
        restLoadingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loading)))
            .andExpect(status().isCreated());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeCreate + 1);
        Loading testLoading = loadingList.get(loadingList.size() - 1);
        assertThat(testLoading.getYard()).isEqualTo(DEFAULT_YARD);
        assertThat(testLoading.getVehicleNumber()).isEqualTo(DEFAULT_VEHICLE_NUMBER);
        assertThat(testLoading.getLoadingTime()).isEqualTo(DEFAULT_LOADING_TIME);
    }

    @Test
    @Transactional
    void createLoadingWithExistingId() throws Exception {
        // Create the Loading with an existing ID
        loading.setId(1L);

        int databaseSizeBeforeCreate = loadingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLoadingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loading)))
            .andExpect(status().isBadRequest());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLoadings() throws Exception {
        // Initialize the database
        loadingRepository.saveAndFlush(loading);

        // Get all the loadingList
        restLoadingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(loading.getId().intValue())))
            .andExpect(jsonPath("$.[*].yard").value(hasItem(DEFAULT_YARD)))
            .andExpect(jsonPath("$.[*].vehicleNumber").value(hasItem(DEFAULT_VEHICLE_NUMBER)))
            .andExpect(jsonPath("$.[*].loadingTime").value(hasItem(DEFAULT_LOADING_TIME.toString())));
    }

    @Test
    @Transactional
    void getLoading() throws Exception {
        // Initialize the database
        loadingRepository.saveAndFlush(loading);

        // Get the loading
        restLoadingMockMvc
            .perform(get(ENTITY_API_URL_ID, loading.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(loading.getId().intValue()))
            .andExpect(jsonPath("$.yard").value(DEFAULT_YARD))
            .andExpect(jsonPath("$.vehicleNumber").value(DEFAULT_VEHICLE_NUMBER))
            .andExpect(jsonPath("$.loadingTime").value(DEFAULT_LOADING_TIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLoading() throws Exception {
        // Get the loading
        restLoadingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLoading() throws Exception {
        // Initialize the database
        loadingRepository.saveAndFlush(loading);

        int databaseSizeBeforeUpdate = loadingRepository.findAll().size();

        // Update the loading
        Loading updatedLoading = loadingRepository.findById(loading.getId()).get();
        // Disconnect from session so that the updates on updatedLoading are not directly saved in db
        em.detach(updatedLoading);
        updatedLoading.yard(UPDATED_YARD).vehicleNumber(UPDATED_VEHICLE_NUMBER).loadingTime(UPDATED_LOADING_TIME);

        restLoadingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLoading.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLoading))
            )
            .andExpect(status().isOk());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeUpdate);
        Loading testLoading = loadingList.get(loadingList.size() - 1);
        assertThat(testLoading.getYard()).isEqualTo(UPDATED_YARD);
        assertThat(testLoading.getVehicleNumber()).isEqualTo(UPDATED_VEHICLE_NUMBER);
        assertThat(testLoading.getLoadingTime()).isEqualTo(UPDATED_LOADING_TIME);
    }

    @Test
    @Transactional
    void putNonExistingLoading() throws Exception {
        int databaseSizeBeforeUpdate = loadingRepository.findAll().size();
        loading.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoadingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, loading.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loading))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLoading() throws Exception {
        int databaseSizeBeforeUpdate = loadingRepository.findAll().size();
        loading.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoadingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loading))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLoading() throws Exception {
        int databaseSizeBeforeUpdate = loadingRepository.findAll().size();
        loading.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoadingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loading)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLoadingWithPatch() throws Exception {
        // Initialize the database
        loadingRepository.saveAndFlush(loading);

        int databaseSizeBeforeUpdate = loadingRepository.findAll().size();

        // Update the loading using partial update
        Loading partialUpdatedLoading = new Loading();
        partialUpdatedLoading.setId(loading.getId());

        partialUpdatedLoading.yard(UPDATED_YARD).vehicleNumber(UPDATED_VEHICLE_NUMBER).loadingTime(UPDATED_LOADING_TIME);

        restLoadingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoading.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoading))
            )
            .andExpect(status().isOk());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeUpdate);
        Loading testLoading = loadingList.get(loadingList.size() - 1);
        assertThat(testLoading.getYard()).isEqualTo(UPDATED_YARD);
        assertThat(testLoading.getVehicleNumber()).isEqualTo(UPDATED_VEHICLE_NUMBER);
        assertThat(testLoading.getLoadingTime()).isEqualTo(UPDATED_LOADING_TIME);
    }

    @Test
    @Transactional
    void fullUpdateLoadingWithPatch() throws Exception {
        // Initialize the database
        loadingRepository.saveAndFlush(loading);

        int databaseSizeBeforeUpdate = loadingRepository.findAll().size();

        // Update the loading using partial update
        Loading partialUpdatedLoading = new Loading();
        partialUpdatedLoading.setId(loading.getId());

        partialUpdatedLoading.yard(UPDATED_YARD).vehicleNumber(UPDATED_VEHICLE_NUMBER).loadingTime(UPDATED_LOADING_TIME);

        restLoadingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoading.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoading))
            )
            .andExpect(status().isOk());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeUpdate);
        Loading testLoading = loadingList.get(loadingList.size() - 1);
        assertThat(testLoading.getYard()).isEqualTo(UPDATED_YARD);
        assertThat(testLoading.getVehicleNumber()).isEqualTo(UPDATED_VEHICLE_NUMBER);
        assertThat(testLoading.getLoadingTime()).isEqualTo(UPDATED_LOADING_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingLoading() throws Exception {
        int databaseSizeBeforeUpdate = loadingRepository.findAll().size();
        loading.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoadingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, loading.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loading))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLoading() throws Exception {
        int databaseSizeBeforeUpdate = loadingRepository.findAll().size();
        loading.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoadingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loading))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLoading() throws Exception {
        int databaseSizeBeforeUpdate = loadingRepository.findAll().size();
        loading.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoadingMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(loading)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Loading in the database
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLoading() throws Exception {
        // Initialize the database
        loadingRepository.saveAndFlush(loading);

        int databaseSizeBeforeDelete = loadingRepository.findAll().size();

        // Delete the loading
        restLoadingMockMvc
            .perform(delete(ENTITY_API_URL_ID, loading.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Loading> loadingList = loadingRepository.findAll();
        assertThat(loadingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
