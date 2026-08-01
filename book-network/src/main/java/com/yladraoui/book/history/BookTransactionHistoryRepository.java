package com.yladraoui.book.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface BookTransactionHistoryRepository extends JpaRepository<BookTransactionHistory,Integer> {

    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.user.id = :userId
            """)
    Page<BookTransactionHistory> findAllBorrowedBooks(Pageable pageable, Long userId);

    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.book.owner.id = :userId
            """)
    Page<BookTransactionHistory> findAllReturnedBooks(Pageable pageable, Long id);

    @Query("""
            SELECT (count(*) > 0) as isBorrowed
            FROM BookTransactionHistory history
            WHERE history.user.id = :userId
            AND history.book.id = :bookId
            AND history.returnApproved = false
             
            """)
    boolean isAlreadyBorrowedByUser(Integer bookId, Long userId);

    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.user.id = :userId
            AND history.book.id = :bookId
            AND history.returnApproved = false
            AND history.returned = false
            """)
    Optional<BookTransactionHistory> findByBookIdAndUserId(Integer bookId, Long userId);

    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.book.owner.id = :userId
            AND history.book.id = :bookId
            AND history.returnApproved = false
            AND history.returned = true
            """)
    Optional<BookTransactionHistory> findByBookIdAndOwnerId(Integer bookId, Long userId);
}
