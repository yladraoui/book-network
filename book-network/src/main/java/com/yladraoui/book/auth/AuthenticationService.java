package com.yladraoui.book.auth;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

/**
 * @author $ {USER}
 **/
public interface AuthenticationService {
    public void register(RegistrationRequest request)throws MessagingException;
    public AuthenticationResponse authenticate(@Valid AuthenticationRequest request);
    public void activateAccount(String token)throws MessagingException;
}
