import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/shared/services/authentication.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PendingService {
  user: any;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.getUser();
  }

  async getUser() {
    this.user = await this.authService.getLoggedInUserDetails();
    console.warn(this.user);
  }

  addPreference(topics: string): Observable<string> {
    return this.http.post<string>(
      `${environment.baseAPIDomain}/api/v1/onboarding/${this.user.id}/addtopics`,
      { topics: topics }
    );
  }

  addPromoCode(code: string): Observable<any> {
    return this.http.post<string>(
      `${environment.baseAPIDomain}/api/v1/onboarding/${this.user.id}/promocode`,
      { code: code }
    );
  }
}
