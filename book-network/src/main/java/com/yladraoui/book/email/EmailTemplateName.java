package com.yladraoui.book.email;

import lombok.Getter;

@Getter
public enum EmailTemplateName {
    ACTIVATE_ACCOUNT("activate_account"),
    BORROW_REQUEST("borrow_request")

    ;
    private final String name;

    EmailTemplateName(String name) {
        this.name = name;
    }
}
