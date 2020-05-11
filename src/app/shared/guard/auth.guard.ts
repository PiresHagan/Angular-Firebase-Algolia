import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private afAuth: AngularFireAuth, private userService: UserService) { }

    canActivate(): Observable<boolean> {

        return this.afAuth.authState.pipe(map(user => user !== null));
    }
}
