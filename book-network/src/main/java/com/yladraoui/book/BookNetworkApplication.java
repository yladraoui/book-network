package com.yladraoui.book;


import com.yladraoui.book.role.Role;
import com.yladraoui.book.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

import static org.springframework.boot.SpringApplication.run;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
public class BookNetworkApplication {

	public static void main(String[] args) {
		run(BookNetworkApplication.class, args);
	}
    @Bean
    public CommandLineRunner runner(RoleRepository roleRepository) {
        return args -> {
          if (roleRepository.findByName("USER").isEmpty()) {
              roleRepository.save(
                      Role.builder().name("USER").build()
              );
          }
        };
    }
}
