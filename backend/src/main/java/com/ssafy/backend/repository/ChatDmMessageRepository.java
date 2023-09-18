package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDmMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatDmMessageRepository extends JpaRepository<ChatDmMessage, Long> {
    void deleteByChatDmRoomChatDmRoomId(Long dmRoomId);

    List<ChatDmMessage> findByChatDmRoomChatDmRoomIdAndCreatedAtBetween(Long chatDmRoomId, LocalDateTime start, LocalDateTime end);
}
