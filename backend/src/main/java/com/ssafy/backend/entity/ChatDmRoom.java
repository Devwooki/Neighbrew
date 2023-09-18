package com.ssafy.backend.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatDmRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatDmRoomId;

    @Lob
    @Column(nullable = false)
    private String chatDmRoomName;

    @OneToOne
    @JoinColumn(name = "user1_id")
    private User user1;

    @OneToOne
    @JoinColumn(name = "user2_id")
    private User user2;

    @Column(columnDefinition = "TIMESTAMP")
    @Setter
    private LocalDateTime user1AttendTime;

    @Column(columnDefinition = "TIMESTAMP")
    @Setter
    private LocalDateTime user2AttendTime;

    @Column(columnDefinition = "TIMESTAMP")
    @Setter
    private LocalDateTime lastMessageTime;

    @Builder
    public ChatDmRoom(User user1, User user2) {
        this.chatDmRoomName = user1.getName() + "&" + user2.getName();
        this.user1 = user1;
        this.user2 = user2;
        this.user1AttendTime = LocalDateTime.now();
        this.user2AttendTime = LocalDateTime.now();
    }
}
