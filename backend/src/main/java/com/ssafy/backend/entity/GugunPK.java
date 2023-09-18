package com.ssafy.backend.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class GugunPK implements Serializable {
    private Integer gugunCode;
    private Integer sidoCode;
}
