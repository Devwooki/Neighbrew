package com.ssafy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ssafy.backend.authentication.domain.oauth.OAuthProvider;
import com.ssafy.backend.dto.user.UserUpdateDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OAuthProvider oAuthProvider;

    @Column(nullable = false, length = 20)
    private String name;

    private LocalDate birth;

    @Lob
    private String intro;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(nullable = false, columnDefinition = "float default 40.0")
    private Float liverPoint;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'no image'")
    private String profile;

    @Builder
    public User(String email, String nickname, String name, Float liverPoint, OAuthProvider oAuthProvider, LocalDate birth, String intro, String profile) {
        this.email = email;
        this.nickname = nickname;
        this.liverPoint = liverPoint;
        this.name = name;
        this.oAuthProvider = oAuthProvider;
        this.birth = birth;
        this.intro = intro;
        this.profile = profile;
    }

    @PrePersist
    public void prePersist() {
        this.liverPoint = 40.0f;
        this.profile = "no image";
        this.birth = LocalDate.parse("2005-01-01");
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void updateFromDto(UserUpdateDto updateDto) {
        if (updateDto.getNickname() != null) {
            this.nickname = updateDto.getNickname();
        }
        if (updateDto.getIntro() != null) {
            this.intro = updateDto.getIntro();
        }

        if (updateDto.getBirth() != null) {
            this.birth = updateDto.getBirth();
        }

        if (updateDto.getProfile() != null) {
            this.profile = updateDto.getProfile();
        }
        if (updateDto.getLiverPoint() != null) {
            this.liverPoint = updateDto.getLiverPoint();
        }
    }

    public void updateImg(String url) {
        this.profile = url;
    }

    public void updateLiverPoint(Float newLiverPoint) {
        this.liverPoint = newLiverPoint;
    }
}
