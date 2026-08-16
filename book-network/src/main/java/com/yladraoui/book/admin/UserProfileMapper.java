package com.yladraoui.book.admin;

import com.yladraoui.book.user.User;
import org.springframework.stereotype.Service;

@Service
public class UserProfileMapper {
    public UserProfile toUserProfile(User u) {
        return UserProfile.builder()
                .id(u.getId())
                .firstname(u.getFirstname())
                .lastname(u.getLastname())
                .email(u.getEmail())
                .accountLocked(u.isAccountLocked())
                .build();
    }
}
