package com.swisui.yard.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.swisui.yard.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SalesProductTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SalesProduct.class);
        SalesProduct salesProduct1 = new SalesProduct();
        salesProduct1.setId(1L);
        SalesProduct salesProduct2 = new SalesProduct();
        salesProduct2.setId(salesProduct1.getId());
        assertThat(salesProduct1).isEqualTo(salesProduct2);
        salesProduct2.setId(2L);
        assertThat(salesProduct1).isNotEqualTo(salesProduct2);
        salesProduct1.setId(null);
        assertThat(salesProduct1).isNotEqualTo(salesProduct2);
    }
}
