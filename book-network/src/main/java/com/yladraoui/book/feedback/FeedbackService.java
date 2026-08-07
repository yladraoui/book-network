package com.yladraoui.book.feedback;

import com.yladraoui.book.common.PageResponse;
import org.springframework.security.core.Authentication;


public interface FeedbackService {
    public Long save(FeedbackRequest request, Authentication connectedUser);
    public PageResponse<FeedbackResponse> findAllFeedbacksByBook(Long bookId, int page, int size, Authentication connectedUser);
}
