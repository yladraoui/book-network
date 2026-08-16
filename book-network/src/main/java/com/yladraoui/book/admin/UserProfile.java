package com.yladraoui.book.admin;

import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfile {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private boolean accountLocked;
}
