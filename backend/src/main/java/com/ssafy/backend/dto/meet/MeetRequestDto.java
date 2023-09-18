package com.ssafy.backend.dto.meet;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.Meet;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class MeetRequestDto {
    private Long meetId;
    private String meetName;
    private String description;
    private Long hostId;
    private Integer nowParticipants;
    private Integer maxParticipants;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime meetDate;
    private Long tagId;
    private Integer sidoCode;
    private Integer gugunCode;
    private Integer minAge;
    private Integer maxAge;
    private Float minLiverPoint;
    private Drink drink;
    private String imgSrc;
    private Long chatRoomId;

    @Builder
    public MeetRequestDto(Long meetId, String meetName, String description, Long hostId, Integer nowParticipants, Integer maxParticipants, LocalDateTime meetDate, Long tagId, Integer sidoCode, Integer gugunCode, Integer minAge, Integer maxAge, Float minLiverPoint, Drink drink, String imgSrc, Long chatRoomId) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.description = description;
        this.hostId = hostId;
        this.nowParticipants = nowParticipants;
        this.maxParticipants = maxParticipants;
        this.meetDate = meetDate;
        this.tagId = tagId;
        this.sidoCode = sidoCode;
        this.gugunCode = gugunCode;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.minLiverPoint = minLiverPoint;
        this.drink = drink;
        this.imgSrc = imgSrc;
        this.chatRoomId = chatRoomId;
    }

    public Meet toEntity() {
        return Meet.builder()
                .meetName(meetName)
                .description(description)
                .nowParticipants(nowParticipants)
                .maxParticipants(maxParticipants)
                .meetDate(meetDate)
                .sidoCode(sidoCode)
                .gugunCode(gugunCode)
                .minAge(minAge)
                .maxAge(maxAge)
                .minLiverPoint(minLiverPoint)
                .drink(drink)
                .imgSrc(imgSrc)
                .build();
    }
}
