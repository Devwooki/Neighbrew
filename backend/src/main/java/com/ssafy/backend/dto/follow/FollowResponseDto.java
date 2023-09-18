package com.ssafy.backend.dto.follow;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class FollowResponseDto {
    private User follower;
    private User following;

    @Builder
    public FollowResponseDto(User follower, User following) {
        this.follower = follower;
        this.following = following;
    }

    public static FollowResponseDto fromEntity(Follow follow) {
        return FollowResponseDto.builder()
                .follower(follow.getFollower())
                .following(follow.getFollowing())
                .build();
    }
}
