package com.ssafy.backend.dto.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class UserUpdateDto {
    String email;
    String nickname;
    String name;
    LocalDate birth;
    String intro;
    Float liverPoint;
    String profile;
}
