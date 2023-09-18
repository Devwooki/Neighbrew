package com.ssafy.backend.dto.drink;

import com.ssafy.backend.entity.Drink;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DrinkResponseDto {
    private Long drinkId;
    private String name;
    private String image;
    private Float degree;
    private String description;
    private Long tagId;

    @Builder
    public DrinkResponseDto(Long drinkId, String name, String image, Float degree, String description, Long tagId) {
        this.drinkId = drinkId;
        this.name = name;
        this.image = image;
        this.degree = degree;
        this.description = description;
        this.tagId = tagId;
    }

    public static DrinkResponseDto fromEntity(Drink drink) {
        return DrinkResponseDto.builder()
                .drinkId(drink.getDrinkId())
                .name(drink.getName())
                .image(drink.getImage())
                .degree(drink.getDegree())
                .description(drink.getDescription())
                .tagId(drink.getTagId())
                .build();
    }
}