package com.ssafy.backend.controller;

import com.ssafy.backend.entity.ChatMessageMongo;
import com.ssafy.backend.service.ChatMessageService;
import com.ssafy.backend.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/chatMessage")
public class ChatMessageController {
    private final ChatMessageService chatMessageService;

    //단체 채팅방 메세지 가져온다.
    @GetMapping("{chatRoomId}/{userId}/messages")
    public ResponseEntity<List<ChatMessageMongo>> getChatMessages(@PathVariable Long chatRoomId,
                                                                  @PathVariable Long userId,
                                                                  @RequestHeader("Authorization") String token) {
        JwtUtil.validateToken(token, userId);
        List<ChatMessageMongo> messages = chatMessageService.getChatMessages(chatRoomId);
        return ResponseEntity.ok(messages);
    }
}
