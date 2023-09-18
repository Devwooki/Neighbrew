package com.ssafy.backend.dto.follow;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FollowRequestDto {
    private Long followingId;
    private Long followerId;

    @Builder
    public FollowRequestDto(Long followingId, Long followerId) {
        this.followingId = followingId;
        this.followerId = followerId;
    }

    public Follow toEntity(User following, User follower) {
        return Follow.builder()
                .following(following)
                .follower(follower)
                .build();
    }
}
