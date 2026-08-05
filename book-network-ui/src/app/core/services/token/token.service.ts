import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class TokenService{

    set token(token:string) {
        localStorage.setItem('token', token);
    }

    get token(): string |null {
        return localStorage.getItem('token');
    }

    isTokenValid(): boolean {
        const token = this.token;
        if(!token){
            return false;
        }
        return true;
    }

    clearToken() {
        localStorage.removeItem('token');
    }
}