import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileGuard implements CanActivate {

    constructor(private router: Router, private afAuth: AngularFireAuth, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.afAuth.authState.subscribe((userData) => {
                this.authService.getLoggedInUserDetails().then((profileImageData) => {
                    if (this.isOnboardingProcessDone(profileImageData))
                        observer.next(true);
                    else {
                        this.router.navigate(['/app/settings/profile-settings'], { queryParams: { incomplete: 'profile' } });
                    }
                    observer.complete();
                })
            })

        });

    }
    isOnboardingProcessDone(memberDetails) {

        if ((!memberDetails.bio && !memberDetails.biography_en && !memberDetails.biography_es && !memberDetails.biography_fr) ||
            !memberDetails.avatar || !memberDetails.avatar.url)
            return false;
        else
            return true;
    }
}


