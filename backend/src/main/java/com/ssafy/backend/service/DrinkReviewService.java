package com.ssafy.backend.service;

import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.dto.drinkReview.DrinkReviewRequestDto;
import com.ssafy.backend.dto.drinkReview.DrinkReviewResponseDto;
import com.ssafy.backend.dto.drinkReview.DrinkReviewUpdateDto;
import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.DrinkRepository;
import com.ssafy.backend.repository.DrinkReviewRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DrinkReviewService {
    private final UserRepository userRepository;
    private final DrinkRepository drinkRepository;
    private final DrinkReviewRepository drinkReviewRepository;

    private final S3Service s3Service;

    public DrinkReviewResponseDto createDrinkReview(DrinkReviewRequestDto drinkReviewRequestDto, MultipartFile multipartFile) throws IOException {

        String image = (multipartFile != null && !multipartFile.isEmpty())
                ? s3Service.upload(UploadType.DRINKREVIEW, multipartFile)
                : "no image";
        drinkReviewRequestDto.setImg(image);

        User user = userRepository.findById(drinkReviewRequestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저가 존재하지 않습니다."));
        Drink drink = getDrink(drinkReviewRequestDto.getDrinkId());

        DrinkReview drinkReview = drinkReviewRequestDto.toEntity(user, drink);
        drinkReviewRepository.save(drinkReview);

        return DrinkReviewResponseDto.fromEntity(drinkReview);
    }

    private Drink getDrink(Long drinkId) {
        return drinkRepository.findById(drinkId)
                .orElseThrow(() -> new IllegalArgumentException("음료가 존재하지 않습니다."));
    }

    public Page<DrinkReviewResponseDto> findDrinkReviewByDrinkDrinkId(Long drinkId, Pageable pageable) {
        Page<DrinkReview> drinkReviewPage = drinkReviewRepository.findByDrinkDrinkId(drinkId, pageable);
        return drinkReviewPage.map(DrinkReviewResponseDto::fromEntity);
    }

    public List<DrinkReviewResponseDto> findReviewsByUserIdAndDrinkId(Long userId, Long drinkId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("해당 유저가 존재하지 않습니다.")
        );

        Drink drink = getDrink(drinkId);

        List<DrinkReview> drinkReviewList = drinkReviewRepository.findAllByUserAndDrink(user, drink);
        return drinkReviewList.stream().map(DrinkReviewResponseDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void deleteDrinkReview(Long drinkReviewId, Long userId) {
        DrinkReview drinkReview = drinkReviewRepository.findById(drinkReviewId)
                .orElseThrow(() -> new IllegalArgumentException("음료 리뷰가 존재하지 않아 삭제할 수 없습니다."));

        if (!Objects.equals(drinkReview.getUser().getUserId(), userId)) {
            throw new IllegalArgumentException("해당 리뷰의 작성자가 아닙니다.");
        }

        //이미지 삭제 하는 로직
        if (isdefalutImg(drinkReview.getImg())) s3Service.deleteImg(drinkReview.getImg());

        drinkReviewRepository.deleteById(drinkReviewId);
    }

    public DrinkReviewResponseDto updateDrinkReview(Long drinkReviewId, DrinkReviewUpdateDto request, MultipartFile multipartFile, Long userId) throws IOException {
        if (!drinkReviewId.equals(request.getDrinkReviewId())) {
            throw new IllegalArgumentException("요청한 리뷰 ID와 전송된 데이터의 리뷰 ID가 일치하지 않습니다.");
        }

        DrinkReview drinkReview = drinkReviewRepository.findById(request.getDrinkReviewId())
                .orElseThrow(() -> new IllegalArgumentException("음료 리뷰가 존재하지 않아 수정할 수 없습니다."));

        if (!Objects.equals(drinkReview.getUser().getUserId(), userId)) {
            throw new IllegalArgumentException("해당 리뷰의 작성자가 아닙니다.");
        }
        //업로드 이미지가 존재
        if (multipartFile != null) {
            //모임 이미지가 기본 이미지가 아니면 S3에서 삭제
            if (isdefalutImg(drinkReview.getImg())) s3Service.deleteImg(drinkReview.getImg());

            request.setImgSrc(s3Service.upload(UploadType.DRINKREVIEW, multipartFile));
        } else {//업로드 이미지 없음
            //기본 이미지로 설정하는 것이 아니면 기존 이미지 유지
            if (request.getImgSrc() == null) request.setImgSrc(drinkReview.getImg());
        }

        drinkReview.updateContent(request.getContent());
        drinkReview.updateImg(request.getImgSrc());

        drinkReviewRepository.save(drinkReview);
        return DrinkReviewResponseDto.fromEntity(drinkReview);
    }

    public Page<DrinkReviewResponseDto> findDrinkReviewByOrderByLikeCountDesc(Pageable pageable) {
        Page<DrinkReview> drinkReviewPage = drinkReviewRepository.findAllByOrderByLikeCountDesc(pageable);
        return drinkReviewPage.map(DrinkReviewResponseDto::fromEntity);
    }

    public Page<DrinkReviewResponseDto> findAllByOrderByCreatedAtDesc(Pageable pageable) {
        Page<DrinkReview> drinkReviewPage = drinkReviewRepository.findAllByOrderByCreatedAtDesc(pageable);
        return drinkReviewPage.map(DrinkReviewResponseDto::fromEntity);
    }
    public DrinkReviewResponseDto findReviewByDrinkReviewId(Long drinkReviewId) {
        DrinkReview drinkReview = drinkReviewRepository.findByDrinkReviewId(drinkReviewId).orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다."));
        return DrinkReviewResponseDto.fromEntity(drinkReview);

    }

    private boolean isdefalutImg(String imgSrc) {
        return !imgSrc.equals("no image");
    }
}
