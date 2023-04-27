package com.swisui.yard.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.swisui.yard.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PurchaseProductTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PurchaseProduct.class);
        PurchaseProduct purchaseProduct1 = new PurchaseProduct();
        purchaseProduct1.setId(1L);
        PurchaseProduct purchaseProduct2 = new PurchaseProduct();
        purchaseProduct2.setId(purchaseProduct1.getId());
        assertThat(purchaseProduct1).isEqualTo(purchaseProduct2);
        purchaseProduct2.setId(2L);
        assertThat(purchaseProduct1).isNotEqualTo(purchaseProduct2);
        purchaseProduct1.setId(null);
        assertThat(purchaseProduct1).isNotEqualTo(purchaseProduct2);
    }
}
