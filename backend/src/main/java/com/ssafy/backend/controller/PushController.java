package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Push;
import com.ssafy.backend.service.PushService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/push")
public class PushController {
    private final PushService pushService;

    @GetMapping(value = "/connect/{userId}", produces = "text/event-stream")
    @ResponseStatus(HttpStatus.OK)
    public SseEmitter connect(@PathVariable Long userId,
                              @RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId) throws IOException {
        //클라이언트로 전달되는 것이 아닌, 클라이언트에게 지속적으로 알림을 제공하기 위한 연결 통로를 생성한다.
        return pushService.connect(userId, lastEventId);
    }

    @GetMapping("/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<Push> getUserPushLog(@PathVariable Long userId) {
        return pushService.getUserPushLog(userId);
    }

    @DeleteMapping("/{pushId}")
    @ResponseStatus(HttpStatus.OK)
    public String deletePushLog(@PathVariable Long pushId) {
        pushService.deletePushById(pushId);
        return "알림이 삭제되었습니다.";
    }
}