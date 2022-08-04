import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PlaylistService {
  endpoint: string;
  constructor(private http: HttpClient) {
    this.endpoint = `${environment.baseAPIDomain}/api/v1/playlists`;
  }

  getPlaylists(): Observable<any[]> {
    return this.http.get<any[]>(this.endpoint);
  }

  postPlaylist(playlist: any): Observable<any> {
    return this.http.post<any>(this.endpoint, playlist);
  }

  putPlaylist(playlist: any): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/${playlist.id}`, playlist);
  }
}
