package com.yladraoui.book.user;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private LocalDate dateOfBirth;
}
