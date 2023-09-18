package com.ssafy.backend.repository;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

/**
 * sseEmitter를 이용해 알림을 실제 보내게 되는데, 어떤 회원에게 어떤 emitter가 연결 되어 있는지 저장해야함
 * 어떤 이벤트들이 현재 발생했는지도 저장(추후 emitter 연결 끊길 경우 이어서 전송해줘야하기 때문)
 * => EnitterRepository인 이유
 */
public interface EmitterRepository {
    //Emitter 저장
    SseEmitter save(String sseEmitterId, SseEmitter sseEmitter);

    //Event 저장
    void saveEventCache(String sseEmitterId, Object event);

    //회원과 관련된 Emitter를 모두 찾음
    Map<String, SseEmitter> findAllEmitterStartWithByUserId(String userId);

    //회원과 관련되s Event 모두 찾음
    Map<String, Object> findAllEventCacheStartWithByUserId(String userId);

    //Emitter를 지움
    void deleteById(String emitterId);

    //회원과 관련된 모든 Emitter 제거
    void deleteAllEmitterStartWithId(String userId);

    //회원과 관련된 모든 이벤트 제거
    void deleteAllEventCacheStartWithId(String userId);

}
