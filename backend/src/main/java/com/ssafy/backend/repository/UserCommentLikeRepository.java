package com.ssafy.backend.repository;

import com.ssafy.backend.entity.UserCommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCommentLikeRepository extends JpaRepository<UserCommentLike, Long> {
    Optional<UserCommentLike> findByUserUserIdAndDrinkReviewDrinkReviewId(Long userId, Long drinkReviewId);
}
