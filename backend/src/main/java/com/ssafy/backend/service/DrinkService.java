package com.ssafy.backend.service;

import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.dto.drink.DrinkRequestDto;
import com.ssafy.backend.dto.drink.DrinkResponseDto;
import com.ssafy.backend.dto.drink.DrinkUpdateRequestDto;
import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.repository.DrinkRepository;
import com.ssafy.backend.repository.DrinkReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DrinkService {
    private final DrinkRepository drinkRepository;
    private final DrinkReviewRepository drinkReviewRepository;
    private final S3Service s3Service;

    // 모든 술 조회
    public Page<DrinkResponseDto> findAll(Pageable pageable) {
        Page<Drink> drinks = drinkRepository.findAll(pageable);
        return drinks.map(DrinkResponseDto::fromEntity);
    }

    // 술 추가
    public DrinkResponseDto save(DrinkRequestDto drinkRequestDto, MultipartFile multipartFile) throws IOException {
        if (drinkRequestDto.getName().isEmpty()) throw new IllegalArgumentException("술 이름이 없습니다.");

        String imgSrc = "no image";
        if (multipartFile != null && !multipartFile.isEmpty()) {
            imgSrc = s3Service.upload(UploadType.DRINKREVIEW, multipartFile);
        }

        DrinkRequestDto updatedRequestDto = DrinkRequestDto.builder()
                .name(drinkRequestDto.getName())
                .imgSrc(imgSrc)
                .degree(drinkRequestDto.getDegree())
                .description(drinkRequestDto.getDescription())
                .tagId(drinkRequestDto.getTagId())
                .build();

        return DrinkResponseDto.fromEntity(drinkRepository.save(updatedRequestDto.toEntity()));
    }

    // 술 삭제
    public void deleteDrinkById(Long drinkId) {
        if (!drinkRepository.existsById(drinkId)) {
            throw new IllegalArgumentException("해당 술이 없습니다.");
        }
        drinkRepository.deleteById(drinkId);
    }

    // 술 수정
    public DrinkResponseDto updateDrinkById(Long drinkId, DrinkUpdateRequestDto drinkUpdateRequestDto) {
        Drink existingDrink = drinkRepository.findById(drinkId)
                .orElseThrow(() -> new IllegalArgumentException("해당 술이 없습니다."));

        // 업데이트 로직 적용
        Drink updatedDrink = Drink.builder()
                .drinkId(existingDrink.getDrinkId())
                .name(drinkUpdateRequestDto.getName() != null ? drinkUpdateRequestDto.getName() : existingDrink.getName())
                .image(drinkUpdateRequestDto.getImage() != null ? drinkUpdateRequestDto.getImage() : existingDrink.getImage())
                .degree(drinkUpdateRequestDto.getDegree() != null ? drinkUpdateRequestDto.getDegree() : existingDrink.getDegree())
                .description(drinkUpdateRequestDto.getDescription() != null ? drinkUpdateRequestDto.getDescription() : existingDrink.getDescription())
                .tagId(drinkUpdateRequestDto.getTagId() != null ? drinkUpdateRequestDto.getTagId() : existingDrink.getTagId())
                .build();

        Drink savedUpdatedDrink = drinkRepository.save(updatedDrink);

        return DrinkResponseDto.builder()
                .drinkId(savedUpdatedDrink.getDrinkId())
                .name(savedUpdatedDrink.getName())
                .image(savedUpdatedDrink.getImage())
                .degree(savedUpdatedDrink.getDegree())
                .description(savedUpdatedDrink.getDescription())
                .tagId(savedUpdatedDrink.getTagId())
                .build();
    }

    public DrinkResponseDto getDrinkDetailsById(Long drinkId) {
        Drink drink = drinkRepository.findById(drinkId)
                .orElseThrow(() -> new IllegalArgumentException("해당 술이 없습니다."));

        return DrinkResponseDto.fromEntity(drink);
    }

    public Page<DrinkResponseDto> searchDrinksByCriteria(String name, Long tagId, Pageable pageable) {
        Page<Drink> drinks;
        if (name == null && tagId == 0) {
            drinks = drinkRepository.findAll(pageable);
        } else if (name == null) {
            drinks = drinkRepository.findByTagId(tagId, pageable).orElse(Page.empty());
        } else if (tagId == 0) {
            drinks = drinkRepository.findByNameContains(name, pageable).orElse(Page.empty());
        } else {
            drinks = drinkRepository.findByNameContainsAndTagId(name, tagId, pageable).orElse(Page.empty());
        }
        return drinks.map(DrinkResponseDto::fromEntity);
    }

    public List<DrinkResponseDto> findReviewedDrinksByUserId(Long userId) {
        return drinkReviewRepository.findDrinksByUserId(userId)
                .stream().map(DrinkResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
