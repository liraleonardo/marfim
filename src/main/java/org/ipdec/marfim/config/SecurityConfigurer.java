package org.ipdec.marfim.config;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.ipdec.marfim.api.service.AuthorizationUtilService;
import org.ipdec.marfim.security.MarfimUserDetailsService;
import org.ipdec.marfim.security.auth.*;
import org.ipdec.marfim.security.auth.marfim.MarfimJWTToken;
import org.ipdec.marfim.security.tenant.TenantFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfigurer extends WebSecurityConfigurerAdapter {

    private	final MarfimUserDetailsService userDetailsService;
    private	final AuthenticationExceptionEntryPoint exceptionEntryPoint;
    private	final MarfimJWTToken marfimJWTToken;
    private final AuthorizationUtilService authorizationUtilService;

    @Autowired
    SecurityConfigurer(AuthenticationExceptionEntryPoint exceptionEntryPoint,
                       MarfimUserDetailsService userDetailsService,
                       AuthenticationManagerBuilder builder,
                       MarfimJWTToken marfimJWTToken,
                       ObjectMapper mapper, AuthorizationUtilService authorizationUtilService) throws Exception {

        this.userDetailsService = userDetailsService;
        this.exceptionEntryPoint = exceptionEntryPoint;
        this.marfimJWTToken = marfimJWTToken;
        this.authorizationUtilService = authorizationUtilService;
        builder.userDetailsService(this.userDetailsService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().authorizeRequests()
                .antMatchers(HttpMethod.GET, "/").permitAll()
                .antMatchers(HttpMethod.GET, "/actuator/**").permitAll()
                .antMatchers(HttpMethod.POST, "/login/**").permitAll()
                .antMatchers(HttpMethod.POST, "/user/register").permitAll()
                .anyRequest().fullyAuthenticated()
                .and().addFilterBefore(new TenantFilter(), BearerTokenAuthenticationFilter.class)
                .userDetailsService(this.userDetailsService)
                .oauth2ResourceServer().authenticationEntryPoint(exceptionEntryPoint)
// TODO                .authenticationManagerResolver(new JwtIssuerAuthenticationManagerResolver("teste"))
                .jwt()
                .jwtAuthenticationConverter(new MarfimJwtAuthenticationConverter(authorizationUtilService))
                .decoder(new MarfimJwtDecoder(marfimJWTToken));

    }


}



