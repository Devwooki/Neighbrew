package com.ssafy.backend.repository;

import com.ssafy.backend.Enum.MeetStatus;
import com.ssafy.backend.entity.Meet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetRepository extends JpaRepository<Meet, Long> {
    @Query("select m.imgSrc from Meet m where m.meetId = :meetId")
    String findImgSrcByMeetId(@Param("meetId") Long meetId);

    Page<Meet> findByMeetStatusNotOrderByCreatedAtDesc(MeetStatus meetStatus, Pageable pageable);

    Page<Meet> findByTagTagIdAndMeetStatusNotOrderByCreatedAtDesc(Long tagId, MeetStatus meetStatus, Pageable pageable);

    // 현재시간보다 모임시간이 빠른경우
    @Query("SELECT m FROM Meet m WHERE m.meetDate < CURRENT_TIMESTAMP")
    List<Meet> findMeetByMeetDateBefore();
}

