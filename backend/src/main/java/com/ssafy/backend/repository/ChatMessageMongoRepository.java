package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatMessageMongo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageMongoRepository extends MongoRepository<ChatMessageMongo, String> {
    List<ChatMessageMongo> findByChatRoomIdOrderByCreatedAt(Long chatRoomId);
}
