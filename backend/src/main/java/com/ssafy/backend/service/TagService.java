package com.ssafy.backend.service;

import com.ssafy.backend.entity.Tag;
import com.ssafy.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    public Tag findById(Long tagId) {
        return tagRepository.findById(tagId).orElseThrow(() -> new IllegalArgumentException("해당 태그를 찾을 수 없습니다."));
    }
}
