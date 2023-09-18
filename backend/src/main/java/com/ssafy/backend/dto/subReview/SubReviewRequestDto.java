package com.ssafy.backend.dto.subReview;

import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.SubReview;
import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SubReviewRequestDto {
    private Long subReviewId;
    private String content;
    private Long drinkReviewId;
    private Long userId;

    @Builder
    public SubReviewRequestDto(Long subReviewId, String content, Long drinkReviewId, Long userId) {
        this.subReviewId = subReviewId;
        this.content = content;
        this.drinkReviewId = drinkReviewId;
        this.userId = userId;
    }

    public SubReview toEntity(User user, DrinkReview drinkReview) {
        return SubReview.builder()
                .user(user)
                .drinkReview(drinkReview)
                .content(content)
                .build();
    }
}
