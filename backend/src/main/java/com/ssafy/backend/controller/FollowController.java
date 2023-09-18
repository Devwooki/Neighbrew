package com.ssafy.backend.controller;

import com.ssafy.backend.dto.follow.FollowResponseDto;
import com.ssafy.backend.service.FollowService;
import com.ssafy.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/follow")
public class FollowController {
    private final FollowService followService;

    @GetMapping("/follower/{userId}")
    public ResponseEntity<List<FollowResponseDto>> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<FollowResponseDto>> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowing(userId));
    }

    @PostMapping("/{followingId}")
    public ResponseEntity<String> followUser(@RequestHeader("Authorization") String token,
                                             @PathVariable Long followingId) {
        Long userId = JwtUtil.parseUserIdFromToken(token);
        return ResponseEntity.ok(followService.toggleFollow(userId, followingId));
    }
}
