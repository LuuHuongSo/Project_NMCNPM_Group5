package org.project.food_management.controller;

import org.project.food_management.config.JwtProvider;
import org.project.food_management.model.USER_ROLE;
import org.project.food_management.model.User;
import org.project.food_management.repository.UserRepository;
import org.project.food_management.request.LoginRequest;
import org.project.food_management.request.SignUpRequest;
import org.project.food_management.response.ResponseMassage;
import org.project.food_management.response.UserResponse;
import org.project.food_management.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {

    private UserRepository userRepository;
    private UserDetailsService userDetailsService;
    private UserService userService;
    private JwtProvider jwtProvider;
    private PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, UserDetailsService userDetailsService, UserService userService, JwtProvider jwtProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
        this.jwtProvider = jwtProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signUp(
            @RequestBody SignUpRequest req
    ) throws Exception {
        User testUser = userRepository.findUserByEmail(req.getEmail());
        if(testUser != null) throw new Exception("Da ton tai email, vui long thu email khac!");
        User user = new User();
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole());
        user.setCreated_at(LocalDateTime.now());


        User savedUser = userRepository.save(user);

        List<GrantedAuthority> authorities = new ArrayList<>();
        USER_ROLE role = savedUser.getRole();
        authorities.add(new SimpleGrantedAuthority(role.toString()));
        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword(), authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserResponse userResponse = new UserResponse();
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setJwt(jwtProvider.generateJwtToken(authentication));
        userResponse.setMessage("Sign up successfully!");
        userResponse.setRole(savedUser.getRole().toString());

        return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
    }


    @PostMapping("/login")
    public ResponseEntity<UserResponse> logIn(
            @RequestBody LoginRequest req
    )throws Exception{
        UserDetails user = userDetailsService.loadUserByUsername(req.getEmail());
        UserResponse userResponse = new UserResponse();

        userResponse.setEmail(req.getEmail());

        if(passwordEncoder.matches(req.getPassword(), user.getPassword())){
            userResponse.setMessage("Login Successfully!");
            List<GrantedAuthority> authorities = new ArrayList<>();
            Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword(), user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            userResponse.setJwt(jwtProvider.generateJwtToken(authentication));
            userResponse.setRole(user.getAuthorities().toString());
        }else{
            userResponse.setMessage("Login Fail!");
        }

        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

}
