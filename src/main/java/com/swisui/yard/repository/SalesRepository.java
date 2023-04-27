package com.swisui.yard.repository;

import com.swisui.yard.domain.Sales;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Sales entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SalesRepository extends JpaRepository<Sales, Long> {}
