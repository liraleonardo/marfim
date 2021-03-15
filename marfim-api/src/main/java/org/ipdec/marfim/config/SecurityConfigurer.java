package org.ipdec.marfim.config;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.ipdec.marfim.security.MyUserDetailsService;
import org.ipdec.marfim.security.auth.*;
import org.ipdec.marfim.security.auth.marfim.MarfimJWTToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;


@Configuration
@EnableWebSecurity
public class SecurityConfigurer extends WebSecurityConfigurerAdapter {

    private	final MyUserDetailsService userDetailsService;
    private	final AuthenticationExceptionEntryPoint exceptionEntryPoint;
    private	final MarfimJWTToken marfimJWTToken;

    @Autowired
    SecurityConfigurer(AuthenticationExceptionEntryPoint exceptionEntryPoint,
                       MyUserDetailsService userDetailsService,
                       AuthenticationManagerBuilder builder,
                       MarfimJWTToken marfimJWTToken,
                       ObjectMapper mapper) throws Exception {

        this.userDetailsService = userDetailsService;
        this.exceptionEntryPoint = exceptionEntryPoint;
        this.marfimJWTToken = marfimJWTToken;
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
                .and()
                .userDetailsService(this.userDetailsService)
                .oauth2ResourceServer().authenticationEntryPoint(exceptionEntryPoint)
// TODO                .authenticationManagerResolver(new JwtIssuerAuthenticationManagerResolver("teste"))
                .bearerTokenResolver(new MarfimBearerTokenResolver())
                .jwt()
                .jwtAuthenticationConverter(new MarfimJwtAuthenticationConverter())
                .decoder(new MarfimJwtDecoder(marfimJWTToken));

    }


}



