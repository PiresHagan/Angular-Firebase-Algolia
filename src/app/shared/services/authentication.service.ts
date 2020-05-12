import { Injectable, NgZone } from "@angular/core";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { User } from "../interfaces/user.type";
import { UserService } from "./user.service";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: "root",
})
export class AuthService {
    userData: any; // Save logged in user data

    private isLoggedInUser = new BehaviorSubject<boolean>(false);
    isLoggedInUserChanges: Observable<boolean> = this.isLoggedInUser.asObservable();

    constructor(
        public afs: AngularFirestore, // Inject Firestore service
        public afAuth: AngularFireAuth, // Inject Firebase auth service
        public router: Router,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
        public userService: UserService
    ) {

        console.log(this.afAuth.currentUser);
        /* Saving user data in localstorage when
        logged in and setting up null when logged out */
        this.afAuth.authState.subscribe((user) => {
            if (user && !user.isAnonymous) {
                this.userData = user;
                this.saveUserInfo(user.uid);
                this.changeUserStatus(true);
                localStorage.setItem("user", JSON.stringify(this.userData));
                JSON.parse(localStorage.getItem("user"));
                //localStorage.setItem("isAnonymusUserLoggedIn", 'false');
            } else {
                this.changeUserStatus(false);
                localStorage.setItem("user", null);
                // localStorage.setItem("isAnonymusUserLoggedIn", 'true');
                if (environment && environment.isAnonymousUserEnabled) {
                    this.afAuth.signInAnonymously().catch(function (error) {
                        console.log('anonymusly login');
                    });
                }


            }
        });
    }

    // Sign in with email/password
    SignIn(email, password) {
        return this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
                this.SetUserData(result.user);
            })
            .catch((error) => {
                throw error;
            });
    }

    // Sign up with email/password
    SignUp(email, password) {
        return this.afAuth
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                /* Call the SendVerificaitonMail() function when new user sign
                up and returns promise */
                this.SendVerificationMail(result);
                this.SetUserData(result.user);
            })
            .catch((error) => {
                window.alert(error.message);
            });
    }

    // Send email verfificaiton when new user sign up
    SendVerificationMail(result) {
        return result.user.sendEmailVerification().then(() => {
            this.router.navigate(["verify-email-address"]);
        });
    }

    // Reset Forggot password
    ForgotPassword(passwordResetEmail) {
        return this.afAuth
            .sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert("Password reset email sent, check your inbox.");
            })
            .catch((error) => {
                window.alert(error);
            });
    }

    // Returns true when user is looged in and email is verified
    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem("user"));
        //return (user !== null && user.emailVerified !== false) ? true : false;
        return user !== null ? true : false;
    }

    /* Setting up user data when sign in with username/password,
    sign up with username/password and sign in with social auth
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
    SetUserData(user) {
        //  this.changeUserStatus(true);
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(
            `users/${user.uid}`
        );
        const userData: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            biography: user.biography,
            phone: user.phone,
            birth: user.birth
        };

        localStorage.setItem("user", JSON.stringify(userData));
        return userRef.set(
            { ...userData },
            {
                merge: true,
            }
        );
    }

    public signout(): Promise<any> {
        this.changeUserStatus(false);
        return this.afAuth.signOut();

    }
    private saveUserInfo(uid: string) {
        this.userService.getUser(uid).subscribe(snapshot => {
            this.userService.saveUser(snapshot);

        });
    }
    changeUserStatus(loginStatus: boolean) {
        this.isLoggedInUser.next(loginStatus);
    }
}
