package com.yladraoui.book.book;

import com.yladraoui.book.common.PageResponse;
import com.yladraoui.book.email.EmailService;
import com.yladraoui.book.exception.OperationNotPermittedException;
import com.yladraoui.book.file.FileStorageService;
import com.yladraoui.book.history.BookTransactionHistory;
import com.yladraoui.book.history.BookTransactionHistoryRepository;
import com.yladraoui.book.user.User;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookServiceDefault implements BookService{

    private final FileStorageService fileStorageService;
    private final BookRepository bookRepository;
    private final BookTransactionHistoryRepository bookTransactionHistoryRepository;
    private final BookMapper bookMapper;
    private final EmailService emailService;

    public @Nullable Long save(BookRequest request, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Book book = bookMapper.toBook(request);
        book.setOwner(user);
        return bookRepository.save(book).getId();
    }

    public BookResponse findById(Long bookId) {
        return bookRepository.findById(bookId)
                .map(bookMapper::toBookResponse)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID: " + bookId));
    }

    public PageResponse<BookResponse> findAllBooks(int page, int size, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAllDisplayableBooks(pageable, user.getId());
        List<BookResponse> bookResponse = books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
        return new PageResponse<>(
                bookResponse,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    public @Nullable PageResponse<BookResponse> findAllBooksByOwner(int page, int size, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAll(BookSpecification.withOwnerId(user.getId()), pageable);
        List<BookResponse> bookResponse = books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
        return new PageResponse<>(
                bookResponse,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    public @Nullable PageResponse<BorrowedBookResponse> findAllBorrowedBooks(int page, int size, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allBorrowedBooks = bookTransactionHistoryRepository.findAllBorrowedBooks(pageable,user.getId());
        List<BorrowedBookResponse> borrowedBookResponse = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();
        return new PageResponse<>(
                borrowedBookResponse,
                allBorrowedBooks.getSize(),
                allBorrowedBooks.getNumber(),
                allBorrowedBooks.getTotalElements(),
                allBorrowedBooks.getTotalPages(),
                allBorrowedBooks.isFirst(),
                allBorrowedBooks.isLast()
        );
    }

    public @Nullable PageResponse<BorrowedBookResponse> findAllReturnedBooks(int page, int size, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allBorrowedBooks = bookTransactionHistoryRepository.findAllReturnedBooks(pageable,user.getId());
        List<BorrowedBookResponse> borrowedBookResponse = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();
        return new PageResponse<>(
                borrowedBookResponse,
                allBorrowedBooks.getSize(),
                allBorrowedBooks.getNumber(),
                allBorrowedBooks.getTotalElements(),
                allBorrowedBooks.getTotalPages(),
                allBorrowedBooks.isFirst(),
                allBorrowedBooks.isLast()
        );
    }

    public @Nullable Long updateShareableStatus(Long bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID: " + bookId));
        User user = (User) connectedUser.getPrincipal();
        if (!Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You cannot update others books shareable status");
        }
        book.setShareable(!book.isShareable());
        bookRepository.save(book);
        return bookId;
    }

    public @Nullable Long updateArchivedStatus(Long bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID: " + bookId));
        User user = (User) connectedUser.getPrincipal();
        if (!Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You cannot update others books archived status");
        }
        book.setArchive(!book.isArchive());
        bookRepository.save(book);
        return bookId;
    }

    public @Nullable Long borrowBook(Long bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID: " + bookId));
        if (book.isArchive() || !book.isShareable()){
            throw new OperationNotPermittedException("The requested book cannot be borrowed since it is archived or not shareable");
        }

        User user = (User) connectedUser.getPrincipal();
        if (Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You cannot borrow your own books");
        }

        final boolean isAlreadyBorrowed = bookTransactionHistoryRepository.isAlreadyBorrowedByUser(bookId, user.getId());
        if (isAlreadyBorrowed){
            throw new OperationNotPermittedException("The requested book is already borrowed");
        }
        BookTransactionHistory bookTransactionHistory = BookTransactionHistory.builder()
                .user(user)
                .book(book)
                .returned(false)
                .returnApproved(false)
                .build();
        return bookTransactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    public @Nullable Long returnBorrowedBook(Long bookId, Authentication connectedUser) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID: " + bookId));


        User user = (User) connectedUser.getPrincipal();
        if (Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You cannot borrow or return your own books");
        }

        Optional<BookTransactionHistory> bookTransactionHistory = bookTransactionHistoryRepository.findByBookIdAndUserId(bookId, user.getId());
        if(bookTransactionHistory.isEmpty()){
            throw new OperationNotPermittedException("You did not borrow this book");
        }
        bookTransactionHistory.get().setReturned(true);
        return bookTransactionHistoryRepository.save(bookTransactionHistory.get()).getId();
    }

    public @Nullable Long approveReturnBorrowedBook(Long bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID: " + bookId));


        User user = (User) connectedUser.getPrincipal();
        if (!Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You are not the book owner, so you can not approve it's return. ");
        }

        Optional<BookTransactionHistory> bookTransactionHistory = bookTransactionHistoryRepository.findByBookIdAndOwnerId(bookId, user.getId());
        if(bookTransactionHistory.isEmpty()){
            throw new OperationNotPermittedException("The book is not returned yet. You cannot approve its return");
        }

        book.setShareable(true);
        bookRepository.save(book);

        bookTransactionHistory.get().setReturnApproved(true);
        return bookTransactionHistoryRepository.save(bookTransactionHistory.get()).getId();
    }

    public void uploadCoverPicture(MultipartFile file, Authentication connectedUser, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new EntityNotFoundException("No book found with the ID: " + bookId));
        User user = (User) connectedUser.getPrincipal();

        String bookCover = fileStorageService.saveFile(file, user.getId());
        book.setBookCover(bookCover);
        bookRepository.save(book);

    }

    //>>>>>>>>>>> Borrow Request >>>>>>>>>>>>
    public Long requestBorrowBook(Long bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID: " + bookId));

        User borrower = ((User) connectedUser.getPrincipal());
        User owner = book.getOwner();

        // 1. Business validations (cannot borrow own book, book must not be archived, etc.)
        if (Objects.equals(book.getOwner().getId(), borrower.getId())) {
            throw new OperationNotPermittedException("You cannot borrow your own book");
        }
        if (book.isArchive() || !book.isShareable()) {
            throw new OperationNotPermittedException("The requested book cannot be borrowed");
        }

        // Check if the book is already borrowed or requested by the user
        final boolean isAlreadyBorrowed = bookTransactionHistoryRepository.isAlreadyBorrowedByUser(bookId, borrower.getId());
        if (isAlreadyBorrowed) {
            throw new OperationNotPermittedException("You have already requested or borrowed this book");
        }

        // 2. Create transaction record with pending approval status
        BookTransactionHistory history = BookTransactionHistory.builder()
                .user(borrower)
                .book(book)
                .borrowApproved(false)
                .returned(false)
                .returnApproved(false)
                .build();

        Long savedHistoryId = bookTransactionHistoryRepository.save(history).getId();

        // 3. Send email notification to the book owner
        try {
            emailService.sendBorrowRequestEmail(
                    owner.getEmail(),
                    owner.fullName(),
                    borrower.fullName(),
                    borrower.getEmail(),
                    book.getTitle(),
                    book.getIsbn()
            );
        } catch (MessagingException e) {
            log.error("Failed to send borrow request email", e);
        }

        return savedHistoryId;
    }

    //>>>>>>>>>>>>>> approve borrow Request <<<<<<<<<<<<<<<<<
    public Long approveBorrowRequest(Long historyId, Authentication connectedUser) {
        BookTransactionHistory history = bookTransactionHistoryRepository.findById(historyId)
                .orElseThrow(() -> new EntityNotFoundException("No transaction history found with ID: " + historyId));

        User connected = ((User) connectedUser.getPrincipal());

        // 1. Ensure the connected user is the owner of the book
        if (!Objects.equals(history.getBook().getOwner().getId(), connected.getId())) {
            throw new OperationNotPermittedException("You cannot approve a borrow request for a book you do not own");
        }


        Book book = history.getBook();
        book.setShareable(false);
        bookRepository.save(book);

        // 3. Approve the request
        history.setBorrowApproved(true);
        Long id = bookTransactionHistoryRepository.save(history).getId();
        history = bookTransactionHistoryRepository.findById(historyId)
                .orElseThrow(() -> new EntityNotFoundException("No transaction history found with ID: " + historyId));

        return id;
    }

    //>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<
    public PageResponse<BorrowedBookResponse> findAllBorrowRequests(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<BookTransactionHistory> allBorrowRequests = bookTransactionHistoryRepository.findAllBorrowRequests(pageable, user.getId());

        List<BorrowedBookResponse> bookResponses = allBorrowRequests.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();

        return new PageResponse<>(
                bookResponses,
                allBorrowRequests.getNumber(),
                allBorrowRequests.getSize(),
                allBorrowRequests.getTotalElements(),
                allBorrowRequests.getTotalPages(),
                allBorrowRequests.isFirst(),
                allBorrowRequests.isLast()
        );
    }
}
