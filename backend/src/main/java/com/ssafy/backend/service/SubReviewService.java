package com.ssafy.backend.service;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.dto.subReview.SubReviewRequestDto;
import com.ssafy.backend.dto.subReview.SubReviewResponseDto;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.SubReview;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.DrinkReviewRepository;
import com.ssafy.backend.repository.SubReviewRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubReviewService {
    private final SubReviewRepository subReviewRepository;
    private final UserRepository userRepository;
    private final DrinkReviewRepository drinkReviewRepository;
    private final PushService pushService;

    @Value("${neighbrew.full.url}")
    private String neighbrewUrl;

    // 리뷰의 댓글을 조회하는 API
    public List<SubReviewResponseDto> findByDrinkReviewId(Long drinkReviewId) {
        return subReviewRepository.findByDrinkReviewDrinkReviewIdOrderByCreatedAtDesc(drinkReviewId)
                .stream().map(SubReviewResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 리뷰의 댓글을 작성하는 API
    public SubReviewResponseDto writeSubReview(SubReviewRequestDto subReviewRequestDto, Long userId) {
        DrinkReview drinkReview = drinkReviewRepository.findById(subReviewRequestDto.getDrinkReviewId()).orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다."));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        // content가 비어있는지 확인
        if (subReviewRequestDto.getContent().isEmpty()) {
            throw new IllegalArgumentException("댓글 내용이 비어있습니다.");
        }

        SubReview subReview = SubReview.builder()
                .content(subReviewRequestDto.getContent())
                .drinkReview(drinkReview)
                .user(user)
                .build();

        pushService.send(user, drinkReview.getUser(), PushType.SUBREVIEW, user.getNickname() + "님이 회원님의 후기에 댓글을 남겼습니다.", neighbrewUrl + "/drinkpost/" + drinkReview.getDrink().getDrinkId() + "/" + drinkReview.getDrinkReviewId());
        return SubReviewResponseDto.fromEntity(subReviewRepository.save(subReview));
    }

    @Transactional
    public void deleteSubReview(Long subReviewId, Long userId) {
        SubReview subReview = subReviewRepository.findById(subReviewId).orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        // 댓글 작성자와 삭제 요청자가 같은지 확인
        if (!subReview.getUser().equals(user)) {
            throw new IllegalArgumentException("댓글 작성자와 삭제 요청자가 다릅니다.");
        }

        subReviewRepository.delete(subReview);
    }

    // 아이디 수정
    @Transactional
    public SubReview updateSubReview(SubReviewRequestDto subReviewRequestDto, Long userId) {
        SubReview subReview = subReviewRepository.findById(subReviewRequestDto.getSubReviewId()).orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        // 댓글 작성자와 수정 요청자가 같은지 확인
        if (!subReview.getUser().equals(user)) {
            throw new IllegalArgumentException("댓글 작성자와 수정 요청자가 다릅니다.");
        }

        // content가 비어있는지 확인
        if (subReviewRequestDto.getContent().isEmpty()) {
            throw new IllegalArgumentException("댓글 내용이 비어있습니다.");
        }

        subReview.update(subReviewRequestDto.getContent());

        return subReviewRepository.save(subReview);
    }
}
