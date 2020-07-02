import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private afAuth: AngularFireAuth, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.afAuth.authState.subscribe((userData) => {
                this.authService.getCustomClaimData().then((role) => {
                    if (userData.emailVerified && !route.data.roles || (route.data.roles && route.data.roles.indexOf(role) > -1))
                        observer.next(true);
                    else {
                        observer.next(false);
                    }
                    observer.complete();
                })
            })

        });

    }
}


