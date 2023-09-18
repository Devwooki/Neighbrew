package com.ssafy.backend.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Repository
public class EmitterRepositoryImpl implements EmitterRepository {
    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    //클라이언트 연결을 잃어도 이벤트 유실을 방지하기 위해 임시 저장
    private final ConcurrentHashMap<String, Object> eventCache = new ConcurrentHashMap<>();

    //Emitter 저장
    @Override
    public SseEmitter save(String sseEmitterId, SseEmitter sseEmitter) {
        emitters.put(sseEmitterId, sseEmitter);

        return sseEmitter;
    }

    //Event 저장
    @Override
    public void saveEventCache(String eventCacheId, Object event) {
        eventCache.put(eventCacheId, event);
    }

    //회원과 관련된 Emitter를 모두 찾음
    @Override
    public Map<String, SseEmitter> findAllEmitterStartWithByUserId(String userId) {
        return emitters.entrySet().stream()
                //sseEmitte의 key들은 userId_currentTime 형태여서 suffix가 userId인것만 찾게 한다.
                .filter(entry -> entry.getKey().split("_")[0].equals(userId))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    //회원과 관련된 Event 모두 찾음
    @Override
    public Map<String, Object> findAllEventCacheStartWithByUserId(String userId) {
        return eventCache.entrySet().stream()
                //sseEmitte의 key들은 userId_currentTime 형태여서 suffix가 userId인것만 찾게 한다.
                .filter(entry -> entry.getKey().split("_")[0].equals(userId))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    //주어진 ID 와 Emitter를 제거
    @Override
    public void deleteById(String sseEmitterId) {
        emitters.remove(sseEmitterId);
    }

    //회원과 관련된 모든 Emitter 제거
    @Override
    public void deleteAllEmitterStartWithId(String userId) {
        emitters.forEach(
                (key, emitter) -> {
                    if (key.split("_")[0].equals((userId))) {
                        emitters.remove(key);
                    }
                }
        );

    }

    //회원과 관련된 모든 이벤트 제거
    @Override
    public void deleteAllEventCacheStartWithId(String userId) {
        eventCache.forEach(
                (key, emitter) -> {
                    if (key.split("_")[0].equals(userId)) {
                        eventCache.remove(key);
                    }
                }
        );
    }
}