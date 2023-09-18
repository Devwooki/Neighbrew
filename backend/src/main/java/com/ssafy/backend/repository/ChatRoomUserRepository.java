package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatRoomUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {
    Optional<ChatRoomUser> findByChatRoomChatRoomIdAndUserUserId(Long chatRoomId, Long userId);

    List<ChatRoomUser> findByUserUserId(Long userId);

    void deleteByUserUserIdAndChatRoomChatRoomId(Long userId, Long roomId);
}
