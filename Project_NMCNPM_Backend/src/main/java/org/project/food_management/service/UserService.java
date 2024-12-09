package org.project.food_management.service;

import org.project.food_management.model.User;

public interface UserService {
    public User findUserByJwtToken(String jwt);
    public User findUserByEmail(String email) throws Exception;
    public User findUserByUserId(Long id) throws Exception;
}
