package com.ssafy.backend.config;

import com.ssafy.backend.filter.TokenFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    @Bean
    public FilterRegistrationBean<TokenFilter> tokenFilterRegistrationBean() {
        FilterRegistrationBean<TokenFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(new TokenFilter());
        registrationBean.addUrlPatterns("/api/*"); // 필터가 적용될 URL 패턴을 설정합니다. 필요에 따라 변경할 수 있습니다.

        return registrationBean;
    }
}
