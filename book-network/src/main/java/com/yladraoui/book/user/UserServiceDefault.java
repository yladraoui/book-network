package com.yladraoui.book.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceDefault implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    //Retrieves the logged-in user's profile information
    public UserProfileResponse getProfile(Authentication connectedUser){
        User user = (User) connectedUser.getPrincipal();
        return userMapper.toUserProfileResponse(user);
    }

    //Update user Profile's information (firstname, lastname, date of birth)
    public UserProfileResponse UpdateProfile(UpdateProfileRequest request, Authentication connectedUser){
        User user = (User) connectedUser.getPrincipal();
        if(user != null){
            user.setFirstname(request.getFirstname());
            user.setLastname((request.getLastname()));
            user.setDateOfBirth((request.getDateOfBirth()));
            userRepository.save(user);
        }
        return userMapper.toUserProfileResponse(user);
    }

    //Change user's password
    public void changePassword(ChangePasswordRequest request, Authentication connectedUser){
        User user = (User) connectedUser.getPrincipal();
        if(user != null){

            //Verify if the current password is correct
            if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())){
                throw new IllegalStateException("Wrong password!");
            }

            //Verify the coherence between the new password and it's confirmation
            if(!request.getNewPassword().equals(request.getConfirmationPassword())){
                throw new IllegalStateException("New password and it's confirmation are not the same!");
            }

            //Verify if the new password is the same as the current password
            if(passwordEncoder.matches(request.getNewPassword(), user.getPassword())){
                throw new IllegalStateException("You can not use the current password as the new one!");
            }

            //update the user password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

        }
    }

}
