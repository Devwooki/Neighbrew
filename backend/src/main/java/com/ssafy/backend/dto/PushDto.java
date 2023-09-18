package com.ssafy.backend.dto;

import com.ssafy.backend.Enum.PushType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class PushDto {
    private Long pushId;
    private String userName;
    private PushType pushType;
    private String content;
    private String url;
    private boolean isRead;
    private Long receiver_id;
    private Long sender_id;
    private LocalDateTime createdAt;

    @Builder
    public PushDto(Long pushId, String userName, PushType pushType, String content, String url, boolean isRead, Long receiver_id, Long sender_id, LocalDateTime createdAt) {
        this.pushId = pushId;
        this.userName = userName;
        this.pushType = pushType;
        this.content = content;
        this.url = url;
        this.isRead = isRead;
        this.receiver_id = receiver_id;
        this.sender_id = sender_id;
        this.createdAt = createdAt;
    }
}
