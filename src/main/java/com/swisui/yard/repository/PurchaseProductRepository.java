package com.swisui.yard.repository;

import com.swisui.yard.domain.PurchaseProduct;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PurchaseProduct entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PurchaseProductRepository extends JpaRepository<PurchaseProduct, Long> {}
