package com.swisui.yard.repository;

import com.swisui.yard.domain.SalesProduct;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SalesProduct entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SalesProductRepository extends JpaRepository<SalesProduct, Long> {}
