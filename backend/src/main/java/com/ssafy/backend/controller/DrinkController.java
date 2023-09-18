package com.ssafy.backend.controller;

import com.ssafy.backend.dto.drink.DrinkRequestDto;
import com.ssafy.backend.dto.drink.DrinkResponseDto;
import com.ssafy.backend.dto.drink.DrinkUpdateRequestDto;
import com.ssafy.backend.service.DrinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/drink")
public class DrinkController {
    private final DrinkService drinkService;

    // 모든 술 조회
    @GetMapping
    public ResponseEntity<Page<DrinkResponseDto>> findAllDrinks(Pageable pageable) {
        Page<DrinkResponseDto> drinks = drinkService.findAll(pageable);
        return ResponseEntity.ok(drinks);
    }

    // 술 이름과 태그로 검색
    @GetMapping("/search")
    public ResponseEntity<Page<DrinkResponseDto>> searchDrinksByCriteria(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long tagId,
            Pageable pageable) {
        Page<DrinkResponseDto> drinkPage = drinkService.searchDrinksByCriteria(name, tagId, pageable);
        return ResponseEntity.ok(drinkPage);
    }

    @GetMapping("/{drinkId}")
    public ResponseEntity<DrinkResponseDto> getDrinkDetailsById(@PathVariable Long drinkId) {
        DrinkResponseDto drinkResponseDto = drinkService.getDrinkDetailsById(drinkId);
        return ResponseEntity.ok(drinkResponseDto);
    }

    //    유저가 리뷰를 작성한 술 정보 조회
    @GetMapping("/user/{userId}/review-drink")
    public ResponseEntity<List<DrinkResponseDto>> findReviewedDrinksByUserId(@PathVariable Long userId) {
        List<DrinkResponseDto> drinkResponseDtos = drinkService.findReviewedDrinksByUserId(userId);
        return ResponseEntity.ok(drinkResponseDtos);
    }

    // 술 추가
    @PostMapping()
    public ResponseEntity<DrinkResponseDto> save(
            @ModelAttribute DrinkRequestDto drinkRequestDto,
            @RequestPart(value = "image", required = false) MultipartFile multipartFile) throws IOException {
        return ResponseEntity.ok(drinkService.save(drinkRequestDto, multipartFile));
    }

    // 술 삭제
    @DeleteMapping("/{drinkId}")
    public ResponseEntity<String> deleteDrinkById(@PathVariable Long drinkId) {
        drinkService.deleteDrinkById(drinkId);
        // 삭제완료 메시지
        return ResponseEntity.ok("삭제 완료");
    }

    // 술 수정
    @PutMapping("/{drinkId}")
    public ResponseEntity<DrinkResponseDto> updateDrinkById(@PathVariable Long drinkId, @RequestBody DrinkUpdateRequestDto drinkUpdateRequestDto) {
        DrinkResponseDto drinkResponseDto = drinkService.updateDrinkById(drinkId, drinkUpdateRequestDto);
        return ResponseEntity.ok(drinkResponseDto);
    }
}
