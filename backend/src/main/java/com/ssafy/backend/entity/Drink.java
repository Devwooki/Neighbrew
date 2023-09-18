package com.ssafy.backend.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(indexes = @Index(name = "idx_drink_name", columnList = "name"))
public class Drink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long drinkId;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'no image'")
    private String image = "no image";

    @Column(nullable = false, columnDefinition = "float default 0.0")
    private Float degree = 0.0f;

    @Lob
    private String description;

    // 주종 태그 id
    private Long tagId;

    @Builder
    public Drink(Long drinkId, String name, String image, Float degree, String description, Long tagId) {
        this.drinkId = drinkId;
        this.name = name;
        this.image = image;
        this.degree = degree;
        this.description = description;
        this.tagId = tagId;
    }

    @PrePersist
    public void prePersist() {
        if (this.image == null) this.image = "no image";
        if (this.degree == null) this.degree = 0.0f;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Drink drink = (Drink) o;
        return Objects.equals(drinkId, drink.drinkId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(drinkId);
    }
}
