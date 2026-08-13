import { HttpInterceptorFn } from "@angular/common/http";
import { inject} from "@angular/core";
import { TokenService } from "../services/token/token.service";

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(TokenService);
    const token = tokenService.token;

    if (req.url.includes('/auth/authenticate') || req.url.includes('/auth/register')){
        return next(req);
    }

    if (token) {
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        })
        return next(authReq);
    }

    return next(req);
}