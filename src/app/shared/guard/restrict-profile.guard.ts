import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authentication.service';
import { ADVISOR, COMPANY, ECOMMERCE, FUNDRAISER, GUESTPOST, HOSTEVENT, INFLUENCERMARKETPLACE, INVESTMENT, JOB, MEMBER, ONLINECOURSE, PAIDPREMIUMGROUP, POLITICIAN, RESTAURANT, SERVICES, VACATIONSRENTALS } from '../constants/member-constant';


@Injectable({
  providedIn: 'root'
})
export class RestrictProfileGuard implements CanActivate {
  userType: string;

  constructor(private router: Router, private afAuth: AngularFireAuth, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return new Observable<boolean>((observer) => {
        this.afAuth.authState.subscribe((userData) => {
            this.authService.getLoggedInUserDetails().then((profileImageData) => {
              this.userType = profileImageData?.user_type ? profileImageData?.user_type : profileImageData?.type ;
              if (this.isUserTypeAvailable(profileImageData)){
                observer.next(true);
              } else {                 
                if (
                    this.userType == FUNDRAISER ||
                    this.userType == ECOMMERCE  ||
                    this.userType == MEMBER  ||
                    this.userType == GUESTPOST ||
                    this.userType == ADVISOR ||
                    this.userType == ONLINECOURSE ||
                    this.userType == JOB ||
                    this.userType == PAIDPREMIUMGROUP ||
                    this.userType == INFLUENCERMARKETPLACE ||
                    this.userType == RESTAURANT ||
                    this.userType == HOSTEVENT ||
                    this.userType == POLITICIAN ||
                    this.userType == INVESTMENT ||
                    this.userType == VACATIONSRENTALS ||
                    this.userType == SERVICES ||
                    this.userType == PAIDPREMIUMGROUP
                  ) {
                    this.router.navigate(["/auth/import-contact"]);
                  } else if (this.userType == COMPANY) {
                    this.router.navigate(["auth/company"]);
                  } else {
                    this.router.navigate(["/auth/website"]);
                  }
              }
              observer.complete();
            })
        })
    });
  }

  isUserTypeAvailable(memberDetails) {
    this.userType = memberDetails?.user_type ? memberDetails?.user_type : memberDetails?.type ;
    if (this.userType && memberDetails.avatar)
        return false;
    else
        return true;
  }
  
}
