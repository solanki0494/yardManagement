package com.swisui.yard.repository;

import com.swisui.yard.domain.Loading;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Loading entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LoadingRepository extends JpaRepository<Loading, Long> {}
