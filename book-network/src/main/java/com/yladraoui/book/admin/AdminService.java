package com.yladraoui.book.admin;


import com.yladraoui.book.common.PageResponse;

public interface AdminService {
    public AdminStatsResponse getStats();
    public PageResponse<UserProfile> findAllUsers(int page, int size);
    public void toggleUserLockStatus(Long userId);
    public void deleteBook(Long bookId);

}
