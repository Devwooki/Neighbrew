package com.ssafy.backend.dto.drinkReview;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class DrinkReviewUpdateDto {
    private Long drinkReviewId;
    private String content;
    private String imgSrc;
}
