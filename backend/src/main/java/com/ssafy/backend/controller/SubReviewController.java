package com.ssafy.backend.controller;

import com.ssafy.backend.dto.subReview.SubReviewRequestDto;
import com.ssafy.backend.dto.subReview.SubReviewResponseDto;
import com.ssafy.backend.service.SubReviewService;
import com.ssafy.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subreview")
@RequiredArgsConstructor
@Slf4j
public class SubReviewController {
    private final SubReviewService subReviewService;

    // 리뷰의 댓글을 조회하는 API
    @GetMapping("/list/{reviewId}")
    public ResponseEntity<List<SubReviewResponseDto>> getSubReviewsWithUserByDrinkReviewId(@PathVariable Long reviewId) {
        return ResponseEntity.ok().body(subReviewService.findByDrinkReviewId(reviewId));
    }

    // 리뷰의 댓글을 작성하는 API
    @PostMapping("/write")
    public ResponseEntity<SubReviewResponseDto> writeSubReview(@RequestBody SubReviewRequestDto subReviewRequestDto, @RequestHeader("Authorization") String token) {
        Long userId = JwtUtil.parseUserIdFromToken(token);
        return ResponseEntity.ok().body(subReviewService.writeSubReview(subReviewRequestDto, userId));
    }

    // 댓글 삭제 API
    @DeleteMapping("/delete/{subReviewId}")
    public ResponseEntity<String> deleteSubReview(@PathVariable Long subReviewId, @RequestHeader("Authorization") String token) {
        Long userId = JwtUtil.parseUserIdFromToken(token);
        // 삭제 성공
        subReviewService.deleteSubReview(subReviewId, userId);
        return ResponseEntity.ok().body("댓글 삭제 성공");
    }

    // 댓글을 수정하는 API
    @PutMapping("/update")
    public ResponseEntity<SubReviewResponseDto> updateSubReview(@RequestBody SubReviewRequestDto subReviewRequestDto) {
        return ResponseEntity.ok().body(SubReviewResponseDto.fromEntity(subReviewService.updateSubReview(subReviewRequestDto, subReviewRequestDto.getUserId())));
    }
}
