package com.ssafy.backend.dto.evaluation;

import com.ssafy.backend.Enum.EvaluationType;
import com.ssafy.backend.entity.Evaluation;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationRequestDto {
    private Long reviewer;
    private Long ratedUser;
    private Long meetId;
    private String evaluationType;
    private String description;

    public Evaluation toEntity(User reviewer, User ratedUser, Meet meet) {
        return Evaluation.builder()
                .reviewer(reviewer)
                .ratedUser(ratedUser)
                .meet(meet)
                .evaluationType(EvaluationType.valueOf(this.evaluationType))
                .description(this.description)
                .build();
    }
}
