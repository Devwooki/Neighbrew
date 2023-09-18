package com.ssafy.backend.entity;

import com.ssafy.backend.Enum.Status;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class MeetUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long meetUserId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "meetId")
    private Meet meet;

    // 유저가 생성, 참여, 신처
    @Enumerated(EnumType.STRING)
    private Status status;

    @Builder
    public MeetUser(User user, Meet meet, Status status) {
        this.user = user;
        this.meet = meet;
        this.status = status;
    }
}

