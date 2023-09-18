package com.ssafy.backend.filter;

import com.ssafy.backend.util.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class TokenFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        // /api/auth에 대한 요청이 들어온 경우 필터를 건너뛰고 다음 필터나 요청 핸들러로 진행합니다.
        if (request.getRequestURI().startsWith("/api/auth")) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 형식이 잘못됐습니다");
            return;
        }

        String token = header.substring(7);
        Claims claims;
        try {
            claims = JwtUtil.getClaims(token);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "잘못된 토큰입니다");
            return;
        }

        String tokenUserId = claims.getSubject();

        request.setAttribute("userId", tokenUserId);
        filterChain.doFilter(request, response);
    }
}
