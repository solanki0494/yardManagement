package com.swisui.yard.repository;

import com.swisui.yard.domain.Loading;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LoadingRepository extends JpaRepository<Loading, Long> {
    @Query("select l from Loading l left join fetch l.loadingProducts lp left join fetch lp.product where l.id=:id")
    Loading findOneByIdWithLoadingProducts(@Param("id") Long id);
}
