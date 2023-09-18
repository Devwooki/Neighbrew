package com.ssafy.backend.dto.meet;

import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MeetUserDto {
    private MeetRequestDto meetRequestDto;

    private List<User> users;

    // 유저가 생성, 참여, 신처
    private List<Status> statuses;

    @Builder
    public MeetUserDto(MeetRequestDto meetRequestDto) {
        this.meetRequestDto = meetRequestDto;
        this.users = new ArrayList<>();
        this.statuses = new ArrayList<>();
    }

}
