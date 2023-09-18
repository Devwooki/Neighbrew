package com.ssafy.backend.authentication.domain.oauth;

public interface OAuthInfoResponse {
    // 회원 정보 API 응답
    String getEmail();

    String getNickname();

    String getName();

    OAuthProvider getOAuthProvider();
}
