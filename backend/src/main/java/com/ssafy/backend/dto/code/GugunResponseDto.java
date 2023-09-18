package com.ssafy.backend.dto.code;

import com.ssafy.backend.entity.Gugun;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GugunResponseDto {
    private Integer gugunCode;
    private String gugunName;
    private Integer sidoCode;

    @Builder
    public GugunResponseDto(Integer gugunCode, String gugunName, Integer sidoCode) {
        this.gugunCode = gugunCode;
        this.gugunName = gugunName;
        this.sidoCode = sidoCode;
    }

    public static GugunResponseDto fromEntity(Gugun gugun) {
        return GugunResponseDto.builder()
                .gugunCode(gugun.getGugunCode())
                .gugunName(gugun.getGugunName())
                .sidoCode(gugun.getSidoCode())
                .build();
    }
}
