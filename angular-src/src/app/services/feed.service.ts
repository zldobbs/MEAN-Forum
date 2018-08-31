import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  authToken: any;

  constructor(
    private http: Http,
    private jwtHelperService: JwtHelperService,
    private authService: AuthService
  ) { }

  getFeed() {
    return this.http.get('http://localhost:3000/feed/getFeed').pipe(
      map((res) => {
        return res.json();
      })
    )
  }

  addThreadToFeed(feedThread) {
    // only admins can add to the feed
    if (!this.authService.admin()) {
      console.log("unauthorized");;
    }
    let headers = new Headers();
    this.authToken = this.authService.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/feed/addThreadToFeed', feedThread, {headers: headers}).pipe(
      map((res) => {
        return res.json();
      })
    );
  }
}
