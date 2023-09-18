package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Drink;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrinkRepository extends JpaRepository<Drink, Long> {
    // 술 이름과 태그로 조회
    Optional<Page<Drink>> findByNameContainsAndTagId(String name, Long tagId, Pageable pageable);

    // 술 태그로 조회
    Optional<Page<Drink>> findByTagId(Long tagId, Pageable pageable);

    // 술 이름으로 조회
    Optional<Page<Drink>> findByNameContains(String name, Pageable pageable);

    @Query(value = "SELECT * FROM drink ORDER BY RAND() LIMIT :numToPick", nativeQuery = true)
    List<Drink> findRandomDrinks(int numToPick);
}

