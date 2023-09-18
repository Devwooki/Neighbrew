package com.ssafy.backend.repository;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.entity.Push;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

// DB에 저장하기 위한 Repository
@Repository
public interface PushRepository extends JpaRepository<Push, Long> {
    List<Push> findByReceiver_UserIdOrderByCreatedAtDesc(Long receiverId);

    @Modifying
    @Query("DELETE FROM Push p WHERE p.pushType = :pushType AND p.receiver.userId = :receiverId AND p.sender.userId = :senderId")
    void deleteByPushTypeAndSenderUserIdAndReceiverUserId(@Param("pushType") PushType pushType,
                                                          @Param("senderId") Long senderId,
                                                          @Param("receiverId") Long receiverId);
}




