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

    get userRoles(): string[] {
        const token = this.token;
        if (!token) {
        return [];
        }

        try {
        // Décodage du token JWT
        const decodedToken: any = jwtDecode(token);

        // Selon la structure de votre backend Spring Security / Keycloak :
        // 1. Si vous utilisez Spring Security avec un claim "authorities" ou "roles"
        // 2. Si vous utilisez Keycloak (ex: realm_access.roles)
        return decodedToken.authorities || 
                decodedToken.roles || 
                decodedToken.realm_access?.roles || 
                [];
        } catch (error) {
        console.error('Erreur lors du décodage des rôles du token', error);
        return [];
        }
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