package com.ssafy.backend.controller;

import com.ssafy.backend.dto.code.GugunResponseDto;
import com.ssafy.backend.service.GugunService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gugun")
public class GugunController {
    private final GugunService gugunService;

    @GetMapping("/{sidoCode}")
    public List<GugunResponseDto> getGugunsBySidoCode(@PathVariable Integer sidoCode) {
        return gugunService.getGugunsBySidoCode(sidoCode);
    }
}
