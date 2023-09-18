package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDmRoom;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatDmRoomRepository extends JpaRepository<ChatDmRoom, Long> {
    @Query("select cdr from ChatDmRoom cdr where (cdr.user1 = :user1 and cdr.user2 = :user2) or (cdr.user1 = :user2 and cdr.user2 = :user1)")
    Optional<ChatDmRoom> findDmUsers(@Param("user1") User user1,
                                     @Param("user2") User user2);

    @Modifying
    @Query("select cdr from ChatDmRoom cdr where cdr.user1.userId = :userId or cdr.user2.userId = :userId order by cdr.lastMessageTime desc")
    Optional<List<ChatDmRoom>> findChatDmRoomByIdOrderByLastMessageTimeDesc(@Param("userId") Long userId);

    Optional<ChatDmRoom> findByUser1UserIdAndUser2UserId(Long user1Id, Long user2Id);

    List<ChatDmRoom> findByChatDmRoomIdAndUser2UserIdOrderBy
}