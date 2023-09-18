package com.ssafy.backend.entity;

import com.ssafy.backend.Enum.EvaluationType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Builder
@NoArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long evaluationId;

    @ManyToOne
    @JoinColumn(name = "rated_user_id", referencedColumnName = "userId") // 수정된 부분
    private User ratedUser;

    @ManyToOne
    @JoinColumn(name = "reviewer_id", referencedColumnName = "userId") // 수정된 부분
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "meetId")
    private Meet meet;

    @Enumerated(EnumType.STRING)
    private EvaluationType evaluationType;

    @Lob
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date createdAt;

    @Builder
    public Evaluation(Long evaluationId, User ratedUser, User reviewer, Meet meet, EvaluationType evaluationType, String description, Date createdAt) {
        this.evaluationId = evaluationId;
        this.ratedUser = ratedUser;
        this.reviewer = reviewer;
        this.meet = meet;
        this.evaluationType = evaluationType;
        this.description = description;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void createdAt() {
        this.createdAt = new Date();
    }
}
