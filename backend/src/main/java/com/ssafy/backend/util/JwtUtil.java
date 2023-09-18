package com.ssafy.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import java.security.Key;
import java.util.Date;

@Slf4j
public class JwtUtil {

    private static final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String generateToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 60L * 1000 * 60 * 24)) // 1 hour
                .signWith(secretKey)
                .compact();
    }

    public static String generateRefreshToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) //1day
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // 7 days
                .signWith(secretKey)
                .compact();
    }

    // 검증로직을 실행하는 메서드
    public static Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    public static Long parseUserIdFromToken(String token) {
        StringBuilder sb = new StringBuilder(token);
        sb.delete(0, 7);
        Claims claims = getClaims(sb.toString());
        return Long.parseLong(claims.getSubject());
    }

    public static void validateToken(String token, Long userId) {
        Long subject = parseUserIdFromToken(token);
        if (!subject.equals(userId)) {
            throw new RuntimeException("토큰 정보가 유효하지 않습니다.");
        }
    }
}
