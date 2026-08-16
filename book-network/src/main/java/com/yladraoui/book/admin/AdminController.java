package com.yladraoui.book.admin;

import com.yladraoui.book.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("admin")
@RequiredArgsConstructor
@Tag(name = "Admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // Feature 1: Get Dashboard Stats
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // Feature 2: Get All Users
    @GetMapping("/users")
    public ResponseEntity<PageResponse<UserProfile>> findAllUsers(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(adminService.findAllUsers(page, size));
    }

    // Feature 2: Lock / Unlock User Account
    @PatchMapping("/users/{user-id}/lock")
    public ResponseEntity<Void> toggleUserLockStatus(@PathVariable("user-id") Long userId) {
        adminService.toggleUserLockStatus(userId);
        return ResponseEntity.ok().build();
    }

    // Feature 3: Delete Book (Moderation)
    @DeleteMapping("/books/{book-id}")
    public ResponseEntity<Void> deleteBook(@PathVariable("book-id") Long bookId) {
        adminService.deleteBook(bookId);
        return ResponseEntity.ok().build();
    }
}