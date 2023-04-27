package com.swisui.yard.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.swisui.yard.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LoadingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Loading.class);
        Loading loading1 = new Loading();
        loading1.setId(1L);
        Loading loading2 = new Loading();
        loading2.setId(loading1.getId());
        assertThat(loading1).isEqualTo(loading2);
        loading2.setId(2L);
        assertThat(loading1).isNotEqualTo(loading2);
        loading1.setId(null);
        assertThat(loading1).isNotEqualTo(loading2);
    }
}
