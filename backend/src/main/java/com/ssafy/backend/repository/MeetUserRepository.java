package com.ssafy.backend.repository;

import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.entity.MeetUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetUserRepository extends JpaRepository<MeetUser, Long> {
    List<MeetUser> findByUserUserIdOrderByMeetCreatedAtDesc(Long userId);

    void deleteByMeetMeetId(Long meetId);

    Optional<List<MeetUser>> findByMeetMeetIdOrderByStatusDesc(Long meetId);

    Optional<MeetUser> findByUserUserIdAndMeetMeetId(Long userId, Long meetId);

    void deleteByUserUserIdAndMeetMeetIdAndStatus(Long userId, Long meetId, Status status);

    @Query("select mu.status from MeetUser mu where mu.user.userId = :userId and mu.meet.meetId = :meetId")
    Status findStatusByUserIdAndMeetId(@Param("userId") Long userId,
                                       @Param("meetId") Long meetId);

    Optional<Long> countByMeetMeetId(Long meetId);
}

