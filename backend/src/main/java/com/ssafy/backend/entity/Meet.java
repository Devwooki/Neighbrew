package com.ssafy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.backend.Enum.MeetStatus;
import com.ssafy.backend.dto.code.GugunResponseDto;
import com.ssafy.backend.dto.code.SidoResponseDto;
import com.ssafy.backend.dto.drink.DrinkResponseDto;
import com.ssafy.backend.dto.meet.MeetRequestDto;
import com.ssafy.backend.dto.meet.MeetResponseDto;
import com.ssafy.backend.dto.user.UserResponseDto;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Meet {
    @Id
    @Setter
    @GeneratedValue
    private Long meetId;

    @Column(nullable = false, length = 100)
    private String meetName;

    @Lob
    private String description;

    @ManyToOne
    @JoinColumn(name = "hostId", referencedColumnName = "userId")
    @Setter
    private User host;

    //현재 참여 인원
    @Column(nullable = false, columnDefinition = "int default 1")
    @Setter
    private Integer nowParticipants;

    //최대 참여 인원
    @Column(nullable = false, columnDefinition = "int default 8")
    private Integer maxParticipants;

    //모임날짜
    private LocalDateTime meetDate;

    @ManyToOne
    @JoinColumn(name = "tagId")
    @Setter
    private Tag tag;

    @Column(nullable = false)
    private Integer sidoCode;
    @Column(nullable = false)
    private Integer gugunCode;

    private Integer minAge;
    private Integer maxAge;
    private Float minLiverPoint;

    //술ID
    @OneToOne
    @JoinColumn(name = "drinkId")
    @Setter
    private Drink drink;

    //미팅 이미지 url
    @Lob
    private String imgSrc;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;

    // 채팅과 모임 간의 양방향 일대일 연관관계 - 연관관계 주인은 chatRoom
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    @Setter
    private ChatRoom chatRoom;

    @Enumerated(EnumType.STRING)
    @Setter
    @JsonIgnore
    private MeetStatus meetStatus;

    @Builder
    public Meet(Long meetId, String meetName, String description, User host,
                Integer nowParticipants, Integer maxParticipants,
                LocalDateTime meetDate, Tag tag, Integer sidoCode, Integer gugunCode, Integer minAge, Integer maxAge, Float minLiverPoint,
                Drink drink, String imgSrc) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.description = description;
        this.host = host;
        this.nowParticipants = nowParticipants;
        this.maxParticipants = maxParticipants;
        this.meetDate = meetDate;
        this.tag = tag;
        this.sidoCode = sidoCode;
        this.gugunCode = gugunCode;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.minLiverPoint = minLiverPoint;
        this.drink = drink;
        this.imgSrc = imgSrc;
    }

    public void update(Meet meet) {
        this.meetName = meet.getMeetName();
        this.description = meet.getDescription();
        this.maxParticipants = meet.getMaxParticipants();
        this.meetDate = meet.getMeetDate();
        this.tag = meet.getTag();
        this.sidoCode = meet.getSidoCode();
        this.gugunCode = meet.getGugunCode();
        this.minAge = meet.getMinAge();
        this.maxAge = meet.getMaxAge();
        this.minLiverPoint = meet.getMinLiverPoint();
        this.updatedAt = LocalDateTime.now();
        this.drink = meet.getDrink();
        this.imgSrc = meet.getImgSrc();
    }

    public MeetRequestDto toDto() {
        return MeetRequestDto.builder()
                .meetId(meetId)
                .meetName(meetName)
                .description(description)
                .hostId(host.getUserId())
                .nowParticipants(nowParticipants)
                .maxParticipants(maxParticipants)
                .meetDate(meetDate)
                .tagId(tag.getTagId())
                .sidoCode(sidoCode)
                .gugunCode(gugunCode)
                .minAge(minAge)
                .maxAge(maxAge)
                .minLiverPoint(minLiverPoint)
                .drink(drink)
                .imgSrc(imgSrc)
                .chatRoomId(chatRoom.getChatRoomId())
                .build();
    }

    public MeetResponseDto toMeetResponseDto(Sido sido, Gugun gugun) {
        return MeetResponseDto.builder()
                .meetId(meetId)
                .meetName(meetName)
                .description(description)
                .host(UserResponseDto.fromEntity(host))
                .nowParticipants(nowParticipants)
                .maxParticipants(maxParticipants)
                .meetDate(meetDate)
                .tagId(tag.getTagId())
                .sido(SidoResponseDto.fromEntity(sido))
                .gugun(GugunResponseDto.fromEntity(gugun))
                .minAge(minAge)
                .maxAge(maxAge)
                .minLiverPoint(minLiverPoint)
                .drink(DrinkResponseDto.fromEntity(drink))
                .imgSrc(imgSrc)
                .chatRoomId(chatRoom.getChatRoomId())
                .meetStatus(meetStatus)
                .build();
    }

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        meetStatus = MeetStatus.WAITING;
    }
}
