package com.ssafy.backend.dto.user;

import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserResponseDto {
    private Long userId;
    private String email;
    private String nickname;
    private String name;
    private String birth;
    private String intro;
    private Float liverPoint;
    private String profile;

    @Builder
    public UserResponseDto(Long userId, String email, String nickname, String name,
                           String birth, String intro, Float liverPoint, String profile) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.name = name;
        this.birth = birth;
        this.intro = intro;
        this.liverPoint = liverPoint;
        this.profile = profile;
    }

    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .name(user.getName())
                .birth(String.valueOf(user.getBirth()))
                .intro(user.getIntro())
                .liverPoint(user.getLiverPoint())
                .profile(user.getProfile())
                .build();
    }
}
