package com.yladraoui.book.book;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BorrowedBookResponse {
    private Long id;
    private String title;
    private String authorName;
    private double rate;
    private boolean borrowApproved;
    private boolean returned;
    private boolean returnApproved;
}
