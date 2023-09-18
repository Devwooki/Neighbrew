package com.ssafy.backend.controller;

import com.ssafy.backend.dto.meet.MeetRequestDto;
import com.ssafy.backend.dto.meet.MeetResponseDto;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.service.MeetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

//모임 생성, 수정, 삭제를 관장하는 컨트롤러
@RestController
@RequestMapping("/api/meet")
@RequiredArgsConstructor
@Slf4j
public class MeetController {
    private final MeetService meetService;

    //태그별로 데이터 조회
    @GetMapping()
    public ResponseEntity<Page<MeetResponseDto>> getTagMeet(@RequestParam(name = "tagId", required = false, defaultValue = "0") Long tagId, Pageable pageable) {
        return ResponseEntity.ok(meetService.findMeetsByTagId(tagId, pageable));
    }

    // meetId에 해당하는 모임 상세 정보 조회
    @GetMapping("/{meetId}")
    public ResponseEntity<?> getMeetById(@PathVariable Long meetId) {
        return ResponseEntity.ok(meetService.findMeetdetailByMeetId(meetId));
    }

    //유저와 관련된 모임 모두 출력
    @GetMapping("/mymeet/{userId}")
    public ResponseEntity<?> getMyMeetsById(@PathVariable Long userId) {
        return ResponseEntity.ok(meetService.findUserMeetByUserId(userId));
    }

    //모임 생성
    @PostMapping("/create")
    public ResponseEntity<?> saveMeet(Long userId,
                                      MeetRequestDto meetRequestDto,
                                      Long drinkId,
                                      @RequestPart(value = "image", required = false) Optional<MultipartFile> multipartFile) throws IllegalArgumentException, IOException {

        checkCapacityFile(multipartFile);
        Meet createdMeet = meetService.saveMeet(meetRequestDto, userId, drinkId, multipartFile.orElse(null));
        return ResponseEntity.ok(createdMeet);
    }

    //모임 수정
    @PutMapping("/modify/{userId}/{meetId}")
    public ResponseEntity<?> updateMeet(@PathVariable("userId") Long userId,
                                        @PathVariable("meetId") Long meetId,
                                        MeetRequestDto meetRequestDto,
                                        Long drinkId,
                                        @RequestPart(value = "image", required = false) Optional<MultipartFile> multipartFile) throws IOException {
        checkCapacityFile(multipartFile);

        meetService.updateMeet(meetRequestDto, userId, meetId, drinkId, multipartFile.orElse(null));
        return ResponseEntity.ok(meetId + "모임이 수정 되었습니다.");
    }

    private void checkCapacityFile(Optional<MultipartFile> multipartFile) {
        if (multipartFile.isPresent()) {
            if (multipartFile.get().getSize() > 1024 * 1024 * 20)
                throw new IllegalArgumentException("파일 업로드 크기는 20MB로 제한되어 있습니다.");
        }
    }

    //모임 삭제하기
    @DeleteMapping("/delete/{meetId}")
    public ResponseEntity<?> deleteMeet(@PathVariable Long meetId,
                                        @RequestBody Map<String, Long> requestBody) {
        Long hostId = requestBody.get("userId");
        meetService.deleteMeet(hostId, meetId);

        return ResponseEntity.ok(meetId + " 모임이 삭제 되었습니다.");
    }

    // 참가자 : 모임 신청
    @PostMapping("/apply")
    public ResponseEntity<?> applyMeet(@RequestBody Map<String, Long> requestBody) {
        Long userId = requestBody.get("userId");
        Long meetId = requestBody.get("meetId");

        meetService.applyMeet(userId, meetId);
        return ResponseEntity.ok(meetId + "모임에 신청 완료");
    }

    // 유저 : 모임 신청 취소
    @PutMapping("/apply-cancel")
    public ResponseEntity<?> applyCancelMeet(@RequestBody Map<String, Long> requestBody) {
        Long userId = requestBody.get("userId");
        Long meetId = requestBody.get("meetId");

        meetService.applyCancelMeet(userId, meetId);
        return ResponseEntity.ok("모임 신청 취소가 완료됐습니다.");
    }

    // 유저 : 모임 나가기
    @DeleteMapping("/exit")
    public ResponseEntity<?> exitMeet(@RequestBody Map<String, Long> requestBody) {
        Long userId = requestBody.get("userId");
        Long meetId = requestBody.get("meetId");

        meetService.exitMeet(userId, meetId);

        return ResponseEntity.ok("모임(" + meetId + ")에서 정상적으로 나가졌습니다.");
    }

    // 방장 : 모임 신청 관리
    @PostMapping("/manage-user")
    public ResponseEntity<?> manageMeetApply(@RequestBody Map<String, Object> requestBody) {
        Long userId = ((Number) requestBody.get("userId")).longValue();
        Long meetId = ((Number) requestBody.get("meetId")).longValue();
        boolean applyResult = (boolean) requestBody.get("applyResult");

        return ResponseEntity.ok(meetService.manageMeet(userId, meetId, applyResult));
    }

    // 1시간마다
    @Scheduled(cron = "0 0 * * * *")
    public void checkMeetStatus() {
        meetService.checkMeetStatus();
    }
}
