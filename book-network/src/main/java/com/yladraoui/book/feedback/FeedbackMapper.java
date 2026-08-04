package com.yladraoui.book.feedback;


import com.yladraoui.book.book.Book;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class FeedbackMapper {
    public Feedback toFeedback(@Valid FeedbackRequest request) {
        return Feedback.builder()
                .score(request.score())
                .comment(request.comment())
                .book(
                        Book.builder()
                                .id(request.bookId())
                                .build()
                )
                .build();
    }

    public FeedbackResponse toFeedbackResponse(Feedback feedback, Long id) {

        return FeedbackResponse.builder()
                .score(feedback.getScore())
                .comment(feedback.getComment())
                .ownFeedback(Objects.equals(feedback.getCreatedBy(),id))
                .build();
    }
}
