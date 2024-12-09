package org.project.food_management.controller;

import org.project.food_management.config.JwtProvider;
import org.project.food_management.model.User;
import org.project.food_management.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class HomeController {

    private JwtProvider jwtProvider;
    private UserService userService;

    public HomeController(JwtProvider jwtProvider, UserService userService) {
        this.jwtProvider = jwtProvider;
        this.userService = userService;
    }

    @GetMapping("/home")
    public ResponseEntity<User> home(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        String email = jwtProvider.getEmailFromJwt(jwt);
        User user = userService.findUserByEmail(email);

        return new ResponseEntity<>(user, HttpStatus.OK);

    }
}
