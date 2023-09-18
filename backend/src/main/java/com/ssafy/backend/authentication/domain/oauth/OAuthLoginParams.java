package com.ssafy.backend.authentication.domain.oauth;

import org.springframework.util.MultiValueMap;
//필요한 데이터를 갖고 있는 파라미터

public interface OAuthLoginParams {
    OAuthProvider oAuthProvider();

    MultiValueMap<String, String> makeBody();

    String code();
}
