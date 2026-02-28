package com.medicine.inventory.service;

import com.medicine.inventory.dto.user.UserRequest;
import com.medicine.inventory.dto.user.UserResponse;
import com.medicine.inventory.entity.User;
import com.medicine.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .toList();
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user = userRepository.save(user);
        return new UserResponse(user);
    }
}
