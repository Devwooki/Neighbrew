package com.ssafy.backend.authentication.infra.naver;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.backend.authentication.domain.oauth.OAuthInfoResponse;
import com.ssafy.backend.authentication.domain.oauth.OAuthProvider;
import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class NaverInfoResponse implements OAuthInfoResponse {

    @JsonProperty("response")
    private Response response;

    @Override
    public String getEmail() {
        return response.email;
    }

    @Override
    public String getNickname() {
        return response.email;
    }

    @Override
    public String getName() {
        return response.nickname;
    }

    @Override
    public OAuthProvider getOAuthProvider() {
        return OAuthProvider.NAVER;
    }

    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class Response {
        private final String email;
        private final String nickname;
        private final String name;

        @JsonCreator
        Response(String email, String nickname, String name) {
            this.email = email;
            this.nickname = nickname;
            this.name = name;
        }
    }
}
