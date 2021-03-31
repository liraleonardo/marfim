package org.ipdec.marfim.api.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.ipdec.marfim.api.dto.AuthDTO;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.ipdec.marfim.security.auth.google.GoogleJWTToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class LoginGoogleService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    GoogleJWTToken googleJWTToken;


    @Autowired
    AuthenticationUtilService authenticationUtilService;

    public AuthDTO login(String token) {
        GoogleIdToken.Payload tokenPayload = googleJWTToken.getTokenPayload(token);

        if(tokenPayload == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Could not parse the token.");
        }

        boolean isValidToken = googleJWTToken.validateToken(token);
        if(!isValidToken){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,String.format("Invalid Google Token: %s",googleJWTToken.getProblem()));
        }
        User user;
        Optional<User> optionalUser = userRepository.findByEmail(tokenPayload.getEmail());
        if(optionalUser.isPresent()){
            user = optionalUser.get();
            String avatar = tokenPayload.get("picture").toString();

            if(user.getAvatarUrl()==null || !user.getAvatarUrl().equalsIgnoreCase(avatar)){
                user.setAvatarUrl(avatar);
                user = userRepository.save(user);
            }
        }
        else {
            user = new User();
            user.setEmail(tokenPayload.getEmail());
            user.setName(tokenPayload.get("name").toString());
            user.setPassword(null);
            user.setAvatarUrl(tokenPayload.get("picture").toString());

            user = userRepository.save(user);
        }

        return authenticationUtilService.createAuthDTO(user);
    }

}
