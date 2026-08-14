package com.yladraoui.book.user;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChangePasswordRequest {

    @NotNull(message = "Current password is mandatory")
    @NotEmpty(message = "Current password is mandatory")
    private String currentPassword;

    @NotNull(message = "New password is mandatory")
    @NotEmpty(message = "New password is mandatory")
    @Size(min = 8, message = "Password should be 8 characters minimum")
    private String newPassword;

    @NotNull(message = "Confirmation password is mandatory")
    @NotEmpty(message = "Confirmation password is mandatory")
    private String confirmationPassword;
}
