package com.yladraoui.book.user;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateProfileRequest {

    @NotNull(message = "Firstname is mandatory")
    @NotEmpty(message = "Firstname is mandatory")
    private String firstname;

    @NotNull(message = "Lastname is mandatory")
    @NotEmpty(message = "Lastname is mandatory")
    private String lastname;

    private LocalDate dateOfBirth;
}
