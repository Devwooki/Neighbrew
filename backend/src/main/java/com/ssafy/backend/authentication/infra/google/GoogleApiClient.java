package com.ssafy.backend.authentication.infra.google;

import com.ssafy.backend.authentication.domain.oauth.OAuthApiClient;
import com.ssafy.backend.authentication.domain.oauth.OAuthInfoResponse;
import com.ssafy.backend.authentication.domain.oauth.OAuthLoginParams;
import com.ssafy.backend.authentication.domain.oauth.OAuthProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class GoogleApiClient implements OAuthApiClient {
    @Qualifier("restTemplate")
    private final RestTemplate restTemplate;
    @Value("${oauth.google.url.auth}")
    private String authUrl;
    @Value("${oauth.google.url.api}")
    private String apiUrl;
    @Value("${oauth.google.client-id}")
    private String clientId;
    @Value("${oauth.google.client_secret}")
    private String clientSecret;
    @Value("${oauth.google.url.redirect}")
    private String redirectUri;

    @Override
    public OAuthProvider oAuthProvider() {
        return OAuthProvider.GOOGLE;
    }

    @Override
    public String requestAccessToken(OAuthLoginParams params) {
        String url = apiUrl;
        String code = params.code();
        String decodedData;
        decodedData = URLDecoder.decode(code, StandardCharsets.UTF_8);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();

        body.add("code", decodedData);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("grant_type", "authorization_code");
        System.out.println("body.toString() = " + body);

        HttpEntity<?> request = new HttpEntity<>(body, httpHeaders);

        GoogleTokens response = restTemplate.postForObject(url, request, GoogleTokens.class);

        assert response != null;

        return response.getAccessToken();
    }

    @Override
    public OAuthInfoResponse requestOauthInfo(String accessToken) {
        System.out.println("requestOauthInfo");
        String url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + accessToken;

        HttpHeaders headers = new HttpHeaders();

        HttpEntity request = new HttpEntity(headers);

        ResponseEntity<GoogleInfoResponse.Response> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                GoogleInfoResponse.Response.class
        );
        GoogleInfoResponse.Response responseBody = response.getBody();
        if (responseBody != null) {
            return new GoogleInfoResponse(responseBody);
        }

        return null;
    }

    @Override
    public String authApiUrl(OAuthLoginParams params) {
        String responseType = "code";
        return authUrl + "?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=" + responseType + "&scope=email profile";
    }
}
