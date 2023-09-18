package com.ssafy.backend.service;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.entity.UserCommentLike;
import com.ssafy.backend.repository.DrinkReviewRepository;
import com.ssafy.backend.repository.UserCommentLikeRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserCommentLikeService {
    private final UserCommentLikeRepository userCommentLikeRepository;
    private final UserRepository userRepository;
    private final DrinkReviewRepository drinkReviewRepository;
    private final PushService pushService;

    @Transactional
    public boolean toggleUserLike(Long userId, Long reviewId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("해당 유저가 없습니다. id=" + userId)
        );
        DrinkReview drinkReview = drinkReviewRepository.findById(reviewId).orElseThrow(
                () -> new IllegalArgumentException("해당 리뷰가 없습니다. id=" + reviewId)
        );

        Optional<UserCommentLike> existingLike = userCommentLikeRepository.findByUserUserIdAndDrinkReviewDrinkReviewId(userId, reviewId);

        if (existingLike.isPresent()) {
            // 좋아요 취소, drinkReview의 likeCount 감소
            userCommentLikeRepository.delete(existingLike.get());
            drinkReview.decreaseLikeCount();
            drinkReviewRepository.save(drinkReview);
            return false;
        } else {
            // 좋아요 등록, drinkReview의 likeCount 증가
            userCommentLikeRepository.save(UserCommentLike.builder().user(user).drinkReview(drinkReview).build());
            drinkReview.increaseLikeCount();
            drinkReviewRepository.save(drinkReview);
            pushService.send(user, drinkReview.getUser(), PushType.REVIEWLIKE, user.getNickname() + "님이 회원님의 후기를 좋아합니다. ", "https://i9b310.p.ssafy.io/drinkpost/" + drinkReview.getDrink().getDrinkId() + "/" + reviewId);
            return true;
        }
    }

    public Object getIsLike(Long userId, Long reviewId) {
        User user = userRepository.findById(userId).orElse(null);
        DrinkReview drinkReview = drinkReviewRepository.findById(reviewId).orElse(null);

        if (user == null || drinkReview == null) {
            return false;
        }

        Optional<UserCommentLike> existingLike = userCommentLikeRepository.findByUserUserIdAndDrinkReviewDrinkReviewId(userId, reviewId);

        return existingLike.isPresent();
    }
}