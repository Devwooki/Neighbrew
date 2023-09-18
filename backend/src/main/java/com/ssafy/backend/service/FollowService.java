package com.ssafy.backend.service;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.dto.follow.FollowResponseDto;
import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.PushRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final PushService pushService;
    private final PushRepository pushRepository;

    @Value("${neighbrew.full.url}")
    private String neighbrewUrl;
    public List<FollowResponseDto> getFollowers(Long userId) {
        if (!userRepository.existsById(userId)) throw new AssertionError("잘못된 userId입니다:" + userId);

        return followRepository.findByFollowingUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("팔로워 정보를 찾을 수 없습니다."))
                .stream()
                .map(FollowResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 팔로우 토글
    @Transactional
    public String toggleFollow(Long userId, Long followingId) {
        User follower = getUserById(userId, "잘못된 userId입니다: ");
        User following = getUserById(followingId, "잘못된 followingId입니다: ");

        return followRepository.findByFollowerUserIdAndFollowingUserId(userId, followingId)
                .map(follow -> {
                    unfollow(follow, userId, followingId);
                    return following.getNickname() + "님을 팔로우 취소하였습니다.";
                }).orElseGet(() -> {
                    followUser(follower, following);
                    return following.getNickname() + "님을 팔로우하였습니다.";
                });
    }

    private User getUserById(Long userId, String errorMessage) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException(errorMessage + userId));
    }

    private void unfollow(Follow existingFollow, Long userId, Long followingId) {
        followRepository.delete(existingFollow);
        pushRepository.deleteByPushTypeAndSenderUserIdAndReceiverUserId(PushType.FOLLOW, userId, followingId);
    }

    private void followUser(User follower, User following) {
        Follow follow = Follow.builder().follower(follower).following(following).build();
        followRepository.save(follow);
        pushService.send(follower, following, PushType.FOLLOW, follower.getNickname() + "님이 회원님을 팔로우하기 시작했습니다.", neighbrewUrl + "/mypage/" + follower.getUserId());
    }

    public List<FollowResponseDto> getFollowing(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("잘못된 userId입니다:" + userId);
        }

        return followRepository.findByFollowerUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("팔로잉 정보를 찾을 수 없습니다."))
                .stream()
                .map(FollowResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
