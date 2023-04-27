package com.swisui.yard.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.swisui.yard.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LoadingProductTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LoadingProduct.class);
        LoadingProduct loadingProduct1 = new LoadingProduct();
        loadingProduct1.setId(1L);
        LoadingProduct loadingProduct2 = new LoadingProduct();
        loadingProduct2.setId(loadingProduct1.getId());
        assertThat(loadingProduct1).isEqualTo(loadingProduct2);
        loadingProduct2.setId(2L);
        assertThat(loadingProduct1).isNotEqualTo(loadingProduct2);
        loadingProduct1.setId(null);
        assertThat(loadingProduct1).isNotEqualTo(loadingProduct2);
    }
}
