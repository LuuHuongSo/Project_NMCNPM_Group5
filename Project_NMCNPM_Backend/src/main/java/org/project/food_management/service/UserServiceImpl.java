package org.project.food_management.service;

import org.project.food_management.model.User;
import org.project.food_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{


    private UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User findUserByJwtToken(String jwt) {
        return null;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findUserByEmail(email);
        if(user == null){
            throw new Exception("User not found with email: " + email);
        }
        return user;
    }

    @Override
    public User findUserByUserId(Long id) throws Exception {
        Optional<User> optionalUser = userRepository.findById(id);
        if(optionalUser.isEmpty()){
            throw new Exception("user not found with id: "+ id);
        }
        return optionalUser.get();
    }

}
