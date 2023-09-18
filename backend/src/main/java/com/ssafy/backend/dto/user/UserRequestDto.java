package com.ssafy.backend.dto.user;

import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class UserRequestDto {
    private Long userId;

    private String email;

    private String nickname;

    private String name;

    private String birth;

    private String intro;

    private Float liverPoint;

    private String profile;

    @Builder
    public UserRequestDto(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.name = user.getName();
        this.birth = String.valueOf(user.getBirth());
        this.intro = user.getIntro();
        this.liverPoint = user.getLiverPoint();
        this.profile = user.getProfile();
    }

    public User toEntity() {
        return User.builder()
                .email(email)
                .nickname(nickname)
                .name(name)
                .birth(LocalDate.parse(birth))
                .intro(intro)
                .liverPoint(liverPoint)
                .profile(profile)
                .build();
    }
}
