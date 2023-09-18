package com.ssafy.backend.dto.drink;

import com.ssafy.backend.entity.Drink;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DrinkRequestDto {
    private String name;
    private String imgSrc;
    private Float degree;
    private String description;
    private Long tagId;

    @Builder
    public DrinkRequestDto(String name, String imgSrc, Float degree, String description, Long tagId) {
        this.name = name;
        this.imgSrc = imgSrc;
        this.degree = degree;
        this.description = description;
        this.tagId = tagId;
    }

    public Drink toEntity() {
        return Drink.builder()
                .name(name)
                .image(imgSrc)
                .degree(degree)
                .description(description)
                .tagId(tagId)
                .build();
    }
}
