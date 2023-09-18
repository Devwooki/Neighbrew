package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Evaluation;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    boolean existsByRatedUserAndReviewerAndMeet(User ratedUser, User reviewer, Meet meet);
}