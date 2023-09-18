package com.ssafy.backend.entity;

import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
public class TagUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagUserId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "tagId")
    private Tag tag;
}
