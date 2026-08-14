package com.yladraoui.book.user;

import org.springframework.stereotype.Service;

@Service
public class UserMapper {

    public UserProfileResponse toUserProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }
}
