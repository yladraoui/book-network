package com.yladraoui.book;


import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import static org.springframework.boot.SpringApplication.run;

@SpringBootApplication
@EnableJpaAuditing
public class BookNetworkApplication {

	public static void main(String[] args) {
		run(BookNetworkApplication.class, args);
	}

}
