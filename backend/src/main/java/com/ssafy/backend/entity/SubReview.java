package com.ssafy.backend.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SubReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subReviewId;

    @Lob
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drink_review_id")
    private DrinkReview drinkReview;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Builder
    public SubReview(String content, DrinkReview drinkReview, User user) {
        this.content = content;
        this.drinkReview = drinkReview;
        this.user = user;
    }

    public void update(String content) {
        this.content = content;
    }

    @PrePersist
    public void createdAt() {
        this.createdAt = new Date();
    }
}
