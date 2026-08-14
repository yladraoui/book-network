package com.yladraoui.book.user;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
@Tag(name = "User")
public class UserController {
    private final UserService service;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication connectedUser){
        return ResponseEntity.ok(service.getProfile(connectedUser));
    }
    @PatchMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody @Valid UpdateProfileRequest request,
            Authentication connectedUser
    ){
        return ResponseEntity.ok(service.UpdateProfile(request, connectedUser));
    }

    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody @Valid ChangePasswordRequest request,
            Authentication connectedUser
    ){
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }
}
