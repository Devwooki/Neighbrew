package com.ssafy.backend.controller;

import com.ssafy.backend.dto.evaluation.EvaluationRequestDto;
import com.ssafy.backend.service.EvaluationService;
import com.ssafy.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/evaluation")
public class EvaluationController {
    private final EvaluationService evaluationService;

    @PostMapping("")
    public ResponseEntity<?> goodEvaluation(@RequestBody EvaluationRequestDto evaluationRequestDto, @RequestHeader("Authorization") String token) {
        Long userId = JwtUtil.parseUserIdFromToken(token);
        return ResponseEntity.ok(evaluationService.calculateScoreByMeetId(evaluationRequestDto, userId));
    }
}
