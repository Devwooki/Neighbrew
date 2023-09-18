package com.ssafy.backend.repository;

import com.ssafy.backend.entity.SubReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubReviewRepository extends JpaRepository<SubReview, Long> {
    List<SubReview> findByDrinkReviewDrinkReviewIdOrderByCreatedAtDesc(Long drinkReviewId);
}
