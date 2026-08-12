package com.yladraoui.book.book;

import com.yladraoui.book.common.PageResponse;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author $ {USER}
 **/
public interface BookService {
    public Long save(BookRequest request, Authentication connectedUser);
    public BookResponse findById(Long bookId);
    public PageResponse<BookResponse> findAllBooks(int page, int size, Authentication connectedUser);
    public PageResponse<BookResponse> findAllBooksByOwner(int page, int size, Authentication connectedUser);
    public PageResponse<BorrowedBookResponse> findAllBorrowedBooks(int page, int size, Authentication connectedUser);
    public PageResponse<BorrowedBookResponse> findAllReturnedBooks(int page, int size, Authentication connectedUser);
    public Long updateShareableStatus(Long bookId, Authentication connectedUser);
    public Long updateArchivedStatus(Long bookId, Authentication connectedUser);
    public Long borrowBook(Long bookId, Authentication connectedUser);
    public Long returnBorrowedBook(Long bookId, Authentication connectedUser);
    public Long approveReturnBorrowedBook(Long bookId, Authentication connectedUser);
    public void uploadCoverPicture(MultipartFile file, Authentication connectedUser, Long bookId);
    public Long requestBorrowBook(Long bookId, Authentication connectedUser);
    public Long approveBorrowRequest(Long historyId, Authentication connectedUser);
    public PageResponse<BorrowedBookResponse> findAllBorrowRequests(int page, int size, Authentication connectedUser);
}
