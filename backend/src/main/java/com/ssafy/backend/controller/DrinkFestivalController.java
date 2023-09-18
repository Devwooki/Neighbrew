package com.ssafy.backend.controller;

import com.ssafy.backend.service.DrinkFestivalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drinkFestival")
public class DrinkFestivalController {
    private final DrinkFestivalService drinkFestivalService;

    @GetMapping("/all")
    public ResponseEntity<?> getReviewsByDrinkId() {
        return ResponseEntity.ok(drinkFestivalService.getAllFestival());
    }
}
