package com.swisui.yard.repository;

import com.swisui.yard.domain.LoadingProduct;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LoadingProduct entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LoadingProductRepository extends JpaRepository<LoadingProduct, Long> {}
