package com.ssafy.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.entity.ChatMessageMongo;
import com.ssafy.backend.entity.ChatRoom;
import com.ssafy.backend.entity.ChatRoomUser;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.ChatMessageMongoRepository;
import com.ssafy.backend.repository.ChatRoomRepository;
import com.ssafy.backend.repository.ChatRoomUserRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;
    private final ChatMessageMongoRepository chatMessageMongoRepository;
    private final PushService pushService;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${neighbrew.full.url}")
    private String neighbrewUrl;

    public List<ChatRoom> findUserChatRooms(Long userId) {
        return chatRoomUserRepository.findByUserUserId(userId)
                .stream()
                .map(ChatRoomUser::getChatRoom)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatRoom createChatRoom(Map<String, Object> map) {
        ChatRoom room = chatRoomRepository.save(ChatRoom
                .builder()
                .chatRoomName((String) map.get("name"))
                .build());

        chatMessageMongoRepository.save(ChatMessageMongo.builder()
                .chatRoomId(room.getChatRoomId())
                .message("채팅방이 생성되었습니다.")
                .createdAt(String.valueOf(LocalDateTime.now()))
                .build());

        ((List<Integer>) map.get("userIdList")).forEach(userId -> chatRoomUserRepository.save(ChatRoomUser.builder()
                .chatRoom(room)
                .user(userRepository.findById(Long.valueOf(userId)).orElseThrow(
                        () -> new IllegalArgumentException("존재하지 않는 유저입니다.")))
                .build()));
        return room;
    }

    public String sendChatRoomMessage(Long roomId, String data) throws JsonProcessingException {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 채팅방입니다.")
        );

        JsonNode jsonNode = mapper.readTree(data);
        User user = userRepository.findById(jsonNode.get("userId").asLong()).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 유저입니다.")
        );

        if (chatRoomUserRepository.findByChatRoomChatRoomIdAndUserUserId(chatRoom.getChatRoomId(), jsonNode.get("userId").asLong()).isEmpty())
            throw new IllegalArgumentException("채팅방에 참여하지 않은 유저입니다.");

        ChatMessageMongo chatMessageMongo = ChatMessageMongo.builder()
                .chatRoomId(chatRoom.getChatRoomId())
                .message(jsonNode.get("message").asText())
                .userId(user.getUserId())
                .userNickname(user.getNickname())
                .createdAt(String.valueOf(LocalDateTime.now()))
                .build();
        mongoTemplate.insert(chatMessageMongo);

        //채팅방 유저한테 메세지 전송
//        for(ChatRoomUser cru : chatRoom.getUsers()){
//            pushService.send(user, cru.getUser(), PushType.CHAT, "모임(" + chatRoom.getMeet().getMeetName()  + ")의" + user.getNickname() +  "님께서 메세지를 보냈습니다.", neighbrewUrl + "/chatList" + roomId);
//        }

        Map<String, Object> map = mapper.convertValue(jsonNode, Map.class);
        map.put("userNickname", user.getNickname());
        return mapper.writeValueAsString(map);
    }

    @Transactional
    public String leaveChatRoom(Long roomId, String data) throws JsonProcessingException {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));
        Long userId = Long.valueOf(new ObjectMapper().readTree(data).get("userId").asText());

        ChatMessageMongo chatMessageMongo = deleteExistUser(room, userId);

        return mapper.writeValueAsString(chatMessageMongo);
    }

    public List<User> getUsersInChatRoom(Long chatRoomId) {
        return chatRoomRepository
                .findById(chatRoomId)
                .orElseThrow(
                        () -> new IllegalArgumentException("존재하지 않는 채팅방입니다."))
                .getUsers()
                .stream()
                .map(ChatRoomUser::getUser)
                .collect(Collectors.toList());
    }

    public ChatMessageMongo deleteExistUser(ChatRoom chatRoom, Long userId) {
        User findUser = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 유저입니다.")
        );

        chatRoomUserRepository.deleteByUserUserIdAndChatRoomChatRoomId(userId, chatRoom.getChatRoomId());
        return mongoTemplate.insert(ChatMessageMongo.builder()
                .userId(userId)
                .message(findUser.getNickname() + "님이 채팅방을 나갔습니다.")
                .chatRoomId(chatRoom.getChatRoomId())
                .createdAt(String.valueOf(LocalDateTime.now()))
                .build()
        );
    }
    public ChatRoom getChatRoomDetail(Long chatRoomId) {
        return chatRoomRepository.findByChatRoomId(chatRoomId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 채팅방입니다.")
        );
    }

    @Transactional
    public String joinChatRoom(Long roomId, String data) throws JsonProcessingException {
        JsonNode jsonNode = mapper.readTree(data);
        Long userId = jsonNode.get("userId").asLong();
        User joinUser = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("유저를 찾을 수 없습니다.")
        );

        ChatRoom findChatRoom = chatRoomRepository.findById(roomId).orElseThrow(
                () -> new IllegalArgumentException("모임 채팅방을 찾을 수 없습니다.")
        );

        //유저 존재하면 방번호 바로 반환
        for(ChatRoomUser cru :findChatRoom.getUsers())
            if (cru.getUser().getUserId().equals(userId)) {
                return "";
            }

        //존재하지 않으면 유저를 추가하고 방 번호를 반환한다.
        findChatRoom.getUsers().add(ChatRoomUser.builder()
                .chatRoom(findChatRoom)
                .user(joinUser)
                .build());

        //채팅에 다시 참여했다는 메세지를 전달한다.
        ChatMessageMongo chatMessageMongo = chatMessageMongoRepository.save(
                ChatMessageMongo.builder()
                        .chatRoomId(roomId)
                        .message(joinUser.getNickname() + "님께서 다시 채팅방에 참여하셨습니다.")
                        .createdAt(LocalDateTime.now().toString())
                        .build()
        );

        return mapper.writeValueAsString(chatMessageMongo);
    }
}
