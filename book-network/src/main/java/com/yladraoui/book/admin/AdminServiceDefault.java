package com.yladraoui.book.admin;

import com.yladraoui.book.book.BookRepository;
import com.yladraoui.book.common.PageResponse;
import com.yladraoui.book.history.BookTransactionHistoryRepository;
import com.yladraoui.book.user.User;
import com.yladraoui.book.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceDefault implements AdminService{

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BookTransactionHistoryRepository transactionRepository;
    private final UserProfileMapper userProfileMapper;

    //Stats
    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalBooks(bookRepository.count())
                .totalBorrowedBooks(transactionRepository.count())
                .build();
    }

    // Manage users
    public PageResponse<UserProfile> findAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);

        List<UserProfile> userResponses = users.stream()
                .map(userProfileMapper::toUserProfile)
                .toList();

        return new PageResponse<>(
                userResponses,
                users.getNumber(),
                users.getSize(),
                users.getTotalElements(),
                users.getTotalPages(),
                users.isFirst(),
                users.isLast()
        );
    }

    // 2. Block/ deblock users
    public void toggleUserLockStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountLocked(!user.isAccountLocked());
        userRepository.save(user);
    }

    // Delete Book
    public void deleteBook(Long bookId) {
        bookRepository.deleteById(bookId);
    }
}