package com.yladraoui.book.user;


import org.springframework.security.core.Authentication;

public interface UserService {
    public UserProfileResponse getProfile(Authentication connectedUser);
    public UserProfileResponse UpdateProfile(UpdateProfileRequest request, Authentication connectedUser);
    public void changePassword(ChangePasswordRequest request, Authentication connectedUser);
}
