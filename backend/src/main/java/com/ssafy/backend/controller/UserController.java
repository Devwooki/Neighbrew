package com.ssafy.backend.controller;

import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.authentication.application.LoginResponse;
import com.ssafy.backend.dto.user.UserResponseDto;
import com.ssafy.backend.dto.user.UserUpdateDto;
import com.ssafy.backend.service.JwtService;
import com.ssafy.backend.service.S3Service;
import com.ssafy.backend.service.UserService;
import com.ssafy.backend.util.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final S3Service s3Service;
    private final JwtService jwtService;

    //전체 유저 검색
    @GetMapping()
    public ResponseEntity<List<UserResponseDto>> findAll() {
        return ResponseEntity.ok().body(userService.findAll());
    }

    @GetMapping("/myinfo")
    public ResponseEntity<UserResponseDto> getMyInfo(@RequestHeader("Authorization") String token) {
        Long userId = JwtUtil.parseUserIdFromToken(token);
        return ResponseEntity.ok().body(userService.findByUserId(userId));
    }

    // userId로 유저 검색
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok().body(userService.findByUserId(userId));
    }

    // refresh token을 이용한 access token 재발급
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshAccessToken(@RequestBody LoginResponse refreshToken) {
        Claims claims = jwtService.getClaimsFromToken(refreshToken.getRefreshToken());
        String userId = claims.getSubject();
        Map<String, String> tokens = jwtService.generateTokens(userId);
        return ResponseEntity.ok(tokens);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDto> updateUserInfo(@RequestBody UserUpdateDto userUpdateDto,
                                                          @PathVariable Long userId) {
        return ResponseEntity.ok(userService.updateUser(userId, userUpdateDto));
    }

    @PutMapping("/img/{userId}")
    public ResponseEntity<String> updateUserImg(@RequestParam("profile") Optional<MultipartFile> profile,
                                                @PathVariable Long userId) throws IOException {
        String url = profile.isPresent() ? Objects.equals(profile.get().getOriginalFilename(), "") ? "no image" : s3Service.upload(UploadType.USERPROFILE, profile.get()) : "no image";

        userService.updateUserImg(userId, url);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/search/{nickname}")
    public ResponseEntity<List<UserResponseDto>> searchUsers(@PathVariable String nickname) {
        return ResponseEntity.ok(userService.searchUsers(nickname));
    }
}
