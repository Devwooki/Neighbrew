package com.ssafy.backend.dto.drinkReview;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DrinkReviewResponseDto {
    private Long drinkReviewId;
    private User user;
    private Drink drink;
    private String content;
    private String img;
    private Long likeCount;

    @Builder
    public DrinkReviewResponseDto(Long drinkReviewId, User user, Drink drink, String content, String img, Long likeCount) {
        this.drinkReviewId = drinkReviewId;
        this.user = user;
        this.drink = drink;
        this.content = content;
        this.img = img;
        this.likeCount = likeCount;
    }

    public static DrinkReviewResponseDto fromEntity(DrinkReview drinkReview) {
        return DrinkReviewResponseDto.builder()
                .drinkReviewId(drinkReview.getDrinkReviewId())
                .user(drinkReview.getUser())
                .drink(drinkReview.getDrink())
                .content(drinkReview.getContent())
                .img(drinkReview.getImg())
                .likeCount(drinkReview.getLikeCount())
                .build();
    }
}
