package com.ssafy.backend.authentication.domain.oauth;

import java.io.UnsupportedEncodingException;

public interface OAuthApiClient {
    // API 요청 후 응답 값 리턴 인터페이스
    OAuthProvider oAuthProvider();

    // Authorization Code 를 기반으로 인증 API 를 요청해서 Access Token 을 획득
    String requestAccessToken(OAuthLoginParams params) throws UnsupportedEncodingException;

    //Access Token 을 기반으로 Email, Nickname 이 포함된 프로필 정보를 획득
    OAuthInfoResponse requestOauthInfo(String accessToken);

    String authApiUrl(OAuthLoginParams params);
}
