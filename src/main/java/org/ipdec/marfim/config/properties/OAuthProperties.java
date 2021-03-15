package org.ipdec.marfim.config.properties;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class OAuthProperties {
    @Value("${oauth.clientId}")
    private String clientId;
    @Value("${oauth.clientSecret}")
    private String clientSecret;

    @Value("${oauth.userInfoUrl}")
    private String userInfoUrl;

    @Value("${oauth.appName}")
    private String appName;

    @Value("${oauth.appSecret}")
    private String appSecret;
}
