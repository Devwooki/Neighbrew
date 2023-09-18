package com.ssafy.backend.dto.code;

import com.ssafy.backend.entity.Sido;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SidoResponseDto {
    private Integer sidoCode;
    private String sidoName;

    @Builder
    public SidoResponseDto(Integer sidoCode, String sidoName) {
        this.sidoCode = sidoCode;
        this.sidoName = sidoName;
    }

    public static SidoResponseDto fromEntity(Sido sido) {
        return SidoResponseDto.builder()
                .sidoCode(sido.getSidoCode())
                .sidoName(sido.getSidoName())
                .build();
    }
}
