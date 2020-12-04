import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorService } from '../services/author.service';

@Injectable({
    providedIn: 'root'
})
export class BlockedProfileGuard implements CanActivate {

    constructor(private authorService: AuthorService) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            const slug = route.paramMap.get('slug');

            if (!slug) {
                observer.next(false);
                observer.complete();
                return
            }
            this.authorService.getUserBySlug(slug).subscribe((profileImageData) => {
                if (!profileImageData['blocked'])
                    observer.next(true);
                else {
                    observer.next(false);
                }
                observer.complete();
            })

        });

    }

}


