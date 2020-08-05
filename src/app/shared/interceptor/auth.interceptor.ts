import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { fromPromise } from 'rxjs/observable/fromPromise';
import { AuthService } from '../services/authentication.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Exclude interceptor for login request:
        //TODO: Put this thing in Array 
        if (request.url.indexOf('/api/validateCaptcha') > -1 || request.url.indexOf('assets/i18n') > -1) {

            return next.handle(request);
        }
        return from(this.authService.getUserToken())
            .pipe(
                switchMap(token => {
                    const headers = request.headers
                        .set('Authorization', 'Bearer ' + token)
                        .append('Content-Type', 'application/json');
                    const requestClone = request.clone({
                        headers
                    });
                    return next.handle(requestClone);
                })
            );
    }
}
