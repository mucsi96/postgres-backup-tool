package io.github.mucsi96.postgresbackuptool;

import java.io.IOException;

import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class BasePathProviderFilter implements Filter {
  @Override
  public void doFilter(ServletRequest request, ServletResponse response,
      FilterChain chain) throws IOException, ServletException {
    HttpServletRequest httpServletRequest = (HttpServletRequest) request;
    HttpServletResponse httpServletResponse = (HttpServletResponse) response;
    Cookie cookie = new Cookie("base-path",
        httpServletRequest.getContextPath());
    cookie.setMaxAge(1);
    cookie.setPath(httpServletRequest.getContextPath());
    httpServletResponse.addCookie(cookie);
    chain.doFilter(request, response);
  }

}
