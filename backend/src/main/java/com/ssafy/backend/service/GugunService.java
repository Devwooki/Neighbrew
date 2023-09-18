package com.ssafy.backend.service;

import com.ssafy.backend.dto.code.GugunResponseDto;
import com.ssafy.backend.repository.GugunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GugunService {
    private final GugunRepository gugunRepository;

    public List<GugunResponseDto> getGugunsBySidoCode(Integer sidoCode) {
        return gugunRepository.findBySidoCode(sidoCode)
                .stream().map(GugunResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
