package com.ssafy.backend.dto.meet;

import com.ssafy.backend.Enum.MeetStatus;
import com.ssafy.backend.dto.code.GugunResponseDto;
import com.ssafy.backend.dto.code.SidoResponseDto;
import com.ssafy.backend.dto.drink.DrinkResponseDto;
import com.ssafy.backend.dto.user.UserResponseDto;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class MeetResponseDto {
    private Long meetId;
    private String meetName;
    private String description;
    private UserResponseDto host;
    private Integer nowParticipants;
    private Integer maxParticipants;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime meetDate;
    private Long tagId;
    private SidoResponseDto sido;
    private GugunResponseDto gugun;
    private Integer minAge;
    private Integer maxAge;
    private Float minLiverPoint;
    private DrinkResponseDto drink;
    private String imgSrc;
    private Long chatRoomId;
    private MeetStatus meetStatus;

    @Builder
    public MeetResponseDto(Long meetId, String meetName, String description, UserResponseDto host, Integer nowParticipants, Integer maxParticipants, LocalDateTime meetDate, Long tagId, SidoResponseDto sido, GugunResponseDto gugun, Integer minAge, Integer maxAge, Float minLiverPoint, DrinkResponseDto drink, String imgSrc, Long chatRoomId, MeetStatus meetStatus) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.description = description;
        this.host = host;
        this.nowParticipants = nowParticipants;
        this.maxParticipants = maxParticipants;
        this.meetDate = meetDate;
        this.tagId = tagId;
        this.sido = sido;
        this.gugun = gugun;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.minLiverPoint = minLiverPoint;
        this.drink = drink;
        this.imgSrc = imgSrc;
        this.chatRoomId = chatRoomId;
        this.meetStatus = meetStatus;
    }
}
