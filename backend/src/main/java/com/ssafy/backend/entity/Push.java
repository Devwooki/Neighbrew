package com.ssafy.backend.entity;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.dto.PushDto;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
public class Push {
    //알림 : "누구 : ~에 대한 알림이 도착했습니다.", 클릭하면 해당 페이지로 이동하도록.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pushId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PushType pushType;

    @Lob
    private String content;

    @Lob
    private String url;

    @Column(name = "push_read_YN", nullable = false)
    private boolean isRead = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @CreatedDate
    private LocalDateTime createdAt;

    public Push() {
    }

    @Builder
    public Push(Long pushId, PushType pushType, String content, String url, boolean isRead, User receiver, User sender, LocalDateTime createdAt) {
        this.pushId = pushId;
        this.pushType = pushType;
        this.content = content;
        this.url = url;
        this.isRead = isRead;
        this.receiver = receiver;
        this.sender = sender;
        this.createdAt = LocalDateTime.now();
    }

    public PushDto toDto() {
        return PushDto.builder()
                .pushId(this.pushId)
                .sender_id(this.sender.getUserId())
                .receiver_id(this.receiver.getUserId())
                .pushType(this.pushType)
                .content(this.content)
                .url(this.url)
                .isRead(this.isRead)
                .build();
    }
}