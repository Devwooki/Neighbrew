package com.ssafy.backend.service;

import com.ssafy.backend.entity.ChatMessageMongo;
import com.ssafy.backend.repository.ChatMessageMongoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageMongoRepository chatMessageMongoRepository;

    public List<ChatMessageMongo> getChatMessages(Long chatRoomId) {
        return chatMessageMongoRepository.findByChatRoomIdOrderByCreatedAt(chatRoomId);
    }
}
