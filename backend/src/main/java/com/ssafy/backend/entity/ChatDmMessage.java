package com.ssafy.backend.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatDmMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatDmMessageId;

    @ManyToOne
    @JoinColumn(name = "chat_dm_room_id")
    private ChatDmRoom chatDmRoom;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Lob
    @Column(nullable = false)
    private String message;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    @Setter
    private LocalDateTime createdAt;

    @Builder
    public ChatDmMessage(ChatDmRoom chatDmRoom, User user, String message, LocalDateTime createdAt) {
        this.chatDmRoom = chatDmRoom;
        this.user = user;
        this.message = message;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void createdAt() {
        this.createdAt = LocalDateTime.now();
    }
}
