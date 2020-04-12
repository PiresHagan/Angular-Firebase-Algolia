import {Injectable} from '@angular/core';
import {Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private afAuth: AngularFireAuth) { }

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // if (localStorage.getItem('currentUser')) {
        //     return true;
        // }
        // this.router.navigate(['authentication/login-1'], { queryParams: { returnUrl: state.url }});
        // return false;

        //return true;

        const user = await this.afAuth.currentUser;
        const isLoggedIn = !!user;
        if (!isLoggedIn) {
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
            console.log();
            return false;
        }
        return isLoggedIn;
    }
}
