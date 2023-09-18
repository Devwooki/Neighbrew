package com.ssafy.backend.entity;

import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
public class DrinkFestival {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long drinkFestivalId;

    @Column(length = 50)
    private String name;

    @Lob
    private String image;

    @Lob
    private String redirectUri;
}
