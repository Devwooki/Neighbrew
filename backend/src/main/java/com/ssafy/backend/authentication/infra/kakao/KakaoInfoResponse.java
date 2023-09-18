package com.ssafy.backend.authentication.infra.kakao;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.backend.authentication.domain.oauth.OAuthInfoResponse;
import com.ssafy.backend.authentication.domain.oauth.OAuthProvider;
import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true) // 필요한 데이터만 가져옴
public class KakaoInfoResponse implements OAuthInfoResponse {
    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @Override
    public String getEmail() {
        return kakaoAccount.email;
    }

    @Override
    public String getNickname() {
        return kakaoAccount.email;
    }

    @Override
    public String getName() {
        return kakaoAccount.profile.nickname;
    }

    @Override
    public OAuthProvider getOAuthProvider() {
        return OAuthProvider.KAKAO;
    }

    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class KakaoAccount {
        private final KakaoProfile profile;
        private final String email;
        private final String name;

        @JsonCreator
        public KakaoAccount(
                @JsonProperty("profile") KakaoProfile profile,
                @JsonProperty("email") String email,
                @JsonProperty("name") String name
        ) {
            this.profile = profile;
            this.email = email;
            this.name = name;
        }
    }

    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class KakaoProfile {
        private final String nickname;

        @JsonCreator
        public KakaoProfile(@JsonProperty("nickname") String nickname) {
            this.nickname = nickname;
        }
    }
}
