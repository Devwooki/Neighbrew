package com.ssafy.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/pub"); // 메시지 브로커를 "/pub"으로 구성
        registry.setApplicationDestinationPrefixes("/sub"); // 메시지의 목적지가 "/sub"으로 시작하는 경우 메시지 핸들러로 라우팅
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*"); // "/ws"로 연결되는 endpoint를 구성
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS(); // "/ws"로 연결되는 endpoint를 구성
    }
}
