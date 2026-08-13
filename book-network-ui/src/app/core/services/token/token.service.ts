import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";

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

        try {
            const decoded: any = jwtDecode(token);
            const isExpired = decoded.exp * 1000 < Date.now();

            if(isExpired){
                localStorage.removeItem('token');
                return false;
            }
            return true;
        } catch (e) {
            localStorage.removeItem('token');
            return false;
        }
    }

    clearToken() {
        localStorage.removeItem('token');
    }
}