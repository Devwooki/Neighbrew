package com.ssafy.backend.service;

import com.ssafy.backend.entity.DrinkFestival;
import com.ssafy.backend.repository.DrinkFestivalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DrinkFestivalService {
    private final DrinkFestivalRepository drinkFestivalRepository;

    public List<DrinkFestival> getAllFestival() {
        return drinkFestivalRepository.findAll();
    }
}
