package com.ssafy.backend.repository;

import com.ssafy.backend.entity.DrinkFestival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DrinkFestivalRepository extends JpaRepository<DrinkFestival, Long> {
}
