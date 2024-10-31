// user-service/src/main/java/com/fintech/userservice/filter/JwtAuthenticationFilter.java
package com.fintech.userservice.filter;

import com.fintech.userservice.service.UserDetailsServiceImpl;
import com.fintech.userservice.util.JwtUtil;
import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationFilter extends GenericFilter {

  @Autowired private JwtUtil jwtUtil;

  @Autowired private UserDetailsServiceImpl userDetailsService;

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    String token = getJWTFromRequest((HttpServletRequest) request);

    if (token != null && jwtUtil.getUserIdFromToken(token) != null) {
      Long userId = jwtUtil.getUserIdFromToken(token);
      UserDetails userDetails = userDetailsService.loadUserById(userId);

      if (jwtUtil.getUserIdFromToken(token).equals(userId)) {
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(
            new WebAuthenticationDetailsSource().buildDetails((HttpServletRequest) request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
      }
    }

    chain.doFilter(request, response);
  }

  private String getJWTFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }
}
