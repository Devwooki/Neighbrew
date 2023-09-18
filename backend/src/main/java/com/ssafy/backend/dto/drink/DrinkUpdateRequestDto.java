package com.ssafy.backend.dto.drink;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DrinkUpdateRequestDto {
    private String name;
    private String image;
    private Float degree;
    private String description;
    private Long tagId;

    @Builder
    public DrinkUpdateRequestDto(String name, String image, Float degree, String description, Long tagId) {
        this.name = name;
        this.image = image;
        this.degree = degree;
        this.description = description;
        this.tagId = tagId;
    }
}
