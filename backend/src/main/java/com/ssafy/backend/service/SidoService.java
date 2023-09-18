package com.ssafy.backend.service;

import com.ssafy.backend.entity.Sido;
import com.ssafy.backend.repository.SidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SidoService {

    private final SidoRepository sidoRepository;

    public List<Sido> findAll() {
        return sidoRepository.findAll();
    }

    public Sido findById(Integer id) {
        return sidoRepository.findById(id).orElse(null);
    }
}
