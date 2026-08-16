package com.yladraoui.book;

import com.yladraoui.book.role.Role;
import com.yladraoui.book.role.RoleRepository;
import com.yladraoui.book.user.User;
import com.yladraoui.book.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.boot.SpringApplication.run;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
public class BookNetworkApplication {

    public static void main(String[] args) {
        run(BookNetworkApplication.class, args);
    }

    @Bean
    public CommandLineRunner runner(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            Role userRole = roleRepository.findByName("USER")
                    .orElseGet(() -> roleRepository.save(
                            Role.builder().name("USER").build()
                    ));


            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(
                            Role.builder().name("ADMIN").build()
                    ));


            if (userRepository.findByEmail("user@booknetwork.com").isEmpty()) {
                User defaultUser = User.builder()
                        .firstname("John")
                        .lastname("Doe")
                        .email("user@booknetwork.com")
                        .password(passwordEncoder.encode("Password123!"))
                        .dateOfBirth(LocalDate.of(1995, 5, 15))
                        .accountLocked(false)
                        .enabled(true)
                        .roles(List.of(userRole))
                        .build();

                userRepository.save(defaultUser);
                System.out.println("Default User created: user@booknetwork.com / Password123!");
            }


            if (userRepository.findByEmail("admin@booknetwork.com").isEmpty()) {
                User adminUser = User.builder()
                        .firstname("Admin")
                        .lastname("System")
                        .email("admin@booknetwork.com")
                        .password(passwordEncoder.encode("Admin123!"))
                        .dateOfBirth(LocalDate.of(1990, 1, 1))
                        .accountLocked(false)
                        .enabled(true)
                        .roles(List.of(adminRole))
                        .build();

                userRepository.save(adminUser);
                System.out.println("Default Admin created: admin@booknetwork.com / Admin123!");
            }
        };
    }
}