package com.ssafy.backend.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Sido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sidoCode;

    @Column(length = 30)
    private String sidoName;
}
