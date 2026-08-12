package com.yladraoui.book.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.*;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName emailTemplate,
            String confirmationUrl,
            String activationCode,
            String subject
    ) throws MessagingException {
        String templateName;
        if(emailTemplate == null){
            templateName = "confirm-email";

        }else{
            templateName = emailTemplate.name();
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );
        Map<String, Object> properties = new HashMap<>();
        properties.put("username",username);
        properties.put("confirmationUrl",confirmationUrl);
        properties.put("activation_code",activationCode);

        Context context = new Context();
        context.setVariables(properties);
        helper.setFrom("yladraouii@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        String template = templateEngine.process(templateName, context);

        helper.setText(template, true);
        mailSender.send(mimeMessage);
    }


    /**
     * Sends an email notification to the book owner when a borrow request is created.
     */
    @Async
    public void sendBorrowRequestEmail(
            String ownerEmail,
            String ownerName,
            String borrowerName,
            String borrowerEmail,
            String bookTitle,
            String isbn
    ) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );

        Map<String, Object> properties = new HashMap<>();
        properties.put("ownerName", ownerName);
        properties.put("borrowerName", borrowerName);
        properties.put("borrowerEmail", borrowerEmail);
        properties.put("bookTitle", bookTitle);
        properties.put("isbn", isbn);

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("yladraouii@gmail.com");
        helper.setTo(ownerEmail);
        helper.setReplyTo(borrowerEmail); // Allows the owner to reply directly to the borrower
        helper.setSubject("New Borrow Request for: " + bookTitle);

        String template = templateEngine.process("borrow_request", context);

        helper.setText(template, true);
        mailSender.send(mimeMessage);
    }
}
