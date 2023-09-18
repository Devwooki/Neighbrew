package com.ssafy.backend.service;

import com.ssafy.backend.entity.ChatRoomUser;
import com.ssafy.backend.repository.ChatRoomUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatRoomUserService {
    private final ChatRoomUserRepository chatRoomUserRepository;

    public ChatRoomUser save(ChatRoomUser chatRoomUser) {
        return chatRoomUserRepository.save(chatRoomUser);
    }
}
