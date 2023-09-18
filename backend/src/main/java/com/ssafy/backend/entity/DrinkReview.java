package com.ssafy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DrinkReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long drinkReviewId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "drinkId")
    private Drink drink;

    @JsonIgnore
    @OneToMany(mappedBy = "drinkReview", cascade = CascadeType.ALL)
    private List<UserCommentLike> userCommentLikes;

    @JsonIgnore
    @OneToMany(mappedBy = "drinkReview", cascade = CascadeType.ALL)
    private List<SubReview> subReviews;

    @Lob
    @Setter
    private String content;

    @Column(columnDefinition = "varchar(255) default 'no image'")
    private String img;

    @Column(columnDefinition = "int default 0")
    private Long likeCount;

    // createdAt
    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date createdAt;

    @Builder
    public DrinkReview(Long drinkReviewId, User user, Drink drink, String content, String img) {
        this.drinkReviewId = drinkReviewId;
        this.user = user;
        this.drink = drink;
        this.img = img;
        this.content = content;
    }

    @PrePersist
    public void prePersist() {
        this.likeCount = 0L;
    }

    public void decreaseLikeCount() {
        this.likeCount--;
    }

    public void increaseLikeCount() {
        this.likeCount++;
    }

    public void updateImg(String uploadedImageUrl) {
        this.img = uploadedImageUrl;
    }

    public void updateContent(String content) {
        this.content = content;
    }
}
