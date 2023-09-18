package com.ssafy.backend.service;

import com.ssafy.backend.Enum.MeetStatus;
import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.dto.code.GugunResponseDto;
import com.ssafy.backend.dto.code.SidoResponseDto;
import com.ssafy.backend.dto.meet.MeetRequestDto;
import com.ssafy.backend.dto.meet.MeetResponseDto;
import com.ssafy.backend.dto.meet.MeetUserDto;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MeetService {
    private final MeetRepository meetRepository;
    private final MeetUserRepository meetUserRepository;

    private final ChatRoomRepository chatRoomRepository;
    private final DrinkRepository drinkRepository;
    private final FollowRepository followRepository;
    private final GugunRepository gugunRepository;
    private final MeetUserService meetUserService;
    private final MongoTemplate mongoTemplate;
    private final PushService pushService;
    private final S3Service s3Service;
    private final SidoRepository sidoRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    private final ChatRoomService chatRoomService;
    private final ChatRoomUserService chatRoomUserService;
    private final ModelMapper modelMapper;

    @Value("${neighbrew.full.url}")
    private String neighbrewUrl;

    public Page<MeetResponseDto> findMeetsByTagId(Long tagId, Pageable pageable) {
        validateTagId(tagId);
        return tagId == 0L ? findAll(pageable) : findByTagId(tagId, pageable);
    }

    private Page<MeetResponseDto> findAll(Pageable pageable) {
        return getMeetSearchDtos(meetRepository.findByMeetStatusNotOrderByCreatedAtDesc(MeetStatus.END, pageable));
    }

    private Page<MeetResponseDto> findByTagId(Long tagId, Pageable pageable) {
        return getMeetSearchDtos(meetRepository.findByTagTagIdAndMeetStatusNotOrderByCreatedAtDesc(tagId, MeetStatus.END, pageable));
    }

    private void validateTagId(Long tagId) {
        if (tagId > 7L || tagId < 0L) {
            throw new IllegalArgumentException("태그ID가 존재하지 않습니다.");
        }
    }

    private Page<MeetResponseDto> getMeetSearchDtos(Page<Meet> data) {
        return data.map(meet -> {
            MeetResponseDto meetResponseDto = modelMapper.map(meet, MeetResponseDto.class);
            meetResponseDto.setSido(SidoResponseDto.fromEntity(sidoRepository.findById(meet.getSidoCode()).orElseThrow(
                    () -> new IllegalArgumentException("시도 정보를 찾을 수 없습니다.")
            )));

            meetResponseDto.setGugun(GugunResponseDto.fromEntity(gugunRepository.findBySidoCodeAndGugunCode(meet.getSidoCode(), meet.getGugunCode()).orElseThrow(
                    () -> new IllegalArgumentException("구군 정보를 찾을 수 없습니다.")
            )));

            return meetResponseDto;
        });
    }

    public Map<String, Object> findMeetdetailByMeetId(Long meetId) {
        List<MeetUser> meetUsers = meetUserRepository.findByMeetMeetIdOrderByStatusDesc(meetId).orElseThrow(
                () -> new IllegalArgumentException("해당 모임 정보가 없습니다.")
        );

        List<User> users = meetUsers.stream().map(MeetUser::getUser).collect(Collectors.toList());
        List<Status> statuses = meetUsers.stream().map(MeetUser::getStatus).collect(Collectors.toList());

        return createResultMap(findByMeetId(meetId), users, statuses);
    }

    private Map<String, Object> createResultMap(MeetResponseDto meet, List<User> users, List<Status> statuses) {
        Map<String, Object> result = new HashMap<>();
        result.put("meet", meet);
        result.put("users", users);
        result.put("statuses", statuses);
        return result;
    }

    public MeetResponseDto findByMeetId(Long meetId) {
        Meet findMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("미팅 정보가 올바르지 않습니다."));
        return findMeet.toMeetResponseDto(sidoRepository.findById(findMeet.getSidoCode()).orElseThrow(() -> new IllegalArgumentException("올바르지 않은 정보 입니다.")),
                gugunRepository.findBySidoCodeAndGugunCode(findMeet.getSidoCode(), findMeet.getGugunCode()).orElseThrow(
                        () -> new IllegalArgumentException("올바르지 않은 정보 입니다.")
                ));
    }

    public MeetUserDto findMeetUserByMeetId(Long meetId) {
        List<MeetUser> meetUsers = meetUserRepository.findByMeetMeetIdOrderByStatusDesc(meetId).orElseThrow(
                () -> new IllegalArgumentException("해당 모임 정보가 없습니다.")
        );

        MeetUserDto meetUserDto = MeetUserDto.builder().build();

        if (!meetUsers.isEmpty()) {
            setMeetRequestDtoFromFirstMeetUser(meetUserDto, meetUsers.get(0));
            addUsersAndStatusesToDto(meetUserDto, meetUsers);
        }

        return meetUserDto;
    }

    private void setMeetRequestDtoFromFirstMeetUser(MeetUserDto meetUserDto, MeetUser firstMeetUser) {
        meetUserDto.setMeetRequestDto(firstMeetUser.getMeet().toDto());
    }

    private void addUsersAndStatusesToDto(MeetUserDto meetUserDto, List<MeetUser> meetUsers) {
        List<User> users = meetUsers.stream().map(MeetUser::getUser).collect(Collectors.toList());
        List<Status> statuses = meetUsers.stream().map(MeetUser::getStatus).collect(Collectors.toList());

        meetUserDto.setUsers(users);
        meetUserDto.setStatuses(statuses);
    }

    public Map<String, List<MeetResponseDto>> findUserMeetByUserId(Long userId) {
        Map<String, List<MeetResponseDto>> userMeets = Arrays.stream(Status.values()).collect(Collectors.toMap(Enum::name, status -> new ArrayList<>(), (a, b) -> b));

        List<MeetUser> meetUsers = meetUserRepository.findByUserUserIdOrderByMeetCreatedAtDesc(userId);

        for (MeetUser meetUser : meetUsers) {
            MeetResponseDto responseDto = toMeetResponseDto(meetUser);
            userMeets.get(meetUser.getStatus().name()).add(responseDto);
        }

        return userMeets;
    }

    private MeetResponseDto toMeetResponseDto(MeetUser meetUser) {
        Sido findSido = sidoRepository.findById(meetUser.getMeet().getSidoCode())
                .orElseThrow(() -> new IllegalArgumentException("올바른 시도 정보가 입력되지 않았습니다."));

        Gugun findGugun = gugunRepository.findBySidoCodeAndGugunCode(meetUser.getMeet().getSidoCode(), meetUser.getMeet().getGugunCode())
                .orElseThrow(() -> new IllegalArgumentException("올바른 구군 정보가 입력되지 않았습니다."));

        return meetUser.getMeet().toMeetResponseDto(findSido, findGugun);
    }

    private void validateMeet(MeetRequestDto meetRequestDto, Long drinkId) {
        if (meetRequestDto.getMeetName() == null) throw new IllegalArgumentException("모임 이름이 등록되지 않았습니다.");
        if (meetRequestDto.getMeetDate() == null) throw new IllegalArgumentException("모임 날짜 정보가 누락되었습니다.");
        if (meetRequestDto.getMeetDate().toLocalDate() == null)
            throw new IllegalArgumentException("모임 날짜가 입력되지 않았습니다.");
        if (meetRequestDto.getMeetDate().toLocalTime() == null)
            throw new IllegalArgumentException("모임 시간이 입력되지 않았습니다.");
        if (meetRequestDto.getMaxParticipants() == null)
            throw new IllegalArgumentException("모임 최대 인원 수용 정보가 입력되지 않았습니다.");
        if (meetRequestDto.getMaxParticipants() > 8) throw new IllegalArgumentException("모임 최대 인원 수용치를 초과했습니다.");
        if (drinkId == null) throw new IllegalArgumentException("모임에 등록할 술 정보가 포함되지 않았습니다.");
        if (meetRequestDto.getTagId() == null) throw new IllegalArgumentException("모임에 등록할 태그 정보가 포함되지 않았습니다.");
        if (meetRequestDto.getMinAge() < 20) throw new IllegalArgumentException("모임 최소나이를 다시 입력해 주세요.");
        if (meetRequestDto.getMinAge() >= 200) throw new IllegalArgumentException("모임 최대 나이를 다시 입력해 주세요.");
        if (meetRequestDto.getMeetDate().isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("모임 날짜 및 시간을 확인해 주세요.");
    }

    public Meet saveMeet(MeetRequestDto meetRequestDto, Long userId, Long drinkId, MultipartFile multipartFile) throws IOException {
        validateMeet(meetRequestDto, drinkId);
        setHostAndImage(meetRequestDto, userId, multipartFile);

        ChatRoom createdChatRoom = createChatRoom(meetRequestDto.getMeetName());
        Meet createdMeet = saveMeetEntity(meetRequestDto, drinkId, createdChatRoom);

        User hostUser = findUserById(userId);
        saveMeetUser(createdMeet, hostUser);
        setupChatRoomUser(createdChatRoom, hostUser);
        notifyFollowersAboutMeetCreation(hostUser, createdMeet);

        return createdMeet;
    }

    private void setHostAndImage(MeetRequestDto meetRequestDto, Long userId, MultipartFile multipartFile) throws IOException {
        meetRequestDto.setHostId(userId);
        meetRequestDto.setImgSrc(multipartFile != null ? s3Service.upload(UploadType.MEET, multipartFile) : "no image");
    }

    private ChatRoom createChatRoom(String meetName) {
        return chatRoomRepository.save(ChatRoom.builder().chatRoomName(meetName + "모임의 채팅방").build());
    }

    private Meet saveMeetEntity(MeetRequestDto meetRequestDto, Long drinkId, ChatRoom createdChatRoom) {
        Meet meet = meetRequestDto.toEntity();
        meet.setHost(findUserById(meetRequestDto.getHostId()));
        meet.setTag(findTagById(meetRequestDto.getTagId()));
        meet.setDrink(findDrinkById(drinkId));
        meet.setChatRoom(createdChatRoom);
        meet.setNowParticipants(1);
        return meetRepository.save(meet);
    }

    private User findUserById(Long userId) {
        return userRepository.findByUserId(userId).orElseThrow(
                () -> new IllegalArgumentException("올바른 유저 정보가 입력되지 않았습니다."));
    }

    private Tag findTagById(Long tagId) {
        return tagRepository.findById(tagId).orElseThrow(
                () -> new IllegalArgumentException("올바른 태그 정보가 입력되지 않았습니다."));
    }

    private Drink findDrinkById(Long drinkId) {
        return drinkRepository.findById(drinkId).orElseThrow(
                () -> new IllegalArgumentException("올바른 술 정보가 입력되지 않았습니다."));
    }

    private void saveMeetUser(Meet meet, User hostUser) {
        meetUserService.saveMeetUser(meet, hostUser, Status.HOST);
    }

    private void setupChatRoomUser(ChatRoom chatRoom, User hostUser) {
        settingChatRoomUser(ChatRoomUser.builder()
                .chatRoom(chatRoom)
                .user(hostUser), chatRoom, hostUser, "채팅방이 생성되었습니다.");
    }

    private void notifyFollowersAboutMeetCreation(User hostUser, Meet createdMeet) {
        List<Follow> followers = findFollowersByUserId(hostUser.getUserId());
        followers.forEach(follower -> pushService.send(hostUser, follower.getFollower(), PushType.MEETCREATED, hostUser.getNickname() + "님께서 모임(" + createdMeet.getMeetName() + ")을 생성했습니다.", neighbrewUrl + "/meet/" + createdMeet.getMeetId()));
    }

    private List<Follow> findFollowersByUserId(Long userId) {
        return followRepository.findByFollowingUserId(userId).orElseThrow(
                () -> new IllegalArgumentException("팔로잉 정보를 찾을 수 없습니다."));
    }

    private void settingChatRoomUser(ChatRoomUser.ChatRoomUserBuilder createChatRoom, ChatRoom createChatRoom1, User hostUser, String message) {
        chatRoomUserService.save(createChatRoom.build());

        mongoTemplate.insert(ChatMessageMongo.builder()
                .chatRoomId(createChatRoom1.getChatRoomId())
                .message(message)
                .createdAt(String.valueOf(LocalDateTime.now()))
                .userId(hostUser.getUserId())
                .build(), "chat");
    }

    public void updateMeet(MeetRequestDto meetRequestDto,
                           Long userId,
                           Long meetId,
                           Long drinkId,
                           MultipartFile multipartFile) throws IOException {
        validateMeet(meetRequestDto, drinkId);

        //기존 Meet imgSrc를 가져온다
        String prevMeetImgSrc = meetRepository.findImgSrcByMeetId(meetId);

        User host = findUserById(userId);

        updateImage(meetRequestDto, multipartFile, prevMeetImgSrc);

        //기존 데이터를 가져온 뒤 업데이트 한다.
        Meet updateMeet = getMeet(meetId);
        updateMeet.update(meetRequestDto.toEntity()); //업데이트한다.
        updateMeet.setMeetId(meetId);
        updateMeet.setTag(findTagById(meetRequestDto.getTagId()));
        updateMeet.setDrink(findDrinkById(drinkId));

        meetRepository.save(updateMeet);

        List<MeetUser> meetUsers = meetUserRepository.findByMeetMeetIdOrderByStatusDesc(meetId).orElseThrow(
                () -> new IllegalArgumentException("모임 정보를 찾을 수 없습니다."));

        //방장에게는 알림을 전송하지 않는다.
        meetUsers.stream()
                .filter(user -> !user.getUser().getUserId().equals(meetRequestDto.getHostId()))
                .forEach(user -> pushService.send(host, user.getUser(), PushType.MEETMODIFIDE, "모임( " + meetRequestDto.getMeetName() + ")의 내용이 수정되었습니다. 확인해 주세요.", neighbrewUrl + "/meet/" + updateMeet.getMeetId()));

    }

    private Meet getMeet(Long meetId) {
        return meetRepository.findById(meetId).orElseThrow(
                () -> new IllegalArgumentException("해당 미팅 정보를 찾을 수 없습니다."));
    }

    private void updateImage(MeetRequestDto meetRequestDto, MultipartFile multipartFile, String prevMeetImgSrc) throws IOException {
        //업로드 이미지가 존재
        if (multipartFile != null) {
            //모임 이미지가 기본 이미지가 아니면 S3에서 삭제
            if (!prevMeetImgSrc.equals("no image")) s3Service.deleteImg(prevMeetImgSrc);

            //새로운 이미지로 업로드
            meetRequestDto.setImgSrc(s3Service.upload(UploadType.MEET, multipartFile));
        } else {//업로드 이미지 없음
            //기본 이미지로 설정하는 것이 아니면 기존 이미지 유지
            if (meetRequestDto.getImgSrc() == null) meetRequestDto.setImgSrc(prevMeetImgSrc);
        }
    }

    @Transactional
    public void deleteMeet(Long hostId, Long meetId) {
        Meet deleteMeet = getMeet(meetId);
        //유효성 검사
        if (!deleteMeet.getHost().getUserId().equals(hostId))
            throw new IllegalArgumentException("방장이 아니면 방을 삭제할 수 없습니다.");

        List<MeetUser> meetUsers = meetUserRepository.findByMeetMeetIdOrderByStatusDesc(meetId).orElseThrow(
                () -> new IllegalArgumentException("모임 정보를 찾을 수 없습니다."));

        //MeetUser 정보를 삭제한다.
        meetUserService.deleteMeetUser(deleteMeet);

        //meet 이미지를 지운다
        if (!deleteMeet.getImgSrc().equals("no image")) s3Service.deleteImg(deleteMeet.getImgSrc());

        //마지막에 모임 정보를 제거한다.
        meetRepository.findById(meetId).ifPresent(meetRepository::delete);

        //모임 참여자가 1명이고
        if (meetUsers.size() == 1) {
            if (meetUsers.get(0).getStatus().equals(Status.HOST)) {//그 유저가 방장일 때 채팅방도 같이 제거되도록 변경
                if (deleteMeet.getHost().getUserId().equals(meetUsers.get(0).getUser().getUserId())) {
                    chatRoomRepository.deleteById(deleteMeet.getChatRoom().getChatRoomId());
                }
            }

        }

        //해당 미팅에 참여한 사람들에게 Push 알림을 보낸다.
        //방장에게는 알림을 전송하지 않는다.
        meetUsers.stream()
                .filter(user -> !user.getUser().getUserId().equals(hostId))
                .forEach(user -> pushService.send(deleteMeet.getHost(), user.getUser(), PushType.MEETDELETED, deleteMeet.getHost().getNickname() + "님 께서 생성한 모임" + "(" + deleteMeet.getMeetName() + ")이 삭제되었습니다.", neighbrewUrl + "/meet"));
    }

    public void applyMeet(Long userId, Long meetId) {
        MeetUserDto meetUserDto = findMeetUserByMeetId(meetId);
        Meet attendMeet = getMeet(meetId);
        Long hostId = meetUserDto.getMeetRequestDto().getHostId();

        User attendUser = findUserById(userId);

        User host = findUserById(hostId);

        //모임의 인원수 체크
        if (meetUserDto.getMeetRequestDto().getNowParticipants() >= meetUserDto.getMeetRequestDto().getMaxParticipants())
            throw new IllegalArgumentException("해당 모임에 참여 인원이 가득 찼습니다.");

        //모임에 참가 했을 경우 제외한다.
        for (User user : meetUserDto.getUsers()) {
            if (userId.equals(user.getUserId())) throw new IllegalArgumentException("이미 참여하신 모임 입니다.");
        }

        //참가자의 모임 상태 추가 -> 데이터를 추가해야한다.
        meetUserService.saveMeetUser(attendMeet, attendUser, Status.APPLY);

        //호스트에게 알림 제공 - meet의 hostId를 얻어와야한다.
        pushService.send(attendUser, host, PushType.MEETACCESS, attendUser.getNickname() + "님께서 " + meetUserDto.getMeetRequestDto().getMeetName() + "모임에 참여하고 싶어 합니다.", neighbrewUrl + "/meet/" + attendMeet.getMeetId());
    }

    @Transactional
    public void applyCancelMeet(Long userId, Long meetId) {
        Meet meet = getMeet(meetId);

        Status applyUserStatus = meetUserService.findUserStatus(userId, meetId);

        if (applyUserStatus != Status.APPLY) throw new IllegalArgumentException("가입신청중인 유저만 모임 신청을 취소할 수 있습니다.");

        //신청 취소할 경우 참여자 수 -1로 변경
        meetRepository.save(meet);

        //모임-유저테이블에서 해당 정보 삭제
        meetUserService.deleteExitUser(userId, meetId, Status.APPLY);
        //푸시알림 로그 삭제
        pushService.deletePushLog(PushType.MEETACCESS, userId, meet.getHost().getUserId());

    }

    @Transactional
    public void exitMeet(Long userId, Long meetId) {
        //모임에서 나간다
        Status applyUserStatus = meetUserService.findUserStatus(userId, meetId);
        if (applyUserStatus == Status.HOST)
            throw new IllegalArgumentException("죄송합니다.. 방장님은 나가실 수 없으십니다. 모임 삭제를 요청하세요.");

        //모임-유저테이블에서 해당 정보 삭제
        meetUserService.deleteExitUser(userId, meetId, Status.GUEST);

        //채팅-유저테이블에서 해당 정보 삭제

        //chat_room_user도 사라진다.
        Meet nowMeet = getMeet(meetId);

        //모임에서 나갈 경우 참여자 수 -1로 변경
        nowMeet.setNowParticipants(nowMeet.getNowParticipants() - 1);
        meetRepository.save(nowMeet);

        chatRoomService.deleteExistUser(nowMeet.getChatRoom(), userId);
    }

    public String manageMeet(Long userId, Long meetId, boolean applyResult) {
        Meet managementMeet = getMeet(meetId);

        User host = managementMeet.getHost();
        User manageUser = findUserById(userId);

        if (applyResult) {//신청 결과가 true
            //모임 상태를 변경 시킨다.
            meetUserService.updateMeetStatus(userId, meetId, Status.GUEST);
            //모임 참여 인원수 1증가 시킨다.
            updateParticipants(meetId);

            //채팅방에 참여 시킨다
            settingChatRoomUser(ChatRoomUser.builder()
                    .user(manageUser)
                    .chatRoom(managementMeet.getChatRoom()), managementMeet.getChatRoom(), host, manageUser.getNickname() + "님이 모임에 참여하셨습니다.");

            pushService.send(host, manageUser, PushType.MEETACCESS, "회원님께서 모임(" + managementMeet.getMeetName() + ")참여 되셨습니다.\n 즐거운 시간 되세요.", "meet/" + managementMeet.getMeetId());

            return userId + "유저 " + meetId + "모임 신청 승인";
        } else {//신청 결과가 false
            meetUserService.deleteExitUser(userId, meetId, Status.APPLY);
            pushService.send(host, manageUser, PushType.MEETREJECT, "회원님께서 모임(" + managementMeet.getMeetName() + ")참여에 거절당했습니다.", "meet");

            return userId + "유저 " + meetId + "모임 신청 거절";
        }
    }

    public void updateParticipants(Long meetId) {
        Meet meet = getMeet(meetId);

        meet.setNowParticipants(meet.getNowParticipants() + 1);

        meetRepository.save(meet);
    }

    public void checkMeetStatus() {
        List<Meet> meetByMeetDateBefore = meetRepository.findMeetByMeetDateBefore();
        List<Meet> updateMeetList = new ArrayList<>();
        for (Meet meet : meetByMeetDateBefore) {
            if (meet.getMeetStatus() != MeetStatus.END) {
                List<MeetUser> findUsers = meetUserRepository.findByMeetMeetIdOrderByStatusDesc(meet.getMeetId()).orElseThrow(
                        () -> new IllegalArgumentException("모임에 해당하는 유저를 찾을 수 없습니다.")
                );
                findUsers.forEach(users ->
                        pushService.send(meet.getHost(),
                                users.getUser(),
                                PushType.MEETEVALUATION,
                                "모임(" + meet.getMeetName() + ")이 종료 되었습니다. 평가를 진행해 주세요.", neighbrewUrl + "/rating/" + meet.getMeetId()));
            }
            meet.setMeetStatus(MeetStatus.END);

            updateMeetList.add(meet);
        }

        if (!updateMeetList.isEmpty()) meetRepository.saveAll(updateMeetList);
    }
}
