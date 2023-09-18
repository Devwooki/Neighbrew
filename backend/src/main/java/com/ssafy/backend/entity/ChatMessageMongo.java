package com.ssafy.backend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;

@Document(collection = "chat")
@Getter
@NoArgsConstructor
public class ChatMessageMongo {
    @Id
    private String id;
    private Long chatRoomId;
    private Long userId;
    private String userNickname;
    private String message;
    private String createdAt;

    @Builder
    public ChatMessageMongo(String id, Long chatRoomId, Long userId, String userNickname, String message, String createdAt) {
        this.id = id;
        this.chatRoomId = chatRoomId;
        this.userId = userId;
        this.userNickname = userNickname;
        this.message = message;
        this.createdAt = createdAt;
    }
}
