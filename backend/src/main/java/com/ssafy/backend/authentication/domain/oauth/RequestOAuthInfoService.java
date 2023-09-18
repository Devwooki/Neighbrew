package com.ssafy.backend.authentication.domain.oauth;

import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class RequestOAuthInfoService {
    //외부 API 요청의 중복 로직을 공통화
    private final Map<OAuthProvider, OAuthApiClient> clients;

    public RequestOAuthInfoService(List<OAuthApiClient> clients) {
        // this.clients   현재 클래스의 인스턴스를 의미
        // client.stream()   : cilents를 스트림으로 반환한다.
        // Stream : 데이터를 처리하는데 유용한 기능들을 제공하는 컬렉션의 개념
        // collect : 스트림에서 요소들을 수집하는 메서드
        // toMap() : OAuthApiClient객체들을 map 형식으로 받아온다
        // OAuthApiClient::oAuthProvider : OAuthApiClient 클래스의 oAuthProvider 필드 값을 키로 사용
        //Function.identity() : 이 함수는 입력값을 그대로 반환하는 함수입니다. 여기서는 OAuthApiClient 객체 그 자체를 의미합니다. 즉, OAuthApiClient 객체를 값으로 사용합니다.
        //Key: "KAKAO", Value: OAuthApiClient("KAKAO")
        this.clients = clients.stream().collect(
                Collectors.toMap(OAuthApiClient::oAuthProvider, Function.identity())
        );
    }

    public OAuthInfoResponse request(OAuthLoginParams params) throws UnsupportedEncodingException {
        // 어떤 클라이언트인지 확인
        OAuthApiClient client = clients.get(params.oAuthProvider());

        //여기서 accessToken은 kakao, naver로부터 받아온 token
        String accessToken = client.requestAccessToken(params);

        return client.requestOauthInfo(accessToken);
    }

    public String authApiUrl(OAuthLoginParams params) {
        OAuthApiClient client = clients.get(params.oAuthProvider());
        return client.authApiUrl(params);
    }
}
