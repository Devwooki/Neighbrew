package com.ssafy.backend.service;

import com.ssafy.backend.dto.user.UserResponseDto;
import com.ssafy.backend.dto.user.UserUpdateDto;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final S3Service s3Service;

    public UserResponseDto findByUserId(Long userId) {
        return UserResponseDto.fromEntity(userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("해당 유저가 없습니다. id=" + userId)
        ));
    }

    @Transactional
    public UserResponseDto updateUser(Long userId, UserUpdateDto updateDto) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("해당 유저가 없습니다. id=" + userId)
        );

        if (userRepository.existsByNickname(updateDto.getNickname()) && !updateDto.getNickname().equals(user.getNickname())) {
            throw new IllegalArgumentException("닉네임 중복");
        }

        if (!userRepository.existsByNickname(updateDto.getNickname()) && updateDto.getNickname().equals(user.getNickname())
                && updateDto.getBirth().equals(user.getBirth()) && updateDto.getIntro().equals(user.getIntro())) {
            throw new IllegalArgumentException("변경사항이 없습니다.");
        }

        user.updateFromDto(updateDto);
        return UserResponseDto.fromEntity(userRepository.save(user));
    }

    @Transactional
    public void updateUserImg(Long userId, String url) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("해당 유저가 없습니다. id=" + userId)
        );

        //프로필이 존재하면 기존 이미지 제거한다.
        if (!user.getProfile().equals("no image")) s3Service.deleteImg(user.getProfile());

        user.updateImg(url);
        userRepository.save(user);
    }

    public List<UserResponseDto> findAll() {
        return userRepository.findAll()
                .stream()
                .map(UserResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<UserResponseDto> searchUsers(String nickName) {
        return userRepository.findByNicknameContaining(nickName)
                .stream()
                .map(UserResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
