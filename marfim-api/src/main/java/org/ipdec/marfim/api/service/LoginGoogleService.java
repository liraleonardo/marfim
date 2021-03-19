package org.ipdec.marfim.api.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.ipdec.marfim.api.dto.AuthDTO;
import org.ipdec.marfim.api.model.User;
import org.ipdec.marfim.api.repository.UserRepository;
import org.ipdec.marfim.security.MarfimUserDetails;
import org.ipdec.marfim.security.MarfimUserDetailsService;
import org.ipdec.marfim.security.auth.google.GoogleJWTToken;
import org.ipdec.marfim.security.auth.marfim.MarfimJWTToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LoginGoogleService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    MarfimUserDetailsService userDetailsService;


    @Autowired
    GoogleJWTToken googleJWTToken;

    @Autowired
    MarfimJWTToken marfimJWTToken;

    public AuthDTO login(String token) {
        GoogleIdToken.Payload tokenPayload = googleJWTToken.getTokenPayload(token);

        if(tokenPayload == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Could not parse the token.");
        }

        boolean isValidToken = googleJWTToken.validateToken(token);
        if(!isValidToken){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,String.format("Invalid Google Token: %s",googleJWTToken.getProblem()));
        }
        MarfimUserDetails userDetails;
        try {
            userDetails = (MarfimUserDetails) userDetailsService.loadUserByUsername(tokenPayload.getEmail());
            // update user avatar (from google) if different or non existing
            String avatar = tokenPayload.get("picture").toString();
            User user = userDetails.getUser();
            if(user.getAvatarUrl()==null || !user.getAvatarUrl().equalsIgnoreCase(avatar)){
                user.setAvatarUrl(avatar);

                user = userRepository.save(user);
                userDetails.setUser(user);
            }
        }catch (UsernameNotFoundException exception){
            // creates and save a user when not found
            User user = new User();
            user.setEmail(tokenPayload.getEmail());
            user.setName(tokenPayload.get("name").toString());
            user.setPassword(null);
            user.setAvatarUrl(tokenPayload.get("picture").toString());

            user = userRepository.save(user);
            userDetails = new MarfimUserDetails(user);
        }

        return new AuthDTO(marfimJWTToken.generateToken(userDetails), userDetails);
    }

}
