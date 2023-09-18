package com.ssafy.backend.dto.evaluation;

import com.ssafy.backend.dto.user.UserResponseDto;
import com.ssafy.backend.entity.Evaluation;
import com.ssafy.backend.entity.Meet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResponseDto {
    private Long evaluationId;
    private UserResponseDto ratedUser;
    private UserResponseDto reviewer;
    private Meet meet;
    private String evaluationType;
    private String description;

    public static EvaluationResponseDto fromEntity(Evaluation evaluation) {
        return EvaluationResponseDto.builder()
                .evaluationId(evaluation.getEvaluationId())
                .ratedUser(UserResponseDto.fromEntity(evaluation.getRatedUser()))
                .reviewer(UserResponseDto.fromEntity(evaluation.getReviewer()))
                .meet(evaluation.getMeet())
                .evaluationType(evaluation.getEvaluationType().toString())
                .description(evaluation.getDescription())
                .build();
    }
}
